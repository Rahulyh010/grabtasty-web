/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  ChefHat,
  Utensils,
  Flame,
  Heart,
  Plus,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Leaf,
  Beef,
  ArrowRight,
  Clock,
} from "lucide-react";

interface Dish {
  _id: string;
  name: string;
  cuisineType: string;
  mealType: string;
  foodType: string;
  imageUrl: string;
  price: number;
  isSpicy?: boolean;
  description?: string;
  rating: {
    average: number;
    totalRatings: number;
  };
}

interface Kitchen {
  _id: string;
  name: string;
  address: string;
  adminName: string;
  phone: string;
  banner?: string;
  allDishes: Dish[];
}

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
    imageUrl?: string;
  };
  duration: number;
  status: string;
}

interface KitchenData {
  kitchen: Kitchen;
}

interface SubscriptionData {
  kitchenId: string;
  totalSubscriptions: number;
  subscriptions: Subscription[];
}

const fetchKitchen = async (
  kitchenId: string
): Promise<{ data: KitchenData }> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen/${kitchenId}`
  );
  if (!response.ok) throw new Error("Failed to fetch kitchen");
  return response.json();
};

const fetchSubscriptions = async (
  kitchenId: string
): Promise<{ data: SubscriptionData }> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscriptions/kitchen/${kitchenId}`
  );
  if (!response.ok) throw new Error("Failed to fetch subscriptions");
  return response.json();
};

