/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Mail,
  Home,
  AlertCircle,
} from "lucide-react";

// Updated TypeScript Interfaces to match your actual API response
interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
}

interface PaymentDetails {
  paymentMethod: string;
  paymentStatus: "SUCCESS" | "FAILED" | "PENDING";
  paidAt?: string;
  razorpayPaymentId?: string;
  transactionId?: string;
}

interface CustomerPreferences {
  starchChoice: string;
  spiceLevel: string;
  portionSize: string;
}

interface PurchasedSubscription {
  customerPreferences: CustomerPreferences;
  comboId: string;
  systemCode: string;
  planName: string;
  cuisineType: string;
  description: string;
  pattern: string;
  patternDescription: string;
  durationType: "WEEKLY" | "MONTHLY";
  durationValue: number;
  unitPrice: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalMealsScheduled: number;
  totalMealsDelivered: number;
  totalMealsMissed: number;
  subscriptionStatus: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED";
  _id: string;
}

interface DeliveryScheduleItem {
  date: string;
  mealType: string;
  foodType: string;
  cuisineType: string;
  starchChoice: string;
  spiceLevel: string;
  portionSize: string;
  status: "SCHEDULED" | "DELIVERED" | "MISSED";
  _id: string;
}

interface Kitchen {
  _id: string;
  name: string;
  address: string;
  phone: string;
}

// Updated Purchase interface to match your API response exactly
interface Purchase {
  _id: string;
  userId: string;
  kitchenId: Kitchen | null;
  customerInfo?: CustomerInfo;
  paymentDetails: PaymentDetails;
  purchasedSubscriptions: PurchasedSubscription[];
  deliverySchedule: DeliveryScheduleItem[];
  subtotal: number;
  discount: number;
  taxes: number;
  finalAmount?: number;
  purchaseStatus: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED";
  purchaseDate: string;
  overallStartDate: string;
  overallEndDate: string;
  overallTotalMealsScheduled: number;
  overallTotalMealsDelivered: number;
  overallTotalMealsMissed: number;
  createdAt: string;
  updatedAt: string;
  __v: number;

