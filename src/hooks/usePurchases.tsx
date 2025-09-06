/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/usePurchases.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "./useAxios";

export const useUserPurchases = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["purchases", "user"],
    queryFn: async () => {
      const response = await axios.get("/api/purchase/user/me"); // You might need to adjust this endpoint
      return response.data.data;
    },
    staleTime: 60000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreatePurchaseFromCart = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    // payload expects: { cartId: string, paymentMethod?: string, customerInfo?: any }
    mutationFn: async (payload: {
      cartId: string;
      paymentMethod?: string;
      customerInfo?: any;
    }) => {
      const response = await axios.post(
        "/api/purchase/create-from-cart",
        payload
      );
      const res = response.data;

      // server might return in different shapes, try to be flexible
      // possible shapes:
      // { data: { purchase: {...} } }
      // { data: {...purchase...} }
      // { purchase: {...} }
      // { data: {...} }
      const candidate =
        res?.data?.purchase ?? res?.purchase ?? res?.data ?? res;

      if (!candidate || (!candidate._id && !candidate.id)) {
        // still return candidate so caller can inspect error, but throw so mutation fails
        throw new Error("Unexpected create purchase response");
      }

      return candidate;
    },
    onSuccess: (_purchase, variables) => {
      // invalidate cart and cartSummary for the cartId used
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (variables?.cartId) {
        queryClient.invalidateQueries({
          queryKey: ["cartSummary", variables.cartId],
        });
      }
    },
  });
};

export const useUpdatePurchasePayment = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    // payload: { purchaseId: string, body: any }
    mutationFn: async (payload: { purchaseId: string; body?: any }) => {
      const { purchaseId, body } = payload;
      const response = await axios.patch(
        `/api/purchase/${purchaseId}/payment`,
        body
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      // invalidate orders/purchases if you have such queries
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      if (variables?.purchaseId) {
        queryClient.invalidateQueries({
          queryKey: ["purchase", variables.purchaseId],
        });
      }
    },
  });
};
