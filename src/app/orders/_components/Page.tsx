/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAxios } from "@/hooks/useAxios";
import {
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  Utensils,
  Phone,
  CheckCircle,
  XCircle,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  Receipt,
  Loader2,
  User,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

// TypeScript Interfaces
interface ComboConfig {
  name: string;
  description: string;
  mealTypes: string[];
  cuisineType: string;
  foodType: string;
  price: number;
  discountPercentage?: number;
}

interface Kitchen {
  _id: string;
  name: string;
  address: string;
  phone: string;
}

interface Subscription {
  _id: string;
  comboConfig: ComboConfig;
}

interface Purchase {
  _id: string;
  userId: string;
  subscriptionId: Subscription;
  kitchenId: Kitchen;
  userAddress: string;
  userPincode: string;
  finalPrice: number;
  startDate: string;
  endDate: string;
  duration: number;
  paymentStatus: "SUCCESS" | "FAILED" | "PENDING";
  paymentMethod: "UPI" | "CARD" | "NETBANKING" | "WALLET";
  transactionId: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED";
  createdAt: string;
  updatedAt: string;
}

interface PurchasesResponse {
  success: boolean;
  message: string;
  data: {
    purchases: Purchase[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPurchases: number;
      hasNext: boolean;
    };
  };
}

interface OrdersPageProps {
  userId?: string;
}

// Authentication check function (same as checkout page but without redirect handling)
const checkAuth = async (api: any) => {
  try {
    console.log("🔍 Starting auth check...");
    const response = await api.get("/auth/me");
    console.log("✅ Auth check successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Auth check failed:", error);
    throw new Error(
      `Authentication failed: ${error.response?.status || "Network error"}`
    );
  }
};

// Fetch function
const fetchUserPurchases = async (
  userId: string,
  status?: string,
  page: number = 1
): Promise<PurchasesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
    ...(status && status !== "ALL" && { status }),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchase/user/me`
  );

  if (!response.ok) throw new Error("Failed to fetch purchases");
  return response.json();
};

// Status configuration
const statusConfig = {
  ACTIVE: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    label: "Active",
  },
  COMPLETED: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
    label: "Completed",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "Cancelled",
  },
  PAUSED: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Pause,
    label: "Paused",
  },
};

const paymentStatusConfig = {
  SUCCESS: { color: "text-green-600", label: "Success" },
  FAILED: { color: "text-red-600", label: "Failed" },
  PENDING: { color: "text-yellow-600", label: "Pending" },
};

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const calculateDaysRemaining = (endDate: string) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Order Card Component
function OrderCard({ purchase }: { purchase: Purchase }) {
  const statusInfo = statusConfig[purchase.status];
  const StatusIcon = statusInfo.icon;
  const daysRemaining = calculateDaysRemaining(purchase.endDate);
  const paymentInfo = paymentStatusConfig[purchase.paymentStatus];

  return (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {purchase.subscriptionId.comboConfig.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Order #{purchase._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${statusInfo.color} border`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Kitchen Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="h-4 w-4 text-orange-500" />
            <span className="font-semibold text-gray-900">
              {purchase.kitchenId.name}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{purchase.kitchenId.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span>{purchase.kitchenId.phone}</span>
            </div>
          </div>
        </div>

        {/* Meal Types */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Meal Types:</p>
          <div className="flex flex-wrap gap-2">
            {purchase.subscriptionId.comboConfig.mealTypes.map(
              (meal, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {meal}
                </Badge>
              )
            )}
          </div>
        </div>

        <Separator />

        {/* Duration & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Start Date:</span>
              <span>{formatDate(purchase.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-red-500" />
              <span className="font-medium">End Date:</span>
              <span>{formatDate(purchase.endDate)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Duration:</span>
              <span>{purchase.duration} days</span>
            </div>
            {purchase.status === "ACTIVE" && (
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-green-500" />
                <span className="font-medium">Days Left:</span>
                <span className="text-green-600 font-semibold">
                  {daysRemaining}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Receipt className="h-4 w-4 text-green-500" />
              <span className="font-medium">Amount:</span>
              <span className="font-bold text-lg">₹{purchase.finalPrice}</span>
            </div>
            <div className="text-xs text-gray-500">
              ₹{Math.round(purchase.finalPrice / purchase.duration)}/day
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Payment:</span>
              <span className={paymentInfo.color}>{paymentInfo.label}</span>
            </div>
            <div className="text-xs text-gray-500">
              {purchase.paymentMethod} • {purchase.transactionId}
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-900">
                Delivery Address:
              </p>
              <p className="text-sm text-gray-600">{purchase.userAddress}</p>
              <p className="text-sm text-gray-600">
                Pincode: {purchase.userPincode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Date */}
        <div className="text-xs text-gray-500 text-center">
          Ordered on {formatDate(purchase.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Orders Page Component
export default function OrdersPage() {
  const router = useRouter();
  const api = useAxios();
  const [user, setUser] = useState<any>(null);
  const propUserId = useSearchParams().get("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Check authentication (same pattern as checkout page)
  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
    refetch: refetchAuth,
  } = useQuery({
    queryKey: ["auth-check"],
    queryFn: () => checkAuth(api),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Set user from auth data or URL param
  useEffect(() => {
    console.log("🔍 Auth state changed:", {
      authData: !!authData,
      authError: !!authError,
      authLoading,
      success: authData?.success,
    });

    if (authData?.success) {
      console.log("✅ User authenticated:", authData.data.user);
      setUser(authData.data.user);
    } else if (propUserId) {
      // Fallback to prop userId if provided
      setUser({ _id: propUserId });
    } else if (authError && !authLoading) {
      console.log("❌ Authentication failed");
      setUser(null);
    }
  }, [authData, authError, authLoading, propUserId]);

  // Get userId for API calls
  const userId = user?._id;

  // Fetch purchases
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userPurchases", userId, statusFilter, currentPage],
    queryFn: () => fetchUserPurchases(userId, statusFilter, currentPage),
    enabled: !!userId, // Only fetch if we have userId
  });

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Loading Orders...
            </h2>
            <p className="text-gray-600">
              Please wait while we load your order history...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no userId available (not authenticated and no prop), show login prompt
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Please login to view orders
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access your order history
            </p>
            <Button onClick={() => router.push("/signin")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Failed to load orders
            </h2>
            <p className="text-gray-600 mb-6">
              There was an error loading your order history
            </p>
            <Button onClick={() => refetch()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const purchases = data.data.purchases;
  const pagination = data.data.pagination;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your subscription orders
          </p>

          {/* Show logged in user */}
          {user && authData?.success && (
            <div className="mt-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <User className="h-4 w-4" />
                  <span>
                    Viewing orders for: <strong>{user?.name}</strong> (
                    {user?.email})
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">
                Filter by Status:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["ALL", "ACTIVE", "COMPLETED", "CANCELLED", "PAUSED"].map(
                (status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusFilter(status)}
                    className="text-xs"
                  >
                    {status.replace("_", " ")}
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {statusFilter === "ALL"
                ? "You haven't placed any orders yet"
                : `No ${statusFilter.toLowerCase()} orders found`}
            </p>
          </div>
        ) : (
          <>
            {/* Orders Grid */}
            <div className="space-y-6 mb-8">
              {purchases.map((purchase) => (
                <OrderCard key={purchase._id} purchase={purchase} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {purchases.length} of {pagination.totalPurchases}{" "}
                  orders
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
