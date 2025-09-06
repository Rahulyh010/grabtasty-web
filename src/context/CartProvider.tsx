/* eslint-disable @typescript-eslint/no-explicit-any */
// context/CartProvider.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";

// Types matching your backend
interface CartItem {
  _id: string;
  comboId: string;
  kitchenId: string;
  systemCode: string;
  planName: string;
  cuisineType: string;
  description: string;
  pattern: string;
  durationType: "WEEKLY" | "MONTHLY" | "QUARTERLY";
  durationValue: number;
  unitPrice: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  customerPreferences: {
    starchChoice?: "CHAPATI" | "RICE" | "BOTH";
    spiceLevel?: "LOW" | "MEDIUM" | "HIGH";
    portionSize?: "REGULAR" | "LARGE";
  };
  addedAt: string;
  systemCodeInfo?: any;
}

interface Cart {
  _id: string;
  userId: string;
  kitchenId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  taxes: number;
  finalTotal: number;
  status: "ACTIVE" | "CHECKED_OUT" | "EXPIRED" | "ABANDONED";
  expiresAt: string;
  deliveryAddress?: string;
  deliveryPincode?: string;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  timeRemaining: number;
  itemsCount: number;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CART"; payload: Cart | null }
  | { type: "SET_TIME_REMAINING"; payload: number }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_ITEM"; payload: { itemId: string; item: CartItem } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | {
      type: "UPDATE_TOTALS";
      payload: {
        subtotal: number;
        discount: number;
        taxes: number;
        finalTotal: number;
      };
    };

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  timeRemaining: 0,
  itemsCount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        itemsCount: action.payload?.items.length || 0,
        isLoading: false,
        error: null,
      };
    case "SET_TIME_REMAINING":
      return { ...state, timeRemaining: action.payload };
    case "ADD_ITEM":
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.payload],
        },
        itemsCount: state.cart.items.length + 1,
      };
    case "UPDATE_ITEM":
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item._id === action.payload.itemId ? action.payload.item : item
          ),
        },
      };
    case "REMOVE_ITEM":
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item._id !== action.payload),
        },
        itemsCount: state.cart.items.length - 1,
      };
    case "CLEAR_CART":
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [],
          subtotal: 0,
          discount: 0,
          taxes: 0,
          finalTotal: 0,
        },
        itemsCount: 0,
      };
    case "UPDATE_TOTALS":
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addToCart: (item: any) => Promise<void>;
  updateCartItem: (itemId: string, updates: any) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<void>;
  updateDeliveryAddress: (address: string, pincode: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartSummary: () => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Helper function for API calls
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "API request failed");
    }

    return response.json();
  };

  // Load user cart on mount
  useEffect(() => {
    if (userId) {
      refreshCart();
    }
  }, [userId]);

  // Timer for cart expiration
  useEffect(() => {
    if (!state.cart?.expiresAt) return;

    const updateTimer = () => {
      const remaining = new Date(state.cart!.expiresAt).getTime() - Date.now();
      dispatch({ type: "SET_TIME_REMAINING", payload: Math.max(0, remaining) });

      if (remaining <= 0) {
        toast.error("Your cart has expired");
        dispatch({ type: "SET_CART", payload: null });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [state.cart?.expiresAt]);

  const refreshCart = async () => {
    if (!userId) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await apiCall(`/api/cart/user/${userId}`);

      if (response.data.cart) {
        dispatch({ type: "SET_CART", payload: response.data.cart });
        dispatch({
          type: "SET_TIME_REMAINING",
          payload: response.data.timeRemaining || 0,
        });
      } else {
        dispatch({ type: "SET_CART", payload: null });
      }
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error("Failed to load cart");
    }
  };

  const addToCart = async (itemData: any) => {
    if (!userId) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const payload = {
        userId,
        ...itemData,
        customerPreferences: {
          starchChoice: "BOTH",
          ...itemData.customerPreferences,
        },
      };

      const response = await apiCall("/api/cart/add", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      dispatch({ type: "SET_CART", payload: response.data.cart });
      toast.success(response.data.message);
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.message || "Failed to add item to cart");
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, updates: any) => {
    if (!state.cart) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await apiCall(
        `/api/cart/${state.cart._id}/item/${itemId}`,
        {
          method: "PUT",
          body: JSON.stringify(updates),
        }
      );

      dispatch({ type: "SET_CART", payload: response.data.cart });
      toast.success("Cart updated successfully");
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.message || "Failed to update cart item");
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!state.cart) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await apiCall(
        `/api/cart/${state.cart._id}/item/${itemId}`,
        {
          method: "DELETE",
        }
      );

      dispatch({ type: "SET_CART", payload: response.data.cart });
      toast.success("Item removed from cart");
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.message || "Failed to remove item from cart");
      throw error;
    }
  };

  const clearCart = async () => {
    if (!state.cart) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await apiCall(`/api/cart/${state.cart._id}/clear`, {
        method: "DELETE",
      });

      dispatch({ type: "SET_CART", payload: response.data.cart });
      toast.success("Cart cleared successfully");
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.message || "Failed to clear cart");
      throw error;
    }
  };

  const applyCoupon = async (couponCode: string) => {
    if (!state.cart) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await apiCall(`/api/cart/${state.cart._id}/coupon`, {
        method: "PATCH",
        body: JSON.stringify({ couponCode }),
      });

      dispatch({ type: "SET_CART", payload: response.data.cart });
      toast.success(response.data.discountMessage);
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.message || "Failed to apply coupon");
      throw error;
    }
  };

  const updateDeliveryAddress = async (address: string, pincode: string) => {
    if (!state.cart) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await apiCall(
        `/api/cart/${state.cart._id}/delivery-address`,
        {
          method: "PATCH",
          body: JSON.stringify({
            deliveryAddress: address,
            deliveryPincode: pincode,
          }),
        }
      );

      dispatch({ type: "SET_CART", payload: response.data.cart });
      toast.success("Delivery address updated");
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.message || "Failed to update delivery address");
      throw error;
    }
  };

  const getCartSummary = async () => {
    if (!state.cart) return null;

    try {
      const response = await apiCall(`/api/cart/${state.cart._id}/summary`);
      return response.data.summary;
    } catch (error: any) {
      toast.error(error.message || "Failed to get cart summary");
      throw error;
    }
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    updateDeliveryAddress,
    refreshCart,
    getCartSummary,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export type { Cart, CartItem };