  // Legacy fields for backward compatibility
  userAddress?: string;
  userPincode?: string;
  finalPrice?: number;
  duration?: number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  transactionId?: string;
  startDate?: string;
  endDate?: string;
  subscriptionId?: any;
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

// Fetch function updated for your API
const fetchUserPurchases = async (
  axios: any,
  userId: string,
  status?: string,
  page: number = 1
): Promise<PurchasesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
    ...(status && status !== "ALL" && { status }),
  });

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchase/user/me`
  );

  return response.data;
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

// Helper function to get the correct values from purchase object
const getPurchaseValues = (purchase: Purchase) => {
  return {
    // Use purchaseStatus or fallback to status
    status: purchase.purchaseStatus || purchase.status || "ACTIVE",

    // Use finalAmount or fallback to finalPrice
    finalAmount: purchase.finalAmount || purchase.finalPrice || 0,

    // Use paymentDetails or fallback to legacy fields
    paymentStatus:
      purchase.paymentDetails?.paymentStatus ||
      purchase.paymentStatus ||
      "PENDING",
    paymentMethod:
      purchase.paymentDetails?.paymentMethod || purchase.paymentMethod || "UPI",
    transactionId:
      purchase.paymentDetails?.transactionId || purchase.transactionId || "N/A",

    // Use overallStartDate/EndDate or fallback to startDate/endDate
    startDate:
      purchase.overallStartDate || purchase.startDate || purchase.createdAt,
    endDate: purchase.overallEndDate || purchase.endDate || purchase.createdAt,

    // Calculate duration
    duration:
      purchase.duration ||
      (purchase.overallEndDate && purchase.overallStartDate
        ? Math.ceil(
            (new Date(purchase.overallEndDate).getTime() -
              new Date(purchase.overallStartDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 30),

    // Use customerInfo address or fallback to userAddress
    deliveryAddress:
      purchase.customerInfo?.address ||
      purchase.userAddress ||
      "Address not available",
    deliveryPincode:
      purchase.customerInfo?.pincode || purchase.userPincode || "N/A",

    // Customer info
    customerName: purchase.customerInfo?.name || "Customer",
    customerPhone: purchase.customerInfo?.phone || "N/A",
    customerEmail: purchase.customerInfo?.email || "N/A",
  };
};

// Order Card Component
function OrderCard({ purchase }: { purchase: Purchase }) {
  const values = getPurchaseValues(purchase);
  const statusInfo =
    statusConfig[values.status as keyof typeof statusConfig] ||
    statusConfig.ACTIVE;
  const StatusIcon = statusInfo?.icon;
  const daysRemaining = calculateDaysRemaining(values.endDate);
  const paymentInfo =
    paymentStatusConfig[
      values.paymentStatus as keyof typeof paymentStatusConfig
    ] || paymentStatusConfig.PENDING;

  // Get main subscription info
  const mainSubscription = purchase.purchasedSubscriptions?.[0];
  const subscriptionName = mainSubscription?.planName || "Subscription Plan";
  const cuisineType = mainSubscription?.cuisineType || "Mixed";

  return (
    <div className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {subscriptionName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Order #{purchase._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-sm text-orange-600 font-medium">
              {cuisineType} Cuisine
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`${statusInfo.color} border px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
            >
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Kitchen Info */}
        {purchase.kitchenId ? (
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
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Kitchen information not available</span>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        {purchase.purchasedSubscriptions &&
          purchase.purchasedSubscriptions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Subscription Plans:
              </p>
              <div className="space-y-2">
                {purchase.purchasedSubscriptions.map((sub) => (
                  <div key={sub._id} className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {sub.planName}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {sub.description}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        ₹{sub.totalPrice}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span>
                        Duration: {sub.durationType} ({sub.durationValue})
                      </span>
                      <span>Meals: {sub.totalMealsScheduled}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="bg-white px-2 py-1 rounded text-xs border">
                        {sub.patternDescription}
                      </span>
                      <span className="bg-white px-2 py-1 rounded text-xs border">
                        {sub.customerPreferences.spiceLevel} Spice
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="border-t pt-4"></div>

        {/* Duration & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Start Date:</span>
              <span>{formatDate(values.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-red-500" />
              <span className="font-medium">End Date:</span>
              <span>{formatDate(values.endDate)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Duration:</span>
              <span>{values.duration} days</span>
            </div>
            {values.status === "ACTIVE" && (
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

        <div className="border-t pt-4"></div>

        {/* Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Receipt className="h-4 w-4 text-green-500" />
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-lg">₹{values.finalAmount}</span>
            </div>
            {purchase.subtotal && (
              <div className="text-xs text-gray-500 space-y-1">
                <div>Subtotal: ₹{purchase.subtotal}</div>
                {purchase.discount > 0 && (
                  <div>Discount: -₹{purchase.discount}</div>
                )}
                {purchase.taxes > 0 && <div>Taxes: +₹{purchase.taxes}</div>}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Payment:</span>
              <span className={paymentInfo.color}>{paymentInfo.label}</span>
            </div>
            <div className="text-xs text-gray-500">
              {values.paymentMethod} • {values.transactionId}
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Customer Info:
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{values.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {values.customerPhone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {values.customerEmail}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                <Home className="h-4 w-4 text-blue-500" />
                Delivery Address:
              </h4>
              <div className="text-sm text-gray-600">
                <p>{values.deliveryAddress}</p>
                <p className="mt-1">Pincode: {values.deliveryPincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Progress */}
        {purchase.overallTotalMealsScheduled > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-gray-900 mb-2">
              Meal Progress:
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {purchase.overallTotalMealsScheduled}
                </div>
                <div className="text-xs text-gray-600">Scheduled</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {purchase.overallTotalMealsDelivered}
                </div>
                <div className="text-xs text-gray-600">Delivered</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {purchase.overallTotalMealsMissed}
                </div>
                <div className="text-xs text-gray-600">Missed</div>
              </div>
            </div>
          </div>
        )}

        {/* Order Date */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Ordered on {formatDate(purchase.purchaseDate || purchase.createdAt)}
        </div>
      </div>
    </div>
  );
}

// Main Orders Page Component
export default function OrdersPage() {
  const api = useAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Fetch purchases directly without auth check
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userPurchases", statusFilter, currentPage],
    queryFn: () => fetchUserPurchases(api, "dummy", statusFilter, currentPage),
    retry: 2,
  });

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 w-full bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl border-0 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Failed to load orders
          </h2>
          <p className="text-gray-600 mb-6">
            There was an error loading your order history
          </p>
          <button
            onClick={() => refetch()}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const purchases = data.data?.purchases || [];
  const pagination = data.data?.pagination;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your subscription orders
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border-0 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-900">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["ALL", "ACTIVE", "COMPLETED", "CANCELLED", "PAUSED"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders List */}
        {purchases && purchases?.length === 0 ? (
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
              {purchases &&
                purchases?.map((purchase) => (
                  <OrderCard key={purchase._id} purchase={purchase} />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {purchases.length} of {pagination.totalPurchases}{" "}
                  orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
