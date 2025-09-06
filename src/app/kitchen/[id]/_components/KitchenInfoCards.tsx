// components/KitchenInfoCards.tsx
import React from "react";
import { MapPin, Users, Calendar, Award, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kitchen } from "./types";
// import { Kitchen } from "../types";

interface KitchenInfoCardsProps {
  kitchen: Kitchen;
}

export const KitchenInfoCards: React.FC<KitchenInfoCardsProps> = ({
  kitchen,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {/* Service Areas */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
            Delivery Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            We deliver to {kitchen?.pincodes?.length || 0} locations in
            Bangalore
          </p>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {kitchen?.pincodes?.map((pincode) => (
              <Badge key={pincode} variant="outline" className="text-xs">
                {pincode}
              </Badge>
            )) || (
              <Badge variant="outline" className="text-xs">
                No delivery areas set
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Kitchen Stats */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Award className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            Kitchen Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <span>Chef: {kitchen?.adminName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>
              Since{" "}
              {kitchen?.createdAt
                ? new Date(kitchen.createdAt).getFullYear()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Health certified</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
