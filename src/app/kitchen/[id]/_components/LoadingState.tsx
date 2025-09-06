/* eslint-disable react/no-unescaped-entities */
// components/EmptyState.tsx
import React from "react";
import { ChefHat, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Header */}
      <div className="h-60 md:h-80 bg-gray-200 animate-pulse relative">
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="h-6 md:h-8 bg-gray-300 rounded w-48 md:w-64 mb-4"></div>
            <div className="h-3 md:h-4 bg-gray-300 rounded w-64 md:w-96 mb-2"></div>
            <div className="h-3 md:h-4 bg-gray-300 rounded w-48 md:w-80"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading delicious meal plans...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// components/ErrorState.tsx

interface ErrorStateProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <ChefHat className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          Unable to load kitchen
        </h2>
        <p className="text-gray-600 mb-4 text-sm md:text-base">
          {error?.response?.data?.message ||
            "Something went wrong while loading this kitchen's menu"}
        </p>
        <Button onClick={() => window.location.reload()} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  type: "kitchen-not-found" | "no-subscriptions";
  kitchenName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  kitchenName,
}) => {
  if (type === "kitchen-not-found") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Kitchen not found
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            This kitchen doesn't exist or is not available
          </p>
        </div>
      </div>
    );
  }

  if (type === "no-subscriptions") {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No meal plans available yet
          </h3>
          <p className="text-gray-500 mb-4">
            {kitchenName} is setting up their subscription plans
          </p>
          <p className="text-sm text-gray-400">
            Check back soon for delicious meal options!
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};
