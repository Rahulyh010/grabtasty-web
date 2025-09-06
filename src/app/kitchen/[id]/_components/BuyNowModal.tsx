// components/BuyNowModal.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { CreditCard, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Subscription } from "./types";

interface BuyNowModalProps {
  subscription: Subscription;
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const BuyNowModal: React.FC<BuyNowModalProps> = ({
  subscription,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Plan Config, 2: Customer Info, 3: Payment

  // Plan Configuration
  const [planConfig, setPlanConfig] = useState({
    durationType: "MONTHLY" as "WEEKLY" | "MONTHLY" | "QUARTERLY",
    durationValue: 1,
    startDate: "",
    preferences: {
      starchChoice: "BOTH" as "CHAPATI" | "RICE" | "BOTH",
      spiceLevel: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
      portionSize: "REGULAR" as "REGULAR" | "LARGE",
    },
  });

  // Customer Info
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const calculatePrice = () => {
    let unitPrice: number;
    switch (planConfig.durationType) {
      case "WEEKLY":
        unitPrice = subscription.weeklyPrice;
        break;
      case "MONTHLY":
        unitPrice = subscription.monthlyPrice;
        break;
      case "QUARTERLY":
        unitPrice = subscription.quarterlyPrice;
        break;
    }
    const subtotal = unitPrice * planConfig.durationValue;
    const taxes = Math.round(subtotal * 0.05);
    return { subtotal, taxes, total: subtotal + taxes };
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const validateStep = (stepNumber: number) => {
    if (stepNumber === 2) {
      const { name, phone, email, address, pincode } = customerInfo;
      return (
        name.trim() &&
        /^\d{10}$/.test(phone) &&
        /\S+@\S+\.\S+/.test(email) &&
        address.trim().length >= 10 &&
        /^560\d{3}$/.test(pincode)
      );
    }
    return true;
  };

  const handleDirectPurchase = async () => {
    setIsLoading(true);
    try {
      // Extract kitchenId from comboId (format: "kitchenId_systemCode_cuisineType")
      const kitchenId = subscription.comboId.split("_")[0];

      // Step 1: Create temporary cart
      const cartPayload = {
        // userId removed - handled by backend token
        kitchenId: kitchenId,
        comboId: subscription.comboId,
        durationType: planConfig.durationType,
        durationValue: planConfig.durationValue,
        startDate: planConfig.startDate || undefined,
        customerPreferences: planConfig.preferences,
      };

      const cartResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add`,
        cartPayload
      );

      const cartId = cartResponse.data.data.cart._id;

      // Step 2: Create purchase directly
      const purchasePayload = {
        cartId,
        paymentMethod,
        customerInfo,
      };

      const purchaseResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchase/create-from-cart`,
        purchasePayload
      );

      const purchase = purchaseResponse.data.data.purchase;

      // Step 3: Handle payment
      if (paymentMethod === "RAZORPAY") {
        // Simulate payment for now
        await simulatePayment(purchase._id);
      } else {
        toast.success("Order placed successfully! You can pay on delivery.");
        router.push(`/orders/${purchase._id}?success=true`);
      }

      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Purchase failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const simulatePayment = async (purchaseId: string) => {
    toast.info("Redirecting to payment...");

    // Simulate payment delay
    setTimeout(async () => {
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchase/${purchaseId}/payment`,
          {
            paymentStatus: "SUCCESS",
            transactionId: "TXN_" + Date.now(),
          }
        );

        toast.success("Payment successful! Your subscription is active.");
        router.push(`/orders/${purchaseId}?success=true`);
      } catch (error) {
        console.error(error);
        toast.error("Payment verification failed. Please contact support.");
      }
    }, 2000);
  };

  const pricing = calculatePrice();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Buy Now - {subscription.systemCodeInfo.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      stepNum < step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Plan Configuration */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Duration Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Choose Duration
                </Label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {(["WEEKLY", "MONTHLY", "QUARTERLY"] as const).map((type) => {
                    const price =
                      type === "WEEKLY"
                        ? subscription.weeklyPrice
                        : type === "MONTHLY"
                        ? subscription.monthlyPrice
                        : subscription.quarterlyPrice;

                    if (price === 0 && type === "QUARTERLY") return null;

                    return (
                      <button
                        key={type}
                        onClick={() =>
                          setPlanConfig((prev) => ({
                            ...prev,
                            durationType: type,
                            durationValue: 1,
                          }))
                        }
                        className={`p-3 rounded-lg border text-center transition-all ${
                          planConfig.durationType === type
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-medium text-sm">{type}</div>
                        <div className="text-xs text-gray-600">
                          {formatCurrency(price)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <Select
                      value={planConfig.durationValue.toString()}
                      onValueChange={(value) =>
                        setPlanConfig((prev) => ({
                          ...prev,
                          durationValue: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {planConfig.durationType.toLowerCase()}
                            {num > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={planConfig.startDate}
                      onChange={(e) =>
                        setPlanConfig((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      min={getTomorrowDate()}
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Preferences
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  {subscription.customizations.allowChapatiRiceChoice && (
                    <div>
                      <Label className="text-sm">Starch</Label>
                      <Select
                        value={planConfig.preferences.starchChoice}
                        onValueChange={(value: "CHAPATI" | "RICE" | "BOTH") =>
                          setPlanConfig((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              starchChoice: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CHAPATI">Chapati</SelectItem>
                          <SelectItem value="RICE">Rice</SelectItem>
                          <SelectItem value="BOTH">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {subscription.customizations.allowSpiceLevelChoice && (
                    <div>
                      <Label className="text-sm">Spice</Label>
                      <Select
                        value={planConfig.preferences.spiceLevel}
                        onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                          setPlanConfig((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              spiceLevel: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Mild</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">Spicy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {subscription.customizations.allowPortionChoice && (
                    <div>
                      <Label className="text-sm">Portion</Label>
                      <Select
                        value={planConfig.preferences.portionSize}
                        onValueChange={(value: "REGULAR" | "LARGE") =>
                          setPlanConfig((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              portionSize: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REGULAR">Regular</SelectItem>
                          <SelectItem value="LARGE">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Customer Info */}
          {step === 2 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Customer Information
              </Label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="10-digit number"
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Email address"
                />
              </div>

              <div>
                <Label>Address *</Label>
                <Textarea
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Complete delivery address"
                  rows={3}
                />
              </div>

              <div>
                <Label>Pincode *</Label>
                <Input
                  value={customerInfo.pincode}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  placeholder="560XXX"
                  maxLength={6}
                />
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Payment Method</Label>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`p-4 border rounded-lg text-center ${
                    paymentMethod === "RAZORPAY"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="font-medium">Online Payment</div>
                  <div className="text-sm text-gray-600">
                    Card, UPI, Net Banking
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                  className={`p-4 border rounded-lg text-center ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay on first meal</div>
                </button>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(pricing.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes:</span>
                      <span>{formatCurrency(pricing.taxes)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        {formatCurrency(pricing.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
              >
                Back
              </Button>
            )}

            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!validateStep(step)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleDirectPurchase}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading
                    ? "Processing..."
                    : `Pay ${formatCurrency(pricing.total)}`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
