/* eslint-disable @next/next/no-img-element */
// app/_components/home/FeaturedDishes.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
// import Image from "next/image";

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
}

const formatLabels = {
  cuisineType: {
    NORTH_INDIAN: "North Indian",
    SOUTH_INDIAN: "South Indian",
    GUJARATI: "Gujarati",
    CHINESE: "Chinese",
    ITALIAN: "Italian",
    MEXICAN: "Mexican",
    OTHER: "Other",
  },
  mealType: {
    BREAKFAST: "Breakfast",
    LUNCH: "Lunch",
    DINNER: "Dinner",
    SNACKS: "Snacks",
    DRINKS: "Drinks",
  },
};

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL + "/api" || "http://localhost:5000/api";

export default function FeaturedDishes() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-dishes"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/dishes`);
      if (!response.ok) throw new Error("Failed to fetch dishes");
      const result = await response.json();
      return result.data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Popular Dishes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data?.dishes?.length) return null;

  // Show first 8 dishes
  const displayDishes = data.dishes.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Popular Dishes
          </h2>
          <p className="text-gray-600 text-lg">
            Fresh, delicious meals prepared with love
          </p>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayDishes.map((dish: IDish) => (
            <div
              key={dish._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Dish Image */}
              <div className="relative h-48 w-full">
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
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                    🔥
                  </div>
                )}
              </div>

              {/* Dish Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {dish.name}
                </h3>

                {/* Meal Type & Cuisine */}
                <div className="flex items-center text-xs text-gray-600 mb-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {formatLabels.mealType[dish.mealType]}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded">
                    {formatLabels.cuisineType[dish.cuisineType]}
                  </span>
                </div>

                {/* Price */}
                {/* <div className="font-bold text-lg text-blue-600">
                  ₹{dish.price}
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {data.dishes.length > 8 && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              View All Dishes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
