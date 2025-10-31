/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, Filter, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubscriptionCardNew } from "./SubscriptionCard";
import { FloatingCartButton } from "./FloatingCartNew";
// import { KitchenDishes } from "./KitchenDishes";
// import { SubscriptionCardNew } from "./SubscriptionCardNew";
// import { FloatingCartNew } from "./FloatingCartNew";

interface KitchenPageNewProps {
  kitchenId: string;
}

export const KitchenPageNew: React.FC<KitchenPageNewProps> = ({
  kitchenId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string>("all");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");

  // Fetch kitchen details
  const {
    data: kitchenData,
    isLoading: kitchenLoading,
    error: kitchenError,
  } = useQuery({
    queryKey: ["kitchen", kitchenId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen/${kitchenId}`
      );
      return response.data.data;
    },
    enabled: !!kitchenId,
  });

  // Fetch subscriptions
  const {
    data: subscriptionsData,
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
  } = useQuery({
    queryKey: ["subscriptions", kitchenId, selectedMealType, selectedCuisine],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedMealType !== "all")
        params.append("mealType", selectedMealType);
      if (selectedCuisine !== "all")
        params.append("cuisineType", selectedCuisine);

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/subscription/kitchen/${kitchenId}/published?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: !!kitchenId,
  });

  const isLoading = kitchenLoading || subscriptionsLoading;
  const error = kitchenError || subscriptionsError;

  // Filter subscriptions by search
  const filteredSubscriptions = React.useMemo(() => {
    const subs = subscriptionsData?.subscriptions || [];
    if (!searchTerm.trim()) return subs;

    const query = searchTerm.toLowerCase();
    return subs.filter(
      (sub: any) =>
        sub.systemCodeInfo.name.toLowerCase().includes(query) ||
        sub.cuisineType.toLowerCase().includes(query) ||
        sub.systemCode.toLowerCase().includes(query)
    );
  }, [subscriptionsData, searchTerm]);

  // Get unique cuisines
  const uniqueCuisines = React.useMemo(() => {
    const subs = subscriptionsData?.subscriptions || [];
    return [...new Set(subs.map((sub: any) => sub.cuisineType))];
  }, [subscriptionsData]);

  // Meal type options
  const mealTypes = [
    { value: "all", label: "All Meals" },
    { value: "BREAKFAST", label: "Breakfast" },
    { value: "LUNCH", label: "Lunch" },
    { value: "DINNER", label: "Dinner" },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to load kitchen data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading kitchen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Kitchen Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {kitchenData?.name || "Kitchen"}
              </h1>
              <p className="text-gray-600">{kitchenData?.address}</p>
              {kitchenData?.pincodes && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">Service areas:</span>
                  {kitchenData.pincodes.slice(0, 3).map((pincode: string) => (
                    <Badge key={pincode} variant="outline" className="text-xs">
                      {pincode}
                    </Badge>
                  ))}
                  {kitchenData.pincodes.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{kitchenData.pincodes.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ✅ NEW: Kitchen Dishes Section */}
      {/* <KitchenDishes kitchenId={kitchenId} /> */}
      {/* Filters Section */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Meal Type Filter */}
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="border rounded-md px-3 h-10 text-sm bg-white"
              >
                {mealTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {/* Cuisine Filter */}
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="border rounded-md px-3 h-10 text-sm bg-white"
              >
                <option value="all">All Cuisines</option>
                {uniqueCuisines &&
                  uniqueCuisines.map((cuisine: any) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
              </select>

              {/* Clear Filters */}
              {(selectedMealType !== "all" ||
                selectedCuisine !== "all" ||
                searchTerm) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedMealType("all");
                    setSelectedCuisine("all");
                    setSearchTerm("");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              {filteredSubscriptions.length} subscription
              {filteredSubscriptions.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredSubscriptions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No subscriptions found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedMealType("all");
                setSelectedCuisine("all");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubscriptions.map((subscription: any) => (
              <SubscriptionCardNew
                key={subscription._id}
                subscription={subscription}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      <FloatingCartButton />
    </div>
  );
};
