/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
  Utensils,
  ChefHat,
  Info,
  ShoppingCart,
  CreditCard,
  Plus,
  Check,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Subscription } from "./types";
import { SubscriptionModal } from "./SubscriptionModal";
import { BuyNowModal } from "./BuyNowModal";
import { useCart, useAddToCart } from "@/hooks/useCart";
import { useParams } from "next/navigation";

interface SubscriptionCardProps {
  subscription: Subscription;
  userId?: string;
}

interface DurationOption {
  type: "WEEKLY" | "MONTHLY" | "QUARTERLY";
  price: number;
  savings?: number;
  savingsPercent?: number;
  label: string;
  period: string;
  popular?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  userId,
}) => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<{
    type: string;
    price: number;
  } | null>(null);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);

  const kitchenId = id;

  // Hooks
  const { data: cartData, isLoading: cartLoading } = useCart();
  const addToCartMutation = useAddToCart();

  // Utils
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // Calculate duration options with savings
  const durationOptions: DurationOption[] = useMemo(() => {
    const weeklyPrice = subscription.weeklyPrice;
    const monthlyPrice = subscription.monthlyPrice;
    const quarterlyPrice = subscription.quarterlyPrice;

    const options: DurationOption[] = [
      {
        type: "WEEKLY",
        price: weeklyPrice,
        label: "Weekly",
        period: "/week",
      },
    ];

    if (monthlyPrice > 0) {
      const monthlyFromWeekly = weeklyPrice * 4;
      const monthlySavings = monthlyFromWeekly - monthlyPrice;
      const monthlySavingsPercent = Math.round(
        (monthlySavings / monthlyFromWeekly) * 100
      );

      options.push({
        type: "MONTHLY",
        price: monthlyPrice,
        savings: monthlySavings,
        savingsPercent: monthlySavingsPercent,
        label: "Monthly",
        period: "/month",
        popular: true,
      });
    }

    if (quarterlyPrice > 0) {
      const quarterlyFromWeekly = weeklyPrice * 12;
      const quarterlySavings = quarterlyFromWeekly - quarterlyPrice;
      const quarterlySavingsPercent = Math.round(
        (quarterlySavings / quarterlyFromWeekly) * 100
      );

      options.push({
        type: "QUARTERLY",
        price: quarterlyPrice,
        savings: quarterlySavings,
        savingsPercent: quarterlySavingsPercent,
        label: "Quarterly",
        period: "/3 months",
      });
    }

    return options;
  }, [subscription]);

  // Check cart status for each duration
  const cartStatus = useMemo(() => {
    if (cartLoading) return { loading: true };

    const cartItems = cartData?.cart?.items || [];
    const result: Record<string, { count: number; items: any[] }> = {
      WEEKLY: { count: 0, items: [] },
      MONTHLY: { count: 0, items: [] },
      QUARTERLY: { count: 0, items: [] },
    };

    cartItems.forEach((item: any) => {
      if (
        item.comboId === subscription.comboId &&
        item.kitchenId === kitchenId
      ) {
        const durationType = item.durationType;
        if (result[durationType]) {
          result[durationType].count += 1;
          result[durationType].items.push(item);
        }
      }
    });

    const totalItems = Object.values(result).reduce(
      (sum, curr) => sum + curr.count,
      0
    );

    return {
      loading: false,
      hasItems: totalItems > 0,
      total: totalItems,
      byDuration: result,
    };
  }, [cartData, cartLoading, subscription.comboId, kitchenId]);

  // Handle add to cart for specific duration
  const handleAddToCart = async (duration: DurationOption) => {
    if (addToCartMutation.isPending) return;

    const cartData = {
      kitchenId: kitchenId as string,
      comboId: subscription.comboId,
      durationType: duration.type,
      durationValue: 1, // Always 1 for now
      customerPreferences: {
        starchChoice: "BOTH",
        spiceLevel: "MEDIUM",
        portionSize: "REGULAR",
      },
    };

    try {
      await addToCartMutation.mutateAsync(cartData);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Handle buy now
  const handleBuyNow = (duration: DurationOption) => {
    setSelectedDuration({
      type: duration.type,
      price: duration.price,
    });
    setIsBuyNowModalOpen(true);
  };

  // Get meal type styling
  const getMealTypeStyle = () => {
    const mealType = subscription.systemCodeInfo.mealType;
    switch (mealType) {
      case "BREAKFAST":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "LUNCH":
        return "bg-green-50 text-green-700 border-green-200";
      case "DINNER":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-blue-200 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="outline"
              className={`text-xs ${getMealTypeStyle()}`}
            >
              <Utensils className="w-3 h-3 mr-1" />
              {subscription.systemCodeInfo.mealType}
            </Badge>
            <div className="flex items-center gap-2">
              {cartStatus.hasItems && (
                <Badge className="bg-blue-500 text-white text-xs">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  {cartStatus.total}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors leading-tight mb-2">
                {subscription.systemCodeInfo.name}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <ChefHat className="w-3 h-3 mr-1" />
                  {subscription.cuisineType}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {subscription.systemCodeInfo.daysPerWeek} days/week
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Meal Pattern</p>
              <p className="text-sm font-medium text-gray-800">
                {subscription.systemCodeInfo.patternDescription}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Duration Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Choose Your Plan
            </h4>

            {durationOptions.map((duration) => {
              const cartCount =
                // @ts-expect-error err
                cartStatus.byDuration[duration.type]?.count || 0;
              const isInCart = cartCount > 0;
              const isLoading = addToCartMutation.isPending;

              return (
                <div
                  key={duration.type}
                  className={`relative border rounded-lg p-4 transition-all ${
                    duration.popular
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  } ${isInCart ? "ring-2 ring-blue-500 ring-opacity-20" : ""}`}
                >
                  {duration.popular && (
                    <div className="absolute -top-2 left-4">
                      <Badge className="bg-green-500 text-white text-xs">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {isInCart && (
                    <div className="absolute -top-2 right-4">
                      <Badge className="bg-blue-500 text-white text-xs">
                        Added ({cartCount})
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {duration.label}
                      </p>
                      {duration.savings && duration.savingsPercent && (
                        <p className="text-xs text-green-600">
                          Save {formatCurrency(duration.savings)} (
                          {duration.savingsPercent}% off)
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(duration.price)}
                      </p>
                      <p className="text-xs text-gray-500">{duration.period}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={isInCart ? "outline" : "default"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(duration)}
                      disabled={isLoading}
                    >
                      {isInCart ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Add More
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          {isLoading ? "Adding..." : "Add to Cart"}
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleBuyNow(duration)}
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Customizations */}
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Available Options:
            </p>
            <div className="flex flex-wrap gap-2">
              {subscription.customizations.allowChapatiRiceChoice && (
                <Badge variant="secondary" className="text-xs">
                  Chapati/Rice Choice
                </Badge>
              )}
              {subscription.customizations.allowSpiceLevelChoice && (
                <Badge variant="secondary" className="text-xs">
                  Spice Level
                </Badge>
              )}
              {subscription.customizations.allowPortionChoice && (
                <Badge variant="secondary" className="text-xs">
                  Portion Size
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <SubscriptionModal
        subscription={subscription}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <BuyNowModal
        subscription={subscription}
        isOpen={isBuyNowModalOpen}
        onClose={() => setIsBuyNowModalOpen(false)}
        userId={userId}
        // @ts-expect-error err
        selectedDuration={selectedDuration}
      />
    </>
  );
};
