/* eslint-disable @typescript-eslint/no-explicit-any */
// Main KitchenSubscriptionsPage.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { KitchenHeader } from "./KitchenHeader";
import { KitchenInfoCards } from "./KitchenInfoCards";
import { SubscriptionFilters } from "./SubscriptionFilters";
import { SubscriptionGrid } from "./SubscriptionGrid";
import { EmptyState, ErrorState, LoadingState } from "./LoadingState";

const KitchenSubscriptionsPage = ({ kitchenId }: { kitchenId: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [selectedCuisine, setSelectedCuisine] = useState("all");

  // Fetch kitchen details
  const {
    data: kitchenData,
    isLoading: kitchenLoading,
    error: kitchenError,
  } = useQuery({
    queryKey: ["kitchen-details", kitchenId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen/${kitchenId}`
      );
      return response.data.data;
    },
    enabled: !!kitchenId,
  });

  // Fetch kitchen subscriptions
  const {
    data: subscriptionData,
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
  } = useQuery({
    queryKey: [
      "kitchen-subscriptions",
      kitchenId,
      selectedMealType,
      selectedCuisine,
    ],
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

  // Filter subscriptions based on search term
  const filteredSubscriptions =
    subscriptionData?.subscriptions.filter(
      (sub: {
        cuisineType: string;
        systemCode: string;
        systemCodeInfo: { name: string };
      }) => {
        const matchesSearch =
          sub.cuisineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.systemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.systemCodeInfo.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesSearch;
      }
    ) || [];

  const uniqueCuisines = [
    ...new Set(
      subscriptionData?.subscriptions.map(
        (sub: { cuisineType: any }) => sub.cuisineType
      ) || []
    ),
  ];

  if (error) {
    return <ErrorState error={error} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!kitchenData) {
    return <EmptyState type="kitchen-not-found" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <KitchenHeader kitchen={kitchenData} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <KitchenInfoCards kitchen={kitchenData} />

        {kitchenData && !subscriptionData?.subscriptions?.length ? (
          <EmptyState type="no-subscriptions" kitchenName={kitchenData.name} />
        ) : (
          subscriptionData?.subscriptions?.length > 0 && (
            <>
              <SubscriptionFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedMealType={selectedMealType}
                setSelectedMealType={setSelectedMealType}
                selectedCuisine={selectedCuisine}
                setSelectedCuisine={setSelectedCuisine}
                // @ts-expect-error err
                uniqueCuisines={uniqueCuisines}
                totalSubscriptions={subscriptionData.totalSubscriptions}
              />

              <SubscriptionGrid
                subscriptions={filteredSubscriptions}
                isEmpty={filteredSubscriptions.length === 0}
              />
            </>
          )
        )}
      </div>
    </div>
  );
};

export default KitchenSubscriptionsPage;
