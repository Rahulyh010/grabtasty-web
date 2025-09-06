/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
  Utensils,
  ChefHat,
  Info,
  ShoppingCart,
  CreditCard,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Subscription } from "./types";
import { SubscriptionModal } from "./SubscriptionModal";
import { AddToCartModal } from "./AddToCartModal";
import { BuyNowModal } from "./BuyNowModal";
import { useCart, useAddToCart } from "@/hooks/useCart";
import { useUserPurchases } from "@/hooks/usePurchases";
import { useParams } from "next/navigation";

interface SubscriptionCardProps {
  subscription: Subscription;
  userId?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  userId,
}) => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);

  const kitchenId = id;

  // Hooks
  const { data: cartData, isLoading: cartLoading } = useCart();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: purchasesData, isLoading: purchasesLoading } =
    useUserPurchases();
  const addToCartMutation = useAddToCart();

  //   console.log(cartData, "cartData");
  //   console.log(subscription, "subscription");
  // Utils

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const calculateSavings = (weekly: number, monthly: number) => {
    const monthlyFromWeekly = weekly * 4;
    const savings = monthlyFromWeekly - monthly;
    const savingsPercent = (savings / monthlyFromWeekly) * 100;
    return { amount: savings, percent: Math.round(savingsPercent) };
  };

  // Simple cart status check
  const cartStatus = useMemo(() => {
    if (cartLoading) return { loading: true };

    const cartItems = cartData?.cart?.items || [];
    const matching = cartItems.filter(
      (item: any) =>
        item.comboId === subscription.comboId && item.kitchenId === kitchenId
    );

    const weekly = matching.filter(
      (item: any) => item.durationType === "WEEKLY"
    );
    const monthly = matching.filter(
      (item: any) => item.durationType === "MONTHLY"
    );
    const quarterly = matching.filter(
      (item: any) => item.durationType === "QUARTERLY"
    );

    return {
      loading: false,
      hasItems: matching.length > 0,
      total: matching.length,
      weekly: weekly.length,
      monthly: monthly.length,
      quarterly: quarterly.length,
      weeklyItems: weekly,
      monthlyItems: monthly,
      quarterlyItems: quarterly,
    };
  }, [cartData, cartLoading, subscription.comboId, kitchenId]);

  // Simple badge component - Fixed positioning to avoid overlap
  const CartBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <div className="absolute top-1 left-1 z-10">
        <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5">
          <ShoppingCart className="w-3 h-3 mr-1" /> {count}
        </Badge>
      </div>
    );
  };

  // Handlers
  const handleAddToCart = () => setIsAddToCartModalOpen(true);
  const handleBuyNow = () => setIsBuyNowModalOpen(true);

  // UI helpers
  const savings = calculateSavings(
    subscription.weeklyPrice,
    subscription.monthlyPrice
  );

  const getMainStatusBadge = () => {
    if (cartStatus.loading) {
      return (
        <Badge variant="outline">
          <Clock className="w-3 h-3 mr-1" /> Loading...
        </Badge>
      );
    }
    if (cartStatus.hasItems) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <ShoppingCart className="w-3 h-3 mr-1" /> Added ({cartStatus.total})
        </Badge>
      );
    }
    return null;
  };

  const getActionButtons = () => {
    if (cartStatus.loading) {
      return (
        <Button variant="outline" className="flex-1 text-sm" disabled>
          <Clock className="w-4 h-4 mr-1" /> Loading...
        </Button>
      );
    }

    if (cartStatus.hasItems) {
      return (
        <div className="space-y-2">
          <div className="space-y-1">
            {cartStatus.weekly > 0 && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                Weekly - {cartStatus.weekly} item(s)
              </div>
            )}
            {cartStatus.monthly > 0 && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                Monthly - {cartStatus.monthly} item(s)
              </div>
            )}
            {cartStatus.quarterly > 0 && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                Quarterly - {cartStatus.quarterly} item(s)
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1 text-sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" /> Add More
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
              onClick={handleBuyNow}
            >
              <CreditCard className="w-4 h-4 mr-1" /> Buy Now
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button
          variant="outline"
          className="flex-1 text-sm"
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
          onClick={handleBuyNow}
        >
          <CreditCard className="w-4 h-4 mr-1" /> Buy Now
        </Button>
      </div>
    );
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-blue-200 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="outline"
              className={`text-xs ${
                subscription.systemCodeInfo.mealType === "BREAKFAST"
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : subscription.systemCodeInfo.mealType === "LUNCH"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              <Utensils className="w-3 h-3 mr-1" />
              {subscription.systemCodeInfo.mealType}
            </Badge>
            <div className="flex items-center gap-2">
              {getMainStatusBadge()}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base md:text-lg group-hover:text-blue-600 transition-colors leading-tight">
                  {subscription.systemCodeInfo.name}
                </CardTitle>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <ChefHat className="w-3 h-3 mr-1 flex-shrink-0" />
                  {subscription.cuisineType}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-gray-500">from</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(subscription.weeklyPrice)}
                  <span className="text-xs text-gray-500 font-normal">
                    /week
                  </span>
                </p>
              </div>
            </div>

            <div className="p-2 bg-gray-50 rounded text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {subscription.systemCodeInfo.patternDescription}
                </span>
                <span className="font-medium text-gray-700">
                  {subscription.systemCodeInfo.daysPerWeek} days/week
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pricing with cart badges */}
          <div className="space-y-2">
            <div className="relative flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-lg">
              <CartBadge count={cartStatus.weekly} />
              <div className="pl-2">
                <p className="font-medium text-sm">Weekly</p>
                <p className="text-xs text-gray-500">Pay weekly</p>
              </div>
              <p className="font-semibold text-sm md:text-base">
                {formatCurrency(subscription.weeklyPrice)}
              </p>
            </div>

            <div className="relative flex justify-between items-center p-2 md:p-3 bg-green-50 rounded-lg border border-green-200">
              <CartBadge count={cartStatus.monthly} />
              <div className="pl-2">
                <p className="font-medium text-green-800 text-sm">Monthly</p>

                <p className="text-xs text-green-600">
                  Save {savings.percent}%
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-800 text-sm md:text-base">
                  {formatCurrency(subscription.monthlyPrice)}
                </p>
                <p className="text-xs text-green-600">
                  Save {formatCurrency(savings.amount)}
                </p>
              </div>
            </div>

            {subscription.quarterlyPrice > 0 && (
              <div className="relative flex justify-between items-center p-2 md:p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CartBadge count={cartStatus.quarterly} />
                <div className="pl-2">
                  <p className="font-medium text-blue-800 text-sm">Quarterly</p>
                  <p className="text-xs text-blue-600">Best Value</p>
                </div>
                <p className="font-semibold text-blue-800 text-sm md:text-base">
                  {formatCurrency(subscription.quarterlyPrice)}
                </p>
              </div>
            )}
          </div>

          {/* Customizations */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Available Options:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {subscription.customizations.allowChapatiRiceChoice && (
                <Badge variant="secondary">Chapati/Rice Choice</Badge>
              )}
              {subscription.customizations.allowSpiceLevelChoice && (
                <Badge variant="secondary">Spice Level</Badge>
              )}
              {subscription.customizations.allowPortionChoice && (
                <Badge variant="secondary">Portion Size</Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          {getActionButtons()}
        </CardContent>
      </Card>

      {/* Modals */}
      <SubscriptionModal
        subscription={subscription}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <AddToCartModal
        subscription={subscription}
        isOpen={isAddToCartModalOpen}
        onClose={() => setIsAddToCartModalOpen(false)}
      />
      <BuyNowModal
        subscription={subscription}
        isOpen={isBuyNowModalOpen}
        onClose={() => setIsBuyNowModalOpen(false)}
        userId={userId}
      />
    </>
  );
};
