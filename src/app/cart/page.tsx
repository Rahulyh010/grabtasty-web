/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  Utensils,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const updateCartMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();

  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUpdateQuantity = async (
    itemId: string,
    newDurationValue: number
  ) => {
    if (newDurationValue <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      await updateCartMutation.mutateAsync({
        cartId: cart._id,
        itemId: itemId,
        durationValue: newDurationValue,
      });
    } catch (error) {
      console.error("Failed to update item:", error);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      await await removeFromCartMutation.mutateAsync({
        cartId: cart._id,
        itemId: itemId,
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleCheckout = () => {
    // Redirect to checkout page
    router.push("/checkout?cartId=" + cart._id);
  };

  const handleContinueShopping = () => {
    router.back();
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 animate-spin" />
          <span>Loading your cart...</span>
        </div>
      </div>
    );
  }

  const cart = cartData?.cart;
  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Add some delicious subscriptions to get started
              </p>
              <Button onClick={handleContinueShopping} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleContinueShopping}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-sm text-gray-600">
                {cart.items.length} item{cart.items.length > 1 ? "s" : ""} in
                your cart
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Kitchen Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Utensils className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {cart.kitchenId.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{cart.kitchenId.address}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{cart.kitchenId.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <div className="space-y-3">
              {cart.items.map((item: any) => {
                const isUpdating = updatingItems.has(item._id);

                return (
                  <Card key={item._id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        {/* Item Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {item.planName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {item.cuisineType} • {item.description}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                item.systemCodeInfo?.mealType === "BREAKFAST"
                                  ? "bg-orange-50 text-orange-700 border-orange-200"
                                  : item.systemCodeInfo?.mealType === "LUNCH"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              }`}
                            >
                              {item.systemCodeInfo?.mealType || "MEAL"}
                            </Badge>
                          </div>

                          {/* Subscription Details */}
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="bg-gray-50 p-2 rounded text-sm">
                              <span className="text-gray-600">Duration:</span>
                              <span className="ml-1 font-medium">
                                {item.durationValue}{" "}
                                {item.durationType.toLowerCase()}
                              </span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded text-sm">
                              <span className="text-gray-600">Pattern:</span>
                              <span className="ml-1 font-medium">
                                {item.pattern}
                              </span>
                            </div>
                          </div>

                          {/* Date Range */}
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(item.startDate)} -{" "}
                                {formatDate(item.endDate)}
                              </span>
                            </div>
                          </div>

                          {/* Preferences */}
                          {item.customerPreferences && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.customerPreferences.starchChoice !==
                                "BOTH" && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.customerPreferences.starchChoice}
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {item.customerPreferences.spiceLevel} Spice
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {item.customerPreferences.portionSize} Portion
                              </Badge>
                            </div>
                          )}

                          {/* Quantity Controls & Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id,
                                    item.durationValue - 1
                                  )
                                }
                                disabled={isUpdating || item.durationValue <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>

                              <span className="text-lg font-semibold min-w-[2rem] text-center">
                                {isUpdating ? "..." : item.durationValue}
                              </span>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id,
                                    item.durationValue + 1
                                  )
                                }
                                disabled={isUpdating}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item._id)}
                                disabled={isUpdating}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {formatCurrency(item.unitPrice)} each
                              </p>
                              <p className="text-lg font-bold text-green-600">
                                {formatCurrency(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(cart.subtotal)}
                    </span>
                  </div>

                  {cart.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(cart.discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">
                      {formatCurrency(cart.taxes)}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(cart.finalTotal)}
                  </span>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">Delivery Information</p>
                      <p>
                        Your subscription will start from the selected date.
                        Meals are prepared fresh daily by {cart.kitchenId.name}.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Continue Shopping */}
                <Button
                  variant="outline"
                  onClick={handleContinueShopping}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
