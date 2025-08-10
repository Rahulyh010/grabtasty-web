/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDishes } from "../api";
import { IDish, MealType } from "../types";
import Header from "../Header";
import CategoriesSection from "../CategoriesSection";
import DishesSection from "../DishesSection";
import NearbyKitchens from "../NearbyKitchens";
import BottomNavigation from "../BottomNavigation";

// Kitchen interface matching your API
interface Kitchen {
  _id: string;
  name: string;
  address: string;
  pincodes: string[];
  adminName: string;
  phone: string;
  email: string;
  lastLogin: string | null;
  todaysMenu: {
    date: string;
    dishes: string[];
    active: boolean;
  };
  allDishes: string[];
  createdAt: string;
  updatedAt: string;
  banner?: string;
  __v: number;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [pincode, setPincode] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);

  // Fetch all dishes
  const {
    data: allDishes = [],
    isLoading: isDishesLoading,
    error: dishesError,
  } = useQuery({
    queryKey: ["dishes"],
    queryFn: () => fetchDishes(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // Fetch kitchens from API
  const {
    data: kitchens = [],
    isLoading: isKitchensLoading,
    error: kitchensError,
  } = useQuery({
    queryKey: ["kitchens", pincode],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen`
      );
      const data = await response.json();
      return data?.data?.kitchens || [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // Local search for kitchens
  const filteredKitchens = useMemo(() => {
    if (!searchQuery.trim()) return kitchens;

    return kitchens.filter(
      (kitchen: Kitchen) =>
        kitchen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kitchen.pincodes.some((pc) => pc.includes(searchQuery)) ||
        kitchen.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, kitchens]);

  // Get dishes for selected kitchen
  const selectedKitchenDishes = useMemo(() => {
    if (!selectedKitchen) return [];

    // Filter dishes based on kitchen's todaysMenu or allDishes
    const kitchenDishIds = selectedKitchen.todaysMenu?.active
      ? selectedKitchen.todaysMenu.dishes
      : selectedKitchen.allDishes;

    return allDishes.filter((dish: IDish) =>
      kitchenDishIds.includes(dish._id || dish.id)
    );
  }, [selectedKitchen, allDishes]);

  // Fetch dishes by category when category changes
  const { data: categoryDishes = [] } = useQuery({
    queryKey: ["dishes", activeCategory],
    queryFn: () =>
      activeCategory === "ALL"
        ? Promise.resolve([])
        : fetchDishes({ mealType: activeCategory as MealType }),
    enabled: activeCategory !== "ALL",
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // Group dishes by meal type for displaying in sections
  const groupedDishes = React.useMemo(() => {
    return allDishes.reduce((acc, dish) => {
      if (!acc[dish.mealType]) {
        acc[dish.mealType] = [];
      }
      acc[dish.mealType].push(dish);
      return acc;
    }, {} as Record<MealType, IDish[]>);
  }, [allDishes]);

  // Get the appropriate dishes based on active category
  const filteredDishes = activeCategory === "ALL" ? allDishes : categoryDishes;

  // Loading state
  if (isDishesLoading || isKitchensLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 pb-24">
        <Header pincode={pincode} setPincode={setPincode} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading kitchens...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Error state
  if (dishesError || kitchensError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 pb-24">
        <Header pincode={pincode} setPincode={setPincode} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load data</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 pb-24">
      <Header pincode={pincode} setPincode={setPincode} />

      {/* Local Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by kitchen name or pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Kitchens Section - Main Focus */}
      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🍳 Available Kitchens
        </h2>

        {filteredKitchens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No kitchens found for your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKitchens.map((kitchen: Kitchen) => (
              <div
                key={kitchen._id}
                onClick={() => setSelectedKitchen(kitchen)}
                className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedKitchen?._id === kitchen._id
                    ? "ring-2 ring-amber-500"
                    : ""
                }`}
              >
                <div className="relative h-40">
                  <img
                    src={
                      kitchen.banner ||
                      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?fm=jpg&q=60&w=800"
                    }
                    alt={kitchen.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-2 left-2">
                    <h3 className="font-semibold text-lg text-white">
                      {kitchen.name}
                    </h3>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    📍 {kitchen.address}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {kitchen.pincodes.map((pincode, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
                      >
                        {pincode}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {kitchen.todaysMenu?.active
                      ? `${kitchen.todaysMenu.dishes.length} dishes available today`
                      : `${kitchen.allDishes.length} dishes available`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Kitchen Dishes - Display Only */}
      {selectedKitchen && selectedKitchenDishes.length > 0 && (
        <div className="px-4 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            🍽️ Available from {selectedKitchen.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedKitchenDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden pointer-events-none"
              >
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  {dish.imageUrl ? (
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🍽️</span>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm text-gray-800 truncate">
                    {dish.name}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">₹{dish.price}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            * Items shown for display only
          </p>
        </div>
      )}

      {/* Categories Section - Secondary */}
      <CategoriesSection
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Dishes Sections */}
      <div className="space-y-8">
        {activeCategory === "ALL" ? (
          <>
            {groupedDishes.BREAKFAST && groupedDishes.BREAKFAST.length > 0 && (
              <DishesSection
                dishes={groupedDishes.BREAKFAST}
                title="🌅 Breakfast Specials"
              />
            )}

            {groupedDishes.LUNCH && groupedDishes.LUNCH.length > 0 && (
              <DishesSection
                dishes={groupedDishes.LUNCH}
                title="🍽️ Lunch Favorites"
              />
            )}

            {groupedDishes.DINNER && groupedDishes.DINNER.length > 0 && (
              <DishesSection
                dishes={groupedDishes.DINNER}
                title="🌙 Dinner Delights"
              />
            )}

            {groupedDishes.SNACKS && groupedDishes.SNACKS.length > 0 && (
              <DishesSection
                dishes={groupedDishes.SNACKS}
                title="🍿 Quick Snacks"
              />
            )}

            {groupedDishes.DRINKS && groupedDishes.DRINKS.length > 0 && (
              <DishesSection
                dishes={groupedDishes.DRINKS}
                title="🥤 Refreshing Drinks"
              />
            )}
          </>
        ) : (
          <>
            {filteredDishes.length > 0 ? (
              <DishesSection
                dishes={filteredDishes}
                title={`${activeCategory.charAt(0)}${activeCategory
                  .slice(1)
                  .toLowerCase()} Items`}
              />
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-600">
                  No items found in this category.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Original NearbyKitchens component for additional context */}
      {/* <NearbyKitchens pincode={pincode} /> */}
    </div>
  );
}
