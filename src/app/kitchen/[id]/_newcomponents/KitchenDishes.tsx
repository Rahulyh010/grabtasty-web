/* eslint-disable @next/next/no-img-element */
// app/_components/KitchenDishes.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, Loader2, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// import Image from "next/image";

interface KitchenDishesProps {
  kitchenId: string;
}

type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS" | "DRINKS";
type CuisineType =
  | "NORTH_INDIAN"
  | "SOUTH_INDIAN"
  | "GUJARATI"
  | "CHINESE"
  | "ITALIAN"
  | "MEXICAN"
  | "OTHER";
type FoodType = "VEG" | "EGG" | "NON_VEG" | "VEGAN" | "JAIN";

interface IDish {
  _id: string;
  name: string;
  cuisineType: CuisineType;
  mealType: MealType;
  foodType: FoodType;
  imageUrl: string;
  price: number;
  isSpicy?: boolean;
  description?: string;
  rating?: {
    average: number;
    totalRatings: number;
  };
}

const formatLabels = {
  mealType: {
    BREAKFAST: "Breakfast",
    LUNCH: "Lunch",
    DINNER: "Dinner",
    SNACKS: "Snacks",
    DRINKS: "Drinks",
  },
  cuisineType: {
    NORTH_INDIAN: "North Indian",
    SOUTH_INDIAN: "South Indian",
    GUJARATI: "Gujarati",
    CHINESE: "Chinese",
    ITALIAN: "Italian",
    MEXICAN: "Mexican",
    OTHER: "Other",
  },
};

export const KitchenDishes: React.FC<KitchenDishesProps> = ({ kitchenId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string>("all");
  const [selectedFoodType, setSelectedFoodType] = useState<string>("all");

  // Fetch kitchen dishes
  const { data, isLoading, error } = useQuery({
    queryKey: ["kitchen-dishes", kitchenId, selectedMealType, selectedFoodType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedMealType !== "all")
        params.append("mealType", selectedMealType);
      if (selectedFoodType !== "all")
        params.append("foodType", selectedFoodType);

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/kitchen/${kitchenId}/dishes?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: !!kitchenId,
  });

  // Filter dishes by search
  const filteredDishes = React.useMemo(() => {
    const dishes = data?.dishes || [];
    if (!searchTerm.trim()) return dishes;

    const query = searchTerm.toLowerCase();
    return dishes.filter((dish: IDish) =>
      dish.name.toLowerCase().includes(query)
    );
  }, [data, searchTerm]);

  if (!data?.dishes || data.dishes.length === 0) {
    return null; // Don't show section if no dishes
  }

  return (
    <div className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Our Menu ({data?.totalDishes || 0} dishes)
          </h2>
          <p className="text-gray-600">Fresh dishes from {data?.kitchenName}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          {/* Meal Type Filter */}
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="border rounded-md px-3 h-10 text-sm bg-white"
          >
            <option value="all">All Meals</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACKS">Snacks</option>
            <option value="DRINKS">Drinks</option>
          </select>

          {/* Food Type Filter */}
          <select
            value={selectedFoodType}
            onChange={(e) => setSelectedFoodType(e.target.value)}
            className="border rounded-md px-3 h-10 text-sm bg-white"
          >
            <option value="all">All Types</option>
            <option value="VEG">Vegetarian</option>
            <option value="EGG">Egg</option>
            <option value="NON_VEG">Non-Veg</option>
            <option value="VEGAN">Vegan</option>
            <option value="JAIN">Jain</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dishes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load dishes</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No dishes found</p>
          </div>
        )}

        {/* Dishes Grid */}
        {!isLoading && !error && filteredDishes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDishes.map((dish: IDish) => (
              <div
                key={dish._id}
                className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow duration-300"
              >
                {/* Dish Image */}
                <div className="relative h-40 w-full">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="object-cover w-full h-full"
                  />
                  {/* Food Type Badge */}
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium 
                    ${
                      dish.foodType === "VEG"
                        ? "bg-green-100 text-green-800"
                        : dish.foodType === "NON_VEG"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {dish.foodType}
                  </div>
                  {/* Spicy Badge */}
                  {dish.isSpicy && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Spicy
                    </div>
                  )}
                </div>

                {/* Dish Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {dish.name}
                  </h3>

                  {/* Meal Type & Cuisine */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {formatLabels.mealType[dish.mealType]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {formatLabels.cuisineType[dish.cuisineType]}
                    </Badge>
                  </div>

                  {/* Description */}
                  {dish.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {dish.description}
                    </p>
                  )}

                  {/* Rating */}
                  {dish.rating && dish.rating.totalRatings > 0 && (
                    <div className="flex items-center text-xs text-gray-600 mb-2">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{dish.rating.average.toFixed(1)}</span>
                      <span className="ml-1">({dish.rating.totalRatings})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
