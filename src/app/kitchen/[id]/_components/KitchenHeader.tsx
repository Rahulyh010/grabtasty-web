/* eslint-disable @next/next/no-img-element */
// components/KitchenHeader.tsx
import React from "react";
import { Star, MapPin, Phone, Clock, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Kitchen } from "./types";
// import { Kitchen } from "../types";

interface KitchenHeaderProps {
  kitchen: Kitchen;
}

export const KitchenHeader: React.FC<KitchenHeaderProps> = ({ kitchen }) => {
  return (
    <div className="relative h-60 md:h-80 lg:h-96 overflow-hidden">
      <img
        src={kitchen?.banner || "/api/placeholder/800/400"}
        alt={kitchen?.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {kitchen?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                    <span className="text-base md:text-lg font-medium">
                      4.5
                    </span>
                    <span className="text-xs md:text-sm opacity-90">
                      (247 reviews)
                    </span>
                  </div>
                  <Badge
                    className={
                      kitchen?.approved
                        ? "bg-green-500 text-xs md:text-sm"
                        : "bg-orange-500 text-xs md:text-sm"
                    }
                  >
                    {kitchen?.approved ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-xs md:text-sm opacity-90">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">
                      {kitchen?.address?.split(",").slice(0, 2).join(", ") ||
                        "Address not available"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{kitchen?.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Delivery: 7 AM - 9 PM</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="text-xs">
                  <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Save
                </Button>
                <Button variant="secondary" size="sm" className="text-xs">
                  <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
