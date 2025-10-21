/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef } from "react";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { useRouter } from "next/navigation";

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}

export const useAxios = () => {
  const router = useRouter();
  const isRefreshing = useRef(false);
  const failedQueue = useRef<QueuedRequest[]>([]);

  const getAccessToken = (): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/accessToken=([^;]+)/);
    return match ? match[1] : null;
  };

  const logout = () => {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.replace("/signin");
  };

  const api = useMemo(() => {
    const instance: AxiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      withCredentials: true,
    });

    // Request interceptor - attach access token
    instance.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - catch 401 and refresh token
    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // If not 401 or no config, just reject
        if (error.response?.status !== 401 || !originalRequest) {
          return Promise.reject(error);
        }

        // Prevent infinite loops
        if (originalRequest._retry) {
          logout();
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        // If already refreshing, queue this request
        if (isRefreshing.current) {
          return new Promise((resolve, reject) => {
            failedQueue.current.push({
              resolve,
              reject,
              config: originalRequest,
            });
          });
        }

        // Start refresh process
        isRefreshing.current = true;

        try {
          // HIT REFRESH TOKEN ENDPOINT
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          // Refresh successful - get new token and retry all queued requests
          const newToken = getAccessToken();

          // Process all queued failed requests
          const queuedRequests = [...failedQueue.current];
          failedQueue.current = [];

          // Retry all queued requests with new token
          queuedRequests.forEach((queuedRequest) => {
            if (newToken) {
              queuedRequest.config.headers.Authorization = `Bearer ${newToken}`;
            }
            instance(queuedRequest.config)
              .then((response) => queuedRequest.resolve(response))
              .catch((err) => queuedRequest.reject(err));
          });

          // Retry the original request
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh failed - reject all queued requests and logout
          const queuedRequests = [...failedQueue.current];
          failedQueue.current = [];

          queuedRequests.forEach((queuedRequest) => {
            queuedRequest.reject(refreshError);
          });

          // logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing.current = false;
        }
      }
    );

    return instance;
  }, [router]);

  return api;
};
