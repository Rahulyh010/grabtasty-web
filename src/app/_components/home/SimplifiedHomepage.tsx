/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Kitchen {
  _id: string;
  name: string;
  address: string;
  banner: string;
  pincodes: string[];
  adminName: string;
  approved: boolean;
}

export default function SimplifiedHomepage() {
  const router = useRouter();
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for saved pincode on component mount
  useEffect(() => {
    const savedPincode = localStorage.getItem("user_pincode");

    if (!savedPincode) {
      // No pincode saved, show modal
      setShowPincodeModal(true);
    } else {
      // Pincode exists, redirect to kitchen directly
      redirectToKitchen(savedPincode);
    }
  }, []);

  // Function to find and redirect to kitchen based on pincode
  const redirectToKitchen = async (userPincode: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch kitchens");
      }

      const data = await response.json();
      const kitchens: Kitchen[] = data?.data?.kitchens || [];

      // Find kitchen that serves this pincode
      const availableKitchen = kitchens.find(
        (kitchen) => kitchen.approved && kitchen.pincodes.includes(userPincode)
      );

      if (availableKitchen) {
        // Redirect to the kitchen page
        router.push(`/kitchen/${availableKitchen._id}`);
      } else {
        setError(
          "Sorry, we don't serve in your area yet. Please try a different pincode."
        );
        // Clear invalid pincode from localStorage
        localStorage.removeItem("user_pincode");
        setShowPincodeModal(true);
      }
    } catch (err) {
      console.error("Error fetching kitchens:", err);
      setError("Failed to check service availability. Please try again.");
      setShowPincodeModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pincode submission
  const handlePincodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pincode.trim()) {
      setError("Please enter your pincode");
      return;
    }

    if (pincode.length !== 6) {
      setError("Pincode must be 6 digits");
      return;
    }

    // Save pincode to localStorage
    localStorage.setItem("user_pincode", pincode);

    // Close modal and redirect
    setShowPincodeModal(false);
    await redirectToKitchen(pincode);
  };

  // Handle pincode change
  const handleChangePincode = () => {
    localStorage.removeItem("user_pincode");
    setPincode("");
    setError("");
    setShowPincodeModal(true);
  };

  if (isLoading && !showPincodeModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Finding your kitchen...
          </h2>
          <p className="text-gray-600">
            Please wait while we locate kitchens in your area
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Homepage Content */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative container mx-auto px-4 py-24">
            <div className="text-center text-white max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                Welcome to
                <span className="block text-yellow-300">Belly Soul</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 opacity-90">
                Fresh, homemade meals delivered from verified local kitchens.
                Discover the joy of authentic home cooking.
              </p>

              {/* Change Pincode Button */}
              <Button
                onClick={handleChangePincode}
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-50 text-lg px-8 py-3"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Change Location
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why Choose Belly Soul?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience the perfect blend of convenience and authentic home
                cooking
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Local Kitchens</h3>
                <p className="text-gray-600">
                  Verified home kitchens in your neighborhood preparing fresh
                  meals daily
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">100% Fresh</h3>
                <p className="text-gray-600">
                  Meals prepared fresh daily with high-quality ingredients and
                  love
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">On-Time Delivery</h3>
                <p className="text-gray-600">
                  Reliable delivery schedule that fits your daily routine
                  perfectly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pincode Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Enter Your Location
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  We need your pincode to show available kitchens
                </p>
              </div>
              {/* Note: No close button as this modal is mandatory */}
            </div>

            {/* Modal Content */}
            <form onSubmit={handlePincodeSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pincode" className="text-sm font-medium">
                    Pincode <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="pincode"
                      type="text"
                      placeholder="Enter 6-digit pincode"
                      value={pincode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setPincode(value);
                        setError("");
                      }}
                      className="pl-10 h-12 text-lg"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">
                        Why do we need this?
                      </h4>
                      <p className="text-sm text-blue-700">
                        We'll show you kitchens available in your area and
                        ensure fresh meal delivery to your location.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isLoading || pincode.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Finding Kitchens...
                    </div>
                  ) : (
                    "Find My Kitchen"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
