/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";

export const FloatingCartButton = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: cartData, isLoading } = useCart();
  const updateCartMutation = useUpdateCartItem();
  const removeCartMutation = useRemoveFromCart();

  const cart = cartData?.cart;
  const itemCount = cart?.items?.length || 0;
  const totalAmount = cart?.finalTotal || 0;

  // Don't show if no items
  if (isLoading || !cart || itemCount === 0) {
    return null;
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const handleUpdateQuantity = async (
    cartId: string,
    itemId: string,
    newValue: number
  ) => {
    if (newValue <= 0) {
      await removeCartMutation.mutateAsync({ cartId, itemId });
    } else {
      await updateCartMutation.mutateAsync({
        cartId,
        itemId,
        durationValue: newValue,
      });
    }
  };

  const handleRemoveItem = async (cartId: string, itemId: string) => {
    await removeCartMutation.mutateAsync({ cartId, itemId });
  };

  const goToCheckout = () => {
    router.push(`/checkout?cartId=${cart._id}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded Cart View */}
      {isExpanded && (
        <Card className="mb-4 w-80 max-h-96 shadow-2xl border-0 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Cart</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 max-h-60 overflow-y-auto">
            {cart.items.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {item.planName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {item.durationType} • {item.cuisineType}
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-6 h-6 p-0"
                    onClick={() =>
                      handleUpdateQuantity(
                        cart._id,
                        item._id,
                        item.durationValue - 1
                      )
                    }
                    disabled={updateCartMutation.isPending}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <span className="w-6 text-center text-sm font-medium">
                    {item.durationValue}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-6 h-6 p-0"
                    onClick={() =>
                      handleUpdateQuantity(
                        cart._id,
                        item._id,
                        item.durationValue + 1
                      )
                    }
                    disabled={updateCartMutation.isPending}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(cart._id, item._id)}
                    disabled={removeCartMutation.isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-lg">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={goToCheckout}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Checkout
            </Button>
          </div>
        </Card>
      )}

      {/* Floating Cart Button */}
      <div className="relative">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700 shadow-2xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ShoppingCart className="w-6 h-6" />
        </Button>

        {/* Item Count Badge */}
        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-6 h-6 flex items-center justify-center rounded-full text-xs">
          {itemCount}
        </Badge>

        {/* Total Amount Badge */}
        <div className="absolute -bottom-2 -left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
          {formatCurrency(totalAmount)}
        </div>

        {/* Expand/Collapse Indicator */}
        <div className="absolute top-1 right-1">
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-white" />
          ) : (
            <ChevronUp className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
    </div>
  );
};
