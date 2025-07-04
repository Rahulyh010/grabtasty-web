/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Search, ChevronDown, User, Store } from "lucide-react";

interface Kitchen {
  _id: string;
  name: string;
  address: string;
  pincodes: string[];
  adminName: string;
  phone: string;
  allDishes: Array<{
    name: string;
    cuisineType: string;
    mealType: string;
    foodType: string;
    price: number;
  }>;
}

interface PincodeSearchResponse {
  success: boolean;
  message: string;
  data: {
    pincode: string;
    totalKitchens: number;
    kitchens: Kitchen[];
  };
}

const searchKitchensByPincode = async (
  pincode: string
): Promise<PincodeSearchResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pincode/search/${pincode}`
  );
  if (!response.ok) {
    throw new Error("Failed to search kitchens");
  }
  return response.json();
};

interface HeaderProps {
  pincode?: string;
  setPincode?: (pincode: string) => void;
}

const KitchenSkeleton = () => (
  <Card className="cursor-pointer">
    <CardContent className="p-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Header({
  pincode: initialPincode = "",
  setPincode,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [searchPincode, setSearchPincode] = useState("");
  const [debouncedPincode, setDebouncedPincode] = useState("");
  const [selectedPincode, setSelectedPincode] = useState(initialPincode);
  const router = useRouter();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchPincode.length >= 3) {
        setDebouncedPincode(searchPincode);
      } else {
        setDebouncedPincode("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchPincode]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["kitchens", "pincode", debouncedPincode],
    queryFn: () => searchKitchensByPincode(debouncedPincode),
    enabled: !!debouncedPincode,
  });

  const handleKitchenSelect = (kitchenId: string, pincode: string) => {
    setSelectedPincode(pincode);
    if (setPincode) {
      setPincode(pincode);
    }
    setOpen(false);
    router.push(`/kitchen/${kitchenId}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePincodeChange = (pincode: string) => {
    setSelectedPincode(pincode);
    if (setPincode) {
      setPincode(pincode);
    }
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* First Row - Logo and Location */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg sm:text-xl font-bold text-yellow-600">
              BellySoul.in
            </h1>
          </div>

          {/* Location and User */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Location Selector */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-yellow-50"
                >
                  <MapPin className="h-4 w-4 text-green-600" />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs text-gray-500">Deliver to</div>
                    <div className="text-sm font-medium flex items-center gap-1">
                      {selectedPincode || "Select Area"}
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="sm:hidden flex items-center gap-1">
                    <span className="text-sm font-medium">
                      {selectedPincode || "Area"}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Choose your location</DialogTitle>
                  <DialogDescription>
                    Enter your pincode to find kitchens that deliver to your
                    area
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 flex-1 overflow-hidden">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Enter pincode (e.g. 560001, 110001, 400001)"
                      value={searchPincode}
                      onChange={(e) => setSearchPincode(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Show what's being searched */}
                  {searchPincode && (
                    <div className="text-xs text-gray-500">
                      Searching for: {searchPincode}{" "}
                      {isLoading && "(Loading...)"}
                    </div>
                  )}

                  {/* API Error Display */}
                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                      Error: {error.message}
                    </div>
                  )}

                  {/* Results */}
                  <div className="flex-1 overflow-y-auto">
                    {isLoading && (
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <KitchenSkeleton key={i} />
                        ))}
                      </div>
                    )}

                    {data && data.data.kitchens.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {data.data.totalKitchens} kitchen
                            {data.data.totalKitchens !== 1 ? "s" : ""} found in{" "}
                            {data.data.pincode}
                          </span>
                        </div>

                        {data.data.kitchens.map((kitchen) => (
                          <Card
                            key={kitchen._id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() =>
                              handleKitchenSelect(
                                kitchen._id,
                                data.data.pincode
                              )
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Store className="h-4 w-4 text-yellow-600" />
                                    <h3 className="font-medium text-gray-900">
                                      {kitchen.name}
                                    </h3>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {kitchen.address}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {[
                                      ...new Set(
                                        kitchen.allDishes.map(
                                          (d) => d.cuisineType
                                        )
                                      ),
                                    ]
                                      .slice(0, 3)
                                      .map((cuisine, index) => (
                                        <Badge
                                          key={cuisine}
                                          variant="secondary"
                                          className={`text-xs ${
                                            index % 2 === 0
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-green-100 text-green-800"
                                          }`}
                                        >
                                          {cuisine.replace("_", " ")}
                                        </Badge>
                                      ))}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {kitchen.allDishes.length} dishes •{" "}
                                    {kitchen.adminName}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {data && data.data.kitchens.length === 0 && (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No kitchens found
                        </h3>
                        <p className="text-gray-500">
                          We don't deliver to {data.data.pincode} yet. Try a
                          different pincode.
                        </p>
                      </div>
                    )}

                    {!debouncedPincode && !isLoading && !error && (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          Enter pincode
                        </h3>
                        <p className="text-gray-500">
                          Type pincode to search for kitchens
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* User Menu */}
            <Button variant="ghost" size="sm" className="hover:bg-green-50">
              <User className="h-4 w-4 text-green-600" />
              <span className="ml-2 hidden sm:inline">Account</span>
            </Button>
          </div>
        </div>

        {/* Second Row - Search Bar (Full Width) */}
        <div className="pb-3 sm:pb-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search dishes, cuisines..."
              className="w-full pl-12 py-3 bg-gray-50 border-0 focus:bg-white text-base rounded-lg"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