const mealTypeIcons = {
  BREAKFAST: Coffee,
  LUNCH: Sun,
  DINNER: Moon,
  SNACKS: Cookie,
  Breakfast: Coffee,
  Lunch: Sun,
  Dinner: Moon,
  Snacks: Cookie,
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="relative h-64 overflow-hidden">
      <Skeleton className="w-full h-full rounded-none" />
    </div>
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

// Clean Professional Subscription Card
const SubscriptionCard = ({
  subscription,
}: {
  subscription: Subscription;
  index: number;
}) => {
  const router = useRouter();

  const handleSubscribe = () => {
    router.push(`/checkout/${subscription._id}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            {subscription.comboConfig.name}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2">
            {subscription.comboConfig.description}
          </p>
        </div>
        {subscription.comboConfig.discountPercentage && (
          <div className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium ml-2">
            {subscription.comboConfig.discountPercentage}% off
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="text-lg font-bold text-gray-900">
          ₹{subscription.comboConfig.price}
        </div>
        <div className="text-xs text-gray-500">
          ₹{Math.round(subscription.comboConfig.price / subscription.duration)}
          /day
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {subscription.duration} days
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {subscription.comboConfig.mealTypes.map((meal) => {
          const MealIcon =
            mealTypeIcons[meal as keyof typeof mealTypeIcons] || Utensils;
          return (
            <div
              key={meal}
              className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs"
            >
              <MealIcon className="h-3 w-3 text-gray-600" />
              <span className="text-gray-700">{meal}</span>
            </div>
          );
        })}
      </div>

      <Button
        onClick={handleSubscribe}
        className="w-full h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
      >
        Subscribe Now
        <ArrowRight className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
};

interface KitchenPageProps {
  kitchenId: string;
}

export default function KitchenPage({ kitchenId }: KitchenPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const [selectedCuisine, setSelectedCuisine] = useState<string>("ALL");
  const [selectedFoodType, setSelectedFoodType] = useState<string>("ALL");
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set());

  const { data: kitchenData, isLoading: kitchenLoading } = useQuery({
    queryKey: ["kitchen", kitchenId],
    queryFn: () => fetchKitchen(kitchenId),
  });

  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["subscriptions", "kitchen", kitchenId],
    queryFn: () => fetchSubscriptions(kitchenId),
  });

  if (kitchenLoading || subscriptionLoading) {
    return <LoadingSkeleton />;
  }

  const kitchen = kitchenData?.data.kitchen;
  const subscriptions = subscriptionData?.data?.subscriptions || [];

  if (!kitchen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Kitchen not found
          </h3>
          <p className="text-gray-600">
            The kitchen you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Get unique cuisines and food types
  const uniqueCuisines = [
    ...new Set(kitchen.allDishes.map((dish) => dish.cuisineType)),
  ];
  const uniqueFoodTypes = [
    ...new Set(kitchen.allDishes.map((dish) => dish.foodType)),
  ];

  // Filter dishes
  const filteredDishes = kitchen.allDishes.filter((dish) => {
    const cuisineMatch =
      selectedCuisine === "ALL" || dish.cuisineType === selectedCuisine;
    const foodTypeMatch =
      selectedFoodType === "ALL" || dish.foodType === selectedFoodType;
    return cuisineMatch && foodTypeMatch;
  });

  // Group filtered dishes by meal type
  const dishesByMealType = filteredDishes.reduce((acc, dish) => {
    if (!acc[dish.mealType]) acc[dish.mealType] = [];
    acc[dish.mealType].push(dish);
    return acc;
  }, {} as Record<string, Dish[]>);

  const toggleFavorite = (dishId: string) => {
    const newFavorites = new Set(favoriteItems);
    if (newFavorites.has(dishId)) {
      newFavorites.delete(dishId);
    } else {
      newFavorites.add(dishId);
    }
    setFavoriteItems(newFavorites);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            kitchen.banner ||
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1400&h=400&fit=crop"
          }
          alt={kitchen.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Kitchen Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {kitchen.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {kitchen.address.split(",")[0]}
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    Chef {kitchen.adminName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {kitchen.allDishes.length}
                </div>
                <div className="text-xs text-gray-600">Menu Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Subscription Plans - Clean & Simple */}
        {subscriptions.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Subscription Plans
                </h2>
                <p className="text-sm text-gray-600">
                  Choose a plan that fits your needs
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {subscriptions.length} plans available
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((subscription, index) => (
                <SubscriptionCard
                  key={subscription._id}
                  subscription={subscription}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Clean Filters */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Cuisine Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCuisine("ALL")}
                  className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                    selectedCuisine === "ALL"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                {uniqueCuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                      selectedCuisine === cuisine
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {cuisine.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedFoodType("ALL")}
                  className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                    selectedFoodType === "ALL"
                      ? "bg-green-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                {uniqueFoodTypes.map((foodType) => (
                  <button
                    key={foodType}
                    onClick={() => setSelectedFoodType(foodType)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                      selectedFoodType === foodType
                        ? "bg-green-600 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {foodType === "VEG" ? (
                      <Leaf className="h-3 w-3" />
                    ) : (
                      <Beef className="h-3 w-3" />
                    )}
                    {foodType}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredDishes.length} of {kitchen.allDishes.length} dishes
          </div>
        </section>

        {/* Menu Tabs - Clean Design */}
        {Object.keys(dishesByMealType).length > 0 ? (
          <Tabs
            defaultValue={Object.keys(dishesByMealType)[0]}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-white border border-gray-200 rounded-lg mb-6">
              {Object.keys(dishesByMealType).map((mealType) => {
                const MealIcon =
                  mealTypeIcons[mealType as keyof typeof mealTypeIcons] ||
                  Utensils;
                return (
                  <TabsTrigger
                    key={mealType}
                    value={mealType}
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-200 rounded-md py-2 px-3 font-medium transition-all duration-200 flex items-center gap-2 text-sm"
                  >
                    <MealIcon className="h-4 w-4" />
                    <span>{mealType}</span>
                    <Badge
                      variant="secondary"
                      className="ml-1 text-xs h-5 px-1.5"
                    >
                      {dishesByMealType[mealType].length}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(dishesByMealType).map(([mealType, dishes]) => (
              <TabsContent key={mealType} value={mealType}>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {dishes.map((dish) => (
                    <Card
                      key={dish._id}
                      className="group hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Simple Badges */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          <Badge
                            variant={
                              dish.foodType === "VEG"
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs h-5 px-2"
                          >
                            {dish.foodType === "VEG" ? (
                              <Leaf className="h-2.5 w-2.5 mr-1" />
                            ) : (
                              <Beef className="h-2.5 w-2.5 mr-1" />
                            )}
                            {dish.foodType}
                          </Badge>
                          {dish.isSpicy && (
                            <Badge className="bg-red-500 text-xs h-5 px-2">
                              <Flame className="h-2.5 w-2.5 mr-1" />
                              Spicy
                            </Badge>
                          )}
                        </div>

                        {/* Rating & Favorite */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          {dish.rating.totalRatings > 0 && (
                            <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">
                                {dish.rating.average.toFixed(1)}
                              </span>
                            </div>
                          )}
                          <button
                            onClick={() => toggleFavorite(dish._id)}
                            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded flex items-center justify-center hover:scale-110 transition-transform"
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${
                                favoriteItems.has(dish._id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 line-clamp-1 flex-1">
                            {dish.name}
                          </h4>
                          <div className="text-lg font-bold text-gray-900 ml-2">
                            ₹{dish.price}
                          </div>
                        </div>

                        {dish.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                            {dish.description}
                          </p>
                        )}

                        <Button className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No dishes found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more options
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
