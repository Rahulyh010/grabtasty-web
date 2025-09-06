// components/SubscriptionGrid.tsx
import React from "react";
import { ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
// import { Subscription } from "../types";
import { SubscriptionCard } from "./SubscriptionCard";
import { Subscription } from "./types";

interface SubscriptionGridProps {
  subscriptions: Subscription[];
  isEmpty: boolean;
}

export const SubscriptionGrid: React.FC<SubscriptionGridProps> = ({
  subscriptions,
  isEmpty,
}) => {
  if (isEmpty) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No plans found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.comboId}
          subscription={subscription}
        />
      ))}
    </div>
  );
};
