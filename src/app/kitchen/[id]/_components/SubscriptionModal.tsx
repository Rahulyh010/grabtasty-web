// components/SubscriptionModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "./types";
// import { Subscription } from "../types";

interface SubscriptionModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  subscription,
  isOpen,
  onClose,
}) => {
  if (!subscription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{subscription.systemCodeInfo.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Meal Pattern Details
            </h4>
            <p className="text-sm text-blue-700 mb-2">
              {subscription.systemCodeInfo.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-600">
              <div>
                <strong>Pattern:</strong>{" "}
                {subscription.systemCodeInfo.patternDescription}
              </div>
              <div>
                <strong>Days:</strong> {subscription.systemCodeInfo.daysPerWeek}{" "}
                per week
              </div>
            </div>
          </div>
          {subscription.sampleDishes.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Sample Dishes</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subscription.sampleDishes.map((dish, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="justify-center"
                  >
                    {dish}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div>
            <h4 className="font-medium mb-3">Customizations Available</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-lg border text-center ${
                  subscription.customizations.allowChapatiRiceChoice
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                <div className="font-medium">Chapati/Rice Choice</div>
                <div className="text-2xl mt-1">
                  {subscription.customizations.allowChapatiRiceChoice
                    ? "✓"
                    : "✗"}
                </div>
              </div>
              <div
                className={`p-3 rounded-lg border text-center ${
                  subscription.customizations.allowSpiceLevelChoice
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                <div className="font-medium">Spice Level</div>
                <div className="text-2xl mt-1">
                  {subscription.customizations.allowSpiceLevelChoice
                    ? "✓"
                    : "✗"}
                </div>
              </div>
              <div
                className={`p-3 rounded-lg border text-center ${
                  subscription.customizations.allowPortionChoice
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                <div className="font-medium">Portion Size</div>
                <div className="text-2xl mt-1">
                  {subscription.customizations.allowPortionChoice ? "✓" : "✗"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
