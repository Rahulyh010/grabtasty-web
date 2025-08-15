/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAxios } from "@/hooks/useAxios";
import {
  Crown,
  MapPin,
  CreditCard,
  Clock,
  Utensils,
  Shield,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Phone,
  User,
  XCircle,
} from "lucide-react";

interface Subscription {
  _id: string;
  kitchenId: {
    _id: string;
    name: string;
    address: string;
    phone: string;
  };
  comboConfig: {
    name: string;
    description: string;
    mealTypes: string[];
    cuisineType: string;
    foodType: string;
    price: number;
    discountPercentage?: number;
  };
  duration: number;
}

interface CheckoutPageProps {
  subscriptionId: string;
}

// Authentication check function with proper refresh token handling
const checkAuth = async (api: any, router: any) => {
  try {
    console.log("🔍 Starting auth check...");
    const response = await api.get("/auth/me");
    console.log("✅ Auth check successful:", response.data);
    return response.data;
  } catch (error: any) {
    router.push("/signin");
    console.error("❌ Auth check failed:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);

    // If it's a 401, check if it's because refresh token also failed
    if (error.response?.status === 401) {
      console.log("🔄 Got 401 - this means refresh token likely failed too");

      // Check if the error message indicates refresh token failure
      const errorMessage = error.response?.data?.message || error.message || "";
      if (errorMessage.includes("refresh") || errorMessage.includes("token")) {
        console.log("❌ Refresh token failed, user needs to login again");
        throw new Error("REFRESH_TOKEN_FAILED");
      }
    }

    throw new Error(
      `Authentication failed: ${error.response?.status || "Network error"}`
    );
  }
};

const fetchSubscription = async (subscriptionId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscriptions/${subscriptionId}`
  );
  if (!response.ok) throw new Error("Failed to fetch subscription");
  return response.json();
};

const createPurchase = async (purchaseData: any, api: any) => {
  const response = await api.post("/api/purchases/create", purchaseData);
  return response.data;
};

// Loading Component
function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  );
}

// Error Component
function CheckoutError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't load the subscription details. Please try again.
          </p>

          <div className="space-y-3">
            <Button onClick={onRetry} className="w-full">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPage({ subscriptionId }: CheckoutPageProps) {
  const router = useRouter();
  const api = useAxios();
  const [user, setUser] = useState<any>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    userAddress: "",
    userPincode: "",
    paymentMethod: "UPI",
    transactionId: "",
  });

  // Check authentication with immediate redirect on refresh failure
  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
    refetch: refetchAuth,
  } = useQuery({
    queryKey: ["auth-check"],
    queryFn: () => checkAuth(api, router),
    retry: false, // Don't retry, redirect immediately on failure
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Fetch subscription details
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    error: subscriptionError,
    refetch,
  } = useQuery({
    queryKey: ["subscription", subscriptionId],
    queryFn: () => fetchSubscription(subscriptionId),
    enabled: !!authData?.success, // Only fetch if authenticated
  });

  // Create purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: (purchaseData: any) => createPurchase(purchaseData, api),
    onSuccess: (data) => {
      router.push(`/order-confirmation/${data.data.purchase._id}`);
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    },
  });

  // Handle authentication state changes with immediate redirect
  useEffect(() => {
    console.log("🔍 Auth state changed:", {
      authData: !!authData,
      authError: !!authError,
      authLoading,
      isRedirecting,
      success: authData?.success,
    });

    if (authData?.success) {
      console.log("✅ User authenticated:", authData.data.user);
      setUser(authData.data.user);
      setIsRedirecting(false);
    } else if (authError && !authLoading) {
      console.log(
        "❌ Authentication failed, redirecting to signin immediately"
      );

      // Don't set isRedirecting to true, just redirect immediately
      setUser(null);

      console.log("🔄 Executing immediate redirect to /signin");
      router.replace("/signin"); // Use replace instead of push to avoid back navigation
    }
  }, [authData, authError, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Checking Authentication...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your authentication...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If there's an auth error, don't render anything (redirect will happen)
  if (authError) {
    return null; // Don't render anything, redirect is in progress
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!authData?.success) {
    return null; // Don't render anything, redirect is in progress
  }

  // Show loading while fetching subscription
  if (subscriptionLoading) {
    return <CheckoutLoading />;
  }

  // Show error if subscription fetch failed
  if (subscriptionError || !subscriptionData?.data?.subscription) {
    return <CheckoutError onRetry={() => refetch()} />;
  }

  const subscription = subscriptionData.data.subscription;
  const originalPrice = subscription.comboConfig.price;
  const discount = subscription.comboConfig.discountPercentage || 0;
  const finalPrice = originalPrice - (originalPrice * discount) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userAddress || !formData.userPincode) {
      alert("Please fill in your address and pincode");
      return;
    }

    if (!user?._id) {
      alert("User authentication required");
      return;
    }

    purchaseMutation.mutate({
      userId: user._id,
      subscriptionId,
      userAddress: formData.userAddress,
      userPincode: formData.userPincode,
      paymentMethod: formData.paymentMethod,
      transactionId: `TXN${Date.now()}_${user._id}`, // Include user ID in transaction
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your subscription purchase</p>

          {/* Show logged in user with debug info */}
          {user && (
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <User className="h-4 w-4" />
                  <span>
                    Signed in as: <strong>{user?.name}</strong> ({user?.email})
                  </span>
                </div>
              </div>

              {/* Debug buttons - remove in production */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    console.log("🔄 Manual auth refetch triggered");
                    refetchAuth();
                  }}
                >
                  Test Auth
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      console.log("🔄 Testing refresh token directly...");
                      const result = await api.post("/auth/refresh");
                      console.log("✅ Refresh token test result:", result.data);
                    } catch (error: any) {
                      console.error(
                        "❌ Refresh token test failed:",
                        error.response?.data
                      );
                    }
                  }}
                >
                  Test Refresh
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Summary */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Subscription Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {subscription.comboConfig.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {subscription.comboConfig.description}
                </p>

                {/* Meal Types */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {subscription.comboConfig.mealTypes.map((meal: string) => (
                    <Badge key={meal} variant="secondary" className="text-xs">
                      {meal}
                    </Badge>
                  ))}
                </div>

                {/* Kitchen Details */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {subscription.kitchenId.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{subscription.kitchenId.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{subscription.kitchenId.phone}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span>₹{originalPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{originalPrice - finalPrice}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span>{subscription.duration} days</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{finalPrice}</span>
                </div>
                <div className="text-center text-sm text-gray-500">
                  ₹{Math.round(finalPrice / subscription.duration)}/day
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Fresh Daily Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>
                    {subscription.comboConfig.cuisineType.replace("_", " ")}{" "}
                    Cuisine
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <span>{subscription.comboConfig.foodType} Only</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="bg-green-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Delivery & Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </h3>

                  <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address"
                      value={formData.userAddress}
                      onChange={(e) =>
                        handleInputChange("userAddress", e.target.value)
                      }
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="Enter pincode"
                      value={formData.userPincode}
                      onChange={(e) =>
                        handleInputChange("userPincode", e.target.value)
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {["UPI", "CARD", "NETBANKING", "WALLET"].map((method) => (
                      <Button
                        key={method}
                        type="button"
                        variant={
                          formData.paymentMethod === method
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          handleInputChange("paymentMethod", method)
                        }
                        className="text-sm"
                      >
                        {method}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  disabled={purchaseMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-lg"
                >
                  {purchaseMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Place Order - ₹{finalPrice}
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our terms and conditions
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
