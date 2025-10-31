/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Clock,
  Star,
  ChefHat,
  Phone,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FeaturedDishes from "./FeaturedDishes";

interface Kitchen {
  _id: string;
  name: string;
  address: string;
  banner: string;
  pincodes: string[];
  adminName: string;
  phone: string;
  email: string;
  approved: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface KitchenWithSubscriptions extends Kitchen {
  activeSubscriptions: number;
  totalPlans: number;
  rating?: number;
  deliveryTime?: string;
}

export default function KitchenDiscoveryLanding() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");

  // Fetch kitchens from API
  const {
    data: kitchensResponse,
    isLoading: isKitchensLoading,
    error: kitchensError,
  } = useQuery({
    queryKey: ["kitchens"],
    queryFn: async (): Promise<{ kitchens: Kitchen[] }> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch kitchens");
      }

      const data = await response.json();
      return {
        kitchens: data?.data?.kitchens || [],
      };
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const kitchens = kitchensResponse?.kitchens || [];

  // Get unique pincodes for filter
  const allPincodes = useMemo(() => {
    const pincodeSet = new Set<string>();
    kitchens.forEach((kitchen) => {
      kitchen.pincodes.forEach((pincode) => pincodeSet.add(pincode));
    });
    return Array.from(pincodeSet).sort();
  }, [kitchens]);

  // Filter kitchens based on search and pincode
  const filteredKitchens = useMemo(() => {
    let filtered = kitchens.filter((kitchen) => kitchen.approved);

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (kitchen) =>
          kitchen.name.toLowerCase().includes(query) ||
          kitchen.address.toLowerCase().includes(query) ||
          kitchen.adminName.toLowerCase().includes(query) ||
          kitchen.pincodes.some((pc) => pc.includes(query))
      );
    }

    // Pincode filter
    if (selectedPincode) {
      filtered = filtered.filter((kitchen) =>
        kitchen.pincodes.includes(selectedPincode)
      );
    }

    return filtered;
  }, [searchQuery, selectedPincode, kitchens]);

  // Handle kitchen click navigation
  const handleKitchenClick = (kitchen: Kitchen) => {
    router.push(`/kitchen/${kitchen._id}`);
  };

  // Loading state
  if (isKitchensLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Discovering amazing kitchens...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (kitchensError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load kitchens</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="block text-yellow-300">Home Kitchens</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Fresh, homemade meals delivered from verified local kitchens.
              Subscribe to meal plans that fit your taste and lifestyle.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 bg-white rounded-lg p-4 shadow-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by kitchen name, area, or pincode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-0 focus:ring-0 shadow-none text-black placeholder:text-gray-400"
                  />
                </div>
                <select
                  value={selectedPincode}
                  onChange={(e) => setSelectedPincode(e.target.value)}
                  className="px-4 h-12 border border-gray-200 rounded-md text-gray-700 bg-white"
                >
                  <option value="">All Areas</option>
                  {allPincodes.map((pincode) => (
                    <option key={pincode} value={pincode}>
                      {pincode}
                    </option>
                  ))}
                </select>
                <Button className="h-12 px-8 bg-orange-500 hover:bg-orange-600">
                  <Search className="w-5 h-5 mr-2" />
                  Find Kitchens
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <FeaturedDishes /> ✅ Add this */}
      {/* Stats Section */}
      {/* <div className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {kitchens.length}
              </div>
              <div className="text-gray-600">Active Kitchens</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {allPincodes.length}
              </div>
              <div className="text-gray-600">Service Areas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {kitchens.filter((k) => k.approved).length}
              </div>
              <div className="text-gray-600">Verified Kitchens</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-gray-600">Fresh & Homemade</div>
            </div>
          </div>
        </div>
      </div> */}
      {/* Search Results Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery || selectedPincode
                ? "Search Results"
                : "All Available Kitchens"}
            </h2>
            <p className="text-gray-600">
              Found {filteredKitchens.length} kitchen
              {filteredKitchens.length !== 1 ? "s" : ""}
              {selectedPincode && ` in ${selectedPincode}`}
            </p>
          </div>

          {(searchQuery || selectedPincode) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedPincode("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Kitchens Grid */}
        {filteredKitchens.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No kitchens found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or browse all available
              kitchens
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedPincode("");
              }}
            >
              View All Kitchens
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredKitchens.map((kitchen) => (
              <KitchenCard
                key={kitchen._id}
                kitchen={kitchen}
                onClick={() => handleKitchenClick(kitchen)}
              />
            ))}
          </div>
        )}
      </div>

      <FeaturedDishes />
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Meal Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Choose from our verified home kitchens and enjoy fresh, healthy
            meals delivered daily
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-50"
            >
              Browse All Kitchens
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-black hover:bg-white hover:text-orange-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Kitchen Card Component
interface KitchenCardProps {
  kitchen: Kitchen;
  onClick: () => void;
}

function KitchenCard({ kitchen, onClick }: KitchenCardProps) {
  const isRecentlyActive = kitchen.lastLogin
    ? new Date(kitchen.lastLogin) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false;

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md"
      onClick={onClick}
    >
      <div className="relative">
        <div className="h-48 overflow-hidden">
          <img
            src={
              kitchen.banner ||
              `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format`
            }
            alt={kitchen.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Status Badges */}
        <div className="absolute top-3 left-3">
          {kitchen.approved && (
            <Badge className="bg-green-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {isRecentlyActive && (
            <Badge className="bg-blue-500 text-white">
              <Clock className="w-3 h-3 mr-1" />
              Active
            </Badge>
          )}
        </div>

        {/* Kitchen Name Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-xl mb-1 line-clamp-1">
            {kitchen.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-1">
            by {kitchen.adminName}
          </p>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Address */}
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 text-sm line-clamp-2">
            {kitchen.address}
          </p>
        </div>

        {/* Service Areas */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Service Areas:</p>
          <div className="flex flex-wrap gap-1">
            {kitchen.pincodes.slice(0, 3).map((pincode) => (
              <Badge key={pincode} variant="outline" className="text-xs">
                {pincode}
              </Badge>
            ))}
            {kitchen.pincodes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{kitchen.pincodes.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Phone className="w-3 h-3" />
            <span>{kitchen.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Mail className="w-3 h-3" />
            <span className="truncate">{kitchen.email}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          View Kitchen
        </Button>
      </CardContent>
    </Card>
  );
}
