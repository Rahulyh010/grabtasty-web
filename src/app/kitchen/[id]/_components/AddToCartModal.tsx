/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AddToCartModal.tsx
"use client";

import React, { useState } from "react";
// import axios from "axios";
import { Settings, Package, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Subscription } from "./types";
import { useParams } from "next/navigation";
import { useAxios } from "@/hooks/useAxios";

interface AddToCartModalProps {
  subscription: Subscription;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  subscription,
  isOpen,
  onClose,
}) => {
  const axios = useAxios();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [durationType, setDurationType] = useState<
    "WEEKLY" | "MONTHLY" | "QUARTERLY"
  >("MONTHLY");
  const [durationValue, setDurationValue] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [preferences, setPreferences] = useState({
    starchChoice: "BOTH" as "CHAPATI" | "RICE" | "BOTH",
    spiceLevel: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    portionSize: "REGULAR" as "REGULAR" | "LARGE",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const calculatePrice = () => {
    let unitPrice: number;
    switch (durationType) {
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
    return unitPrice * durationValue;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getDurationOptions = (type: string) => {
    switch (type) {
      case "WEEKLY":
        return Array.from({ length: 8 }, (_, i) => i + 1);
      case "MONTHLY":
        return Array.from({ length: 6 }, (_, i) => i + 1);
      case "QUARTERLY":
        return [1, 2];
      default:
        return [1];
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Extract kitchenId from comboId (format: "kitchenId_systemCode_cuisineType")
      const kitchenId = id;

      if (!kitchenId) {
        toast.error("Invalid kitchenId");
        throw new Error("Invalid kitchenId");
      }

      const payload = {
        // userId removed - will be handled by backend token
        kitchenId: kitchenId, // Extract from comboId
        comboId: subscription.comboId,
        durationType,
        durationValue,
        startDate: new Date(startDate) || undefined,
        customerPreferences: preferences,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add`,
        payload
      );

      toast.success(
        response.data.data.message || "Item added to cart successfully!"
      );
      onClose();

      // Optionally refresh cart data or trigger a cart update
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add item to cart";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = calculatePrice();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Add to Cart - {subscription.systemCodeInfo.name}
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

        <div className="space-y-6">
          {/* Subscription Overview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {subscription.systemCodeInfo.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {subscription.cuisineType}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    subscription.systemCodeInfo.mealType === "BREAKFAST"
                      ? "bg-orange-50 text-orange-700 border-orange-200"
                      : subscription.systemCodeInfo.mealType === "LUNCH"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {subscription.systemCodeInfo.mealType}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {subscription.systemCodeInfo.description}
              </p>
            </CardContent>
          </Card>

          {/* Duration Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Choose Duration
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
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
                    onClick={() => {
                      setDurationType(type);
                      setDurationValue(1);
                    }}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      durationType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium">{type}</div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(price)}
                    </div>
                    {type === "MONTHLY" && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Popular
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Number of {durationType.toLowerCase()}s</Label>
                <Select
                  value={durationValue.toString()}
                  onValueChange={(value) => setDurationValue(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getDurationOptions(durationType).map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value} {durationType.toLowerCase()}
                        {value > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={getTomorrowDate()}
                />
                {!startDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to start tomorrow
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Preferences */}
          <div>
            <Label className="text-base font-medium mb-3  flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Meal Preferences
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscription.customizations.allowChapatiRiceChoice && (
                <div>
                  <Label className="text-sm">Starch Preference</Label>
                  <Select
                    value={preferences.starchChoice}
                    onValueChange={(value: "CHAPATI" | "RICE" | "BOTH") =>
                      setPreferences((prev) => ({
                        ...prev,
                        starchChoice: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHAPATI">Chapati Only</SelectItem>
                      <SelectItem value="RICE">Rice Only</SelectItem>
                      <SelectItem value="BOTH">Both (Mix)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {subscription.customizations.allowSpiceLevelChoice && (
                <div>
                  <Label className="text-sm">Spice Level</Label>
                  <Select
                    value={preferences.spiceLevel}
                    onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                      setPreferences((prev) => ({ ...prev, spiceLevel: value }))
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
                  <Label className="text-sm">Portion Size</Label>
                  <Select
                    value={preferences.portionSize}
                    onValueChange={(value: "REGULAR" | "LARGE") =>
                      setPreferences((prev) => ({
                        ...prev,
                        portionSize: value,
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

          <Separator />

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {durationValue} {durationType.toLowerCase()}
              {durationValue > 1 ? "s" : ""} •
              {subscription.systemCodeInfo.daysPerWeek} days per week
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
