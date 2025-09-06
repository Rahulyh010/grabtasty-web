/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "./useAxios"; // Your authenticated axios hook

export const useCart = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await axios.get("/api/cart/user/me");
      return response.data.data;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddToCart = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartData: {
      kitchenId: string;
      comboId: string;
      durationType: string;
      durationValue: number;
      startDate?: string;
      customerPreferences?: any;
    }) => {
      const response = await axios.post("/api/cart/add", cartData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartItem = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: {
      cartId: string;
      itemId: string;
      durationValue: number;
    }) => {
      const response = await axios.put(
        `/api/cart/${updateData.cartId}/item/${updateData.itemId}`,
        { durationValue: updateData.durationValue }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCart = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartId,
      itemId,
    }: {
      cartId: string;
      itemId: string;
    }) => {
      const response = await axios.delete(`/api/cart/${cartId}/item/${itemId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
