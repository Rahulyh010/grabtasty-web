/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxios } from "./useAxios";

export type CustomerPreferences = {
  starchChoice?: string;
  spiceLevel?: string;
  portionSize?: string;
};

export interface CartItem {
  _id: string;
  comboId: string;
  kitchenId: string;
  systemCode?: string;
  planName: string;
  cuisineType?: string;
  description?: string;
  pattern?: string;
  durationType: string;
  durationValue: number;
  unitPrice: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  addedAt?: string;
  customerPreferences?: CustomerPreferences;
  systemCodeInfo?: any;
}

export interface CartItemBreakdown extends CartItem {
  totalDays?: number;
  systemCodeInfo?: {
    name?: string;
    pattern?: string;
    patternDescription?: string;
    mealType?: string;
    description?: string;
    daysPerWeek?: number;
    baseCount?: string;
  };
}

export interface CartObject {
  _id: string;
  userId: { _id: string; name?: string; email?: string; phone?: string };
  kitchenId: {
    _id: string;
    name?: string;
    address?: string;
    pincodes?: string[];
    phone?: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  taxes: number;
  finalTotal: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CartSummary {
  cart: CartObject;
  itemsBreakdown: CartItemBreakdown[];
  pricing: {
    subtotal: number;
    discount: number;
    taxes: number;
    finalTotal: number;
    savings: number;
  };
  readyForCheckout: boolean;
  timeRemaining?: number;
}

export const useCartSummary = (cartId: string | null) => {
  const axios = useAxios();

  return useQuery<CartSummary>({
    queryKey: ["cartSummary", cartId],
    queryFn: async () => {
      if (!cartId) throw new Error("Cart ID is required");
      const response = await axios.get(`/api/cart/${cartId}/summary`);
      const res = response.data;

      // handle several possible response shapes:
      // { message, summary: {...} }
      // { data: { summary: {...} } }
      // or directly the summary object
      const maybeSummary =
        res?.summary ?? res?.data?.summary ?? res?.data ?? res;

      if (!maybeSummary || (!maybeSummary.cart && !maybeSummary.pricing)) {
        throw new Error("Unexpected cart summary response shape");
      }

      return maybeSummary as CartSummary;
    },
    enabled: !!cartId,
    staleTime: 30000, // 30s
    gcTime: 5 * 60 * 1000, // 5 minutes (kept your style)
  });
};
