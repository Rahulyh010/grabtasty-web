/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FailedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

export const useAxios = () => {
  const router = useRouter();
  const failedQueueRef = useRef<FailedRequest[]>([]);
  const isRefreshingRef = useRef(false);

  // Get accessToken from cookies
  const getAccessToken = () => {
    if (typeof document === "undefined") return null;
    return document.cookie
      .split(";")
      .find((row) => row.trim().startsWith("accessToken="))
      ?.split("=")[1];
  };

  // // Check if refresh token exists
  // const hasRefreshToken = () => {
  //   if (typeof document === "undefined") return false;
  //   return document.cookie
  //     .split(";")
  //     .some((row) => row.trim().startsWith("refreshToken="));
  // };

  // Proactively refresh token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshApi = axios.create({
        // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        withCredentials: true,
      });

      await refreshApi.post("/auth/refresh");
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  // Process failed requests after refresh
  const processQueue = (error: unknown) => {
    failedQueueRef.current.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
    failedQueueRef.current = [];
  };

  // 🚀 Create axios instance synchronously using useMemo
  const api = useMemo(() => {
    const axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      withCredentials: true,
    });

    // Enhanced request interceptor with proactive token management
    axiosInstance.interceptors.request.use(async (config) => {
      let token = getAccessToken();

      // If no access token but refresh token exists, try to get new access token
      if (!token) {
        const refreshSuccess = await refreshToken();
        console.log("Refresh success:watch out", refreshSuccess);

        // Check if already refreshing to avoid multiple simultaneous refresh attempts
        if (isRefreshingRef.current || !refreshSuccess) {
          // Wait for ongoing refresh
          return new Promise((resolve, reject) => {
            failedQueueRef.current.push({
              resolve: () => resolve(config),
              reject,
            });
          });
        }

        isRefreshingRef.current = true;

        try {
          // const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Get the new token after refresh
            token = getAccessToken();
            processQueue(null);
          } else {
            // Refresh failed, redirect to login
            processQueue(new Error("Token refresh failed"));
            router.push("/signin");
            return Promise.reject(new Error("Authentication failed"));
          }
        } catch (error) {
          processQueue(error);
          router.push("/signin");
          return Promise.reject(error);
        } finally {
          isRefreshingRef.current = false;
        }
      }

      // Add token to request if available
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // Handle 401 responses (fallback)
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          // Queue request if already refreshing
          if (isRefreshingRef.current) {
            return new Promise((resolve, reject) => {
              failedQueueRef.current.push({ resolve, reject });
            }).then(() => axiosInstance(originalRequest));
          }

          originalRequest._retry = true;
          isRefreshingRef.current = true;

          try {
            const refreshSuccess = await refreshToken();

            if (refreshSuccess) {
              processQueue(null);
              return axiosInstance(originalRequest);
            } else {
              throw new Error("Refresh failed");
            }
          } catch (refreshError) {
            processQueue(refreshError);
            router.push("/signin");
            return Promise.reject(refreshError);
          } finally {
            isRefreshingRef.current = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }, [router]); // Only recreate if router changes

  return api;
};
