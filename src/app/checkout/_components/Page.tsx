/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, ArrowLeft, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartSummary } from "@/hooks/useCartSummary";
import {
  useCreatePurchaseFromCart,
  useUpdatePurchasePayment,
} from "@/hooks/usePurchases";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");

  const { data: summary, isLoading, isFetching } = useCartSummary(cartId);
  const createPurchase = useCreatePurchaseFromCart();
  const updatePayment = useUpdatePurchasePayment();

  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const handleBack = () => {
    router.push("/cart");
  };

  const validateCustomerInfo = () => {
    const { name, phone, email, address, pincode } = customerInfo;
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!address.trim() || address.length < 8) {
      toast.error("Please enter a complete address");
      return false;
    }
    if (!pincode.trim() || !/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!cartId) {
      toast.error("Cart ID missing");
      return;
    }
    if (!validateCustomerInfo()) return;

    setIsProcessing(true);
    try {
      // 1) Create purchase from cart
      const purchase = await createPurchase.mutateAsync({
        cartId,
        paymentMethod: "RAZORPAY",
        customerInfo,
      });

      const purchaseId =
        purchase._id ?? purchase.id ?? purchase.purchaseId ?? null;

      if (!purchaseId) {
        throw new Error("Unable to read purchase id from response");
      }

      // 2) Dummy mark payment as successful
      await updatePayment.mutateAsync({
        purchaseId,
        body: {
          paymentStatus: "SUCCESS",
          razorpayPaymentId: "DUMMY_PAYMENT_ID",
          transactionId: "DUMMY_TXN_ID",
        },
      });

      toast.success("Payment successful — redirecting to order details");
      router.push(`/orders/${purchaseId}?success=true`);
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err?.message ?? "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 animate-pulse text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Checkout Error
          </h2>
          <p className="text-gray-600 mb-4">
            No summary returned for this cart.
          </p>
          <Link href="/cart">
            <Button>Back to Cart</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pricing = summary.pricing ?? {
    subtotal: summary.cart.subtotal,
    discount: summary.cart.discount,
    taxes: summary.cart.taxes,
    finalTotal: summary.cart.finalTotal,
    savings: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Cart
              </button>
            </div>

            {summary.timeRemaining && summary.timeRemaining > 0 && (
              <div className="flex items-center text-orange-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  Cart expires in {Math.floor(summary.timeRemaining / 60000)}m
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.cart.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-start pb-4 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.planName}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.cuisineType}
                        </p>
                        <div className="text-xs text-gray-500 mt-2">
                          <p>
                            {item.durationValue}{" "}
                            {item.durationType.toLowerCase()}
                          </p>
                          <p>
                            {new Date(item.startDate).toLocaleDateString()} -{" "}
                            {new Date(item.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold">
                          {formatCurrency(item.totalPrice)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(item.unitPrice)}/
                          {item.durationType.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery / Customer */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery & Customer Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo((p) => ({
                          ...p,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo((p) => ({
                          ...p,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={customerInfo.pincode}
                      onChange={(e) =>
                        setCustomerInfo((p) => ({
                          ...p,
                          pincode: e.target.value,
                        }))
                      }
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo((p) => ({
                        ...p,
                        address: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(pricing.subtotal)}</span>
                  </div>

                  {pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(pricing.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>{formatCurrency(pricing.taxes)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-green-600">
                      {formatCurrency(pricing.finalTotal)}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    disabled={
                      isProcessing ||
                      // @ts-expect-error err
                      createPurchase.isLoading ||
                      // @ts-expect-error err
                      updatePayment.isLoading
                    }
                  >
                    {isProcessing ||
                    // @ts-expect-error err

                    createPurchase.isLoading ||
                    // @ts-expect-error err

                    updatePayment.isLoading
                      ? "Processing..."
                      : `Confirm & Pay ${formatCurrency(pricing.finalTotal)}`}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="mt-2 w-full"
                  >
                    Back to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
