"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cookie,
  CheckCircle,
  Tag,
} from "lucide-react";

interface Subscription {
  _id: string;
  comboConfig: {
    name: string;
    description: string;
    mealTypes: string[];
    cuisineType: string;
    foodType: string;
    price: number;
    discountPercentage?: number;
  };
  duration: number;
  status: string;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  index: number;
}

const mealTypeIcons = {
  BREAKFAST: Coffee,
  LUNCH: Sun,
  DINNER: Moon,
  SNACKS: Cookie,
  DRINKS: Utensils,
};

export default function SubscriptionCard({
  subscription,
}: SubscriptionCardProps) {
  const router = useRouter();

  const handleSubscribe = () => {
    router.push(`/checkout/${subscription._id}`);
  };

  const dailyPrice = Math.round(
    subscription.comboConfig.price / subscription.duration
  );

  return (
    <Card className="relative bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Discount Badge */}
      {subscription.comboConfig.discountPercentage && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-red-50 text-red-600 border-red-200 text-xs font-semibold">
            <Tag className="h-2.5 w-2.5 mr-1" />
            {subscription.comboConfig.discountPercentage}% OFF
          </Badge>
        </div>
      )}

      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-16">
            {subscription.comboConfig.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {subscription.comboConfig.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-baseline justify-center mb-1">
            <span className="text-2xl font-bold text-gray-900">
              ₹{subscription.comboConfig.price}
            </span>
            <span className="text-sm text-gray-500 ml-2">total</span>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">₹{dailyPrice}/day</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-600">
              {subscription.duration} days
            </span>
          </div>
        </div>

        {/* Meal Types */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Includes:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {subscription.comboConfig.mealTypes.map((meal) => {
              const MealIcon =
                mealTypeIcons[meal as keyof typeof mealTypeIcons] || Utensils;
              return (
                <div
                  key={meal}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MealIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium">{meal}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
            <span>
              {subscription.comboConfig.cuisineType.replace("_", " ")} Cuisine
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
            <span>Fresh Daily Preparation</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
            <span>{subscription.comboConfig.foodType} Options</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleSubscribe}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 text-sm transition-colors duration-200"
        >
          <span>Choose Plan</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
