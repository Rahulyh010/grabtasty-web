/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ChefHat,
  Phone,
  Mail,
  Grid,
  List,
  Heart,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

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

interface KitchenStats {
  totalKitchens: number;
  verifiedKitchens: number;
  serviceAreas: number;
  activeKitchens: number;
}

export default function KitchenPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch kitchens from API
  const {
    data: kitchensResponse,
    isLoading: isKitchensLoading,
    error: kitchensError,
    refetch: refetchKitchens,
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

  const kitchens = kitchensResponse?.kitchens || [];

  // Calculate stats
  const stats: KitchenStats = useMemo(() => {
    const totalKitchens = kitchens.length;
    const verifiedKitchens = kitchens.filter((k) => k.approved).length;
    const allPincodes = new Set<string>();
    kitchens.forEach((kitchen) => {
      kitchen.pincodes.forEach((pincode) => allPincodes.add(pincode));
    });
    const activeKitchens = kitchens.filter((k) => {
      if (!k.lastLogin) return false;
      const lastLoginDate = new Date(k.lastLogin);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastLoginDate > weekAgo;
    }).length;

    return {
      totalKitchens,
      verifiedKitchens,
      serviceAreas: allPincodes.size,
      activeKitchens,
    };
  }, [kitchens]);

  // Get unique pincodes for filter
  const allPincodes = useMemo(() => {
    const pincodeSet = new Set<string>();
    kitchens.forEach((kitchen) => {
      kitchen.pincodes.forEach((pincode) => pincodeSet.add(pincode));
    });
    return Array.from(pincodeSet).sort();
  }, [kitchens]);

  // Filter and sort kitchens
  const filteredAndSortedKitchens = useMemo(() => {
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

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "areas":
          return b.pincodes.length - a.pincodes.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedPincode, sortBy, kitchens]);

  const handleKitchenClick = (kitchen: Kitchen) => {
    router.push(`/kitchen/${kitchen._id}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPincode("");
    setSortBy("name");
  };

  // Loading state
  if (isKitchensLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">
                Loading amazing kitchens...
              </p>
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
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load the kitchens. Please try again.
            </p>
            <button
              onClick={() => refetchKitchens()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Explore Our Kitchen Network
            </h1>
            <p className="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto">
              Discover verified home kitchens in your area, each offering fresh,
              authentic meals with love and care.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <ChefHat className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalKitchens}</div>
              <div className="text-sm opacity-80">Total Kitchens</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.verifiedKitchens}</div>
              <div className="text-sm opacity-80">Verified</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.serviceAreas}</div>
              <div className="text-sm opacity-80">Service Areas</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.activeKitchens}</div>
              <div className="text-sm opacity-80">Active This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search kitchens by name, area, or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center">
              <select
                value={selectedPincode}
                onChange={(e) => setSelectedPincode(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Areas</option>
                {allPincodes.map((pincode) => (
                  <option key={pincode} value={pincode}>
                    {pincode}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="name">Sort by Name</option>
                <option value="newest">Newest First</option>
                <option value="areas">Most Service Areas</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedPincode) && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedPincode && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  Area: {selectedPincode}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-800 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery || selectedPincode
                ? "Search Results"
                : "All Kitchens"}
            </h2>
            <p className="text-gray-600">
              Showing {filteredAndSortedKitchens.length} of {kitchens.length}{" "}
              kitchens
            </p>
          </div>
        </div>

        {/* No Results */}
        {filteredAndSortedKitchens.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No kitchens found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedPincode
                ? "Try adjusting your search criteria"
                : "No kitchens are currently available"}
            </p>
            {(searchQuery || selectedPincode) && (
              <button
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View All Kitchens
              </button>
            )}
          </div>
        ) : (
          /* Kitchen Grid/List */
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredAndSortedKitchens.map((kitchen) =>
              viewMode === "grid" ? (
                <KitchenCard
                  key={kitchen._id}
                  kitchen={kitchen}
                  onClick={() => handleKitchenClick(kitchen)}
                />
              ) : (
                <KitchenListItem
                  key={kitchen._id}
                  kitchen={kitchen}
                  onClick={() => handleKitchenClick(kitchen)}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want to Join Our Kitchen Network?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start your own food business by registering your home kitchen. Reach
            thousands of customers and grow your culinary passion.
          </p>
          <button className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2">
            Register Your Kitchen
            <ArrowRight className="w-5 h-5" />
          </button>
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
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      {/* Kitchen Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            kitchen.banner ||
            `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format`
          }
          alt={kitchen.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {kitchen.approved && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          )}
          {isRecentlyActive && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Active
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Kitchen Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
          {kitchen.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">by {kitchen.adminName}</p>

        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">
            {kitchen.address}
          </p>
        </div>

        {/* Service Areas */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Service Areas:</p>
          <div className="flex flex-wrap gap-1">
            {kitchen.pincodes.slice(0, 3).map((pincode) => (
              <span
                key={pincode}
                className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs"
              >
                {pincode}
              </span>
            ))}
            {kitchen.pincodes.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                +{kitchen.pincodes.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{kitchen.phone}</span>
          </div>
        </div>

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

// Kitchen List Item Component
function KitchenListItem({ kitchen, onClick }: KitchenCardProps) {
  const isRecentlyActive = kitchen.lastLogin
    ? new Date(kitchen.lastLogin) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false;

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Kitchen Image */}
        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={
              kitchen.banner ||
              `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&auto=format`
            }
            alt={kitchen.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Kitchen Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-xl text-gray-900">
                {kitchen.name}
              </h3>
              <p className="text-gray-600">by {kitchen.adminName}</p>
            </div>
            <div className="flex gap-2">
              {kitchen.approved && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  Verified
                </span>
              )}
              {isRecentlyActive && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  Active
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <p className="text-gray-600">{kitchen.address}</p>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              {kitchen.phone}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              {kitchen.email}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Service Areas:</p>
              <div className="flex flex-wrap gap-1">
                {kitchen.pincodes.slice(0, 5).map((pincode) => (
                  <span
                    key={pincode}
                    className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs"
                  >
                    {pincode}
                  </span>
                ))}
                {kitchen.pincodes.length > 5 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    +{kitchen.pincodes.length - 5} more
                  </span>
                )}
              </div>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              View Kitchen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
