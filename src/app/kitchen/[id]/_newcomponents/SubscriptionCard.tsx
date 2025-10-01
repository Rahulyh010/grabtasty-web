/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Utensils,
  ChefHat,
  Info,
  Plus,
  Loader2,
  Calendar,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/useCart";

interface SubscriptionCardNewProps {
  subscription: any;
}

export const SubscriptionCardNew: React.FC<SubscriptionCardNewProps> = ({
  subscription,
}) => {
  const { id: kitchenId } = useParams();
  const [showDetails, setShowDetails] = useState(false);
  const addToCartMutation = useAddToCart();

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  // Calculate savings
  const calculateSavings = (weekly: number, price: number, weeks: number) => {
    const weeklyTotal = weekly * weeks;
    const savings = weeklyTotal - price;
    const percent = Math.round((savings / weeklyTotal) * 100);
    return { amount: savings, percent };
  };

  const monthlySavings = calculateSavings(
    subscription.weeklyPrice,
    subscription.monthlyPrice,
    4
  );
  const quarterlySavings = calculateSavings(
    subscription.weeklyPrice,
    subscription.quarterlyPrice,
    12
  );

  // Handle add to cart
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddToCart = async (durationType: string, price: number) => {
    try {
      await addToCartMutation.mutateAsync({
        kitchenId: kitchenId as string,
        comboId: subscription.comboId,
        durationType,
        durationValue: 1,
        customerPreferences: {
          starchChoice: "BOTH",
          spiceLevel: "MEDIUM",
          portionSize: "REGULAR",
        },
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Meal type styling
  const getMealTypeColor = () => {
    switch (subscription.systemCodeInfo.mealType) {
      case "BREAKFAST":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "LUNCH":
        return "bg-green-100 text-green-700 border-green-300";
      case "DINNER":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className={`text-xs ${getMealTypeColor()}`}>
            <Utensils className="w-3 h-3 mr-1" />
            {subscription.systemCodeInfo.mealType}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-1 text-gray-900">
            {subscription.systemCodeInfo.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center">
              <ChefHat className="w-3 h-3 mr-1" />
              {subscription.cuisineType}
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {subscription.systemCodeInfo.daysPerWeek} days/week
            </span>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Pattern:</strong>{" "}
              {subscription.systemCodeInfo.patternDescription}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {subscription.systemCodeInfo.description}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-4">
        {/* Pricing Options */}
        <div className="space-y-3">
          {/* Weekly Plan */}
          <div className="border rounded-lg p-3 bg-white hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">Weekly Plan</p>
                <p className="text-xs text-gray-500">Pay weekly</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(subscription.weeklyPrice)}
                </p>
                <p className="text-xs text-gray-500">/week</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() =>
                handleAddToCart("WEEKLY", subscription.weeklyPrice)
              }
              disabled={addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Weekly
            </Button>
          </div>

          {/* Monthly Plan */}
          {subscription.monthlyPrice > 0 && (
            <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 relative">
              <Badge className="absolute -top-2 left-3 bg-green-600 text-white text-xs">
                Save {monthlySavings.percent}%
              </Badge>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">Monthly Plan</p>
                  <p className="text-xs text-green-700 flex items-center">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Save {formatCurrency(monthlySavings.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-700">
                    {formatCurrency(subscription.monthlyPrice)}
                  </p>
                  <p className="text-xs text-gray-600">/month</p>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() =>
                  handleAddToCart("MONTHLY", subscription.monthlyPrice)
                }
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add Monthly
              </Button>
            </div>
          )}

          {/* Quarterly Plan */}
          {subscription.quarterlyPrice > 0 && (
            <div className="border rounded-lg p-3 bg-blue-50 border-blue-300 relative">
              <Badge className="absolute -top-2 left-3 bg-blue-600 text-white text-xs">
                Save {quarterlySavings.percent}%
              </Badge>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">Quarterly Plan</p>
                  <p className="text-xs text-blue-700 flex items-center">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Save {formatCurrency(quarterlySavings.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-700">
                    {formatCurrency(subscription.quarterlyPrice)}
                  </p>
                  <p className="text-xs text-gray-600">/3 months</p>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  handleAddToCart("QUARTERLY", subscription.quarterlyPrice)
                }
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add Quarterly
              </Button>
            </div>
          )}
        </div>

        {/* Customizations */}
        {(subscription.customizations.allowChapatiRiceChoice ||
          subscription.customizations.allowSpiceLevelChoice ||
          subscription.customizations.allowPortionChoice) && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-600 mb-2">Customization Options:</p>
            <div className="flex flex-wrap gap-1">
              {subscription.customizations.allowChapatiRiceChoice && (
                <Badge variant="secondary" className="text-xs">
                  Rice/Chapati
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
        )}
      </CardContent>
    </Card>
  );
};
