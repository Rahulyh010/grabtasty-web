// app/orders/[orderId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  CreditCard,
  AlertCircle,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const isSuccess = searchParams.get("success") === "true";
  const [activeTab, setActiveTab] = useState("overview");

  const axios = useAxios();

  // ✅ fetch purchase details
  const {
    data: purchase,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["purchase", orderId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/purchase/${orderId}`);
      return data.data; // assuming resHandler wraps in { code, data }
    },
    enabled: !!orderId,
  });

  // ✅ fetch summary too (optional for sidebar insights)
  const { data: summary } = useQuery({
    queryKey: ["purchase-summary"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/purchase/user/me/summary`);
      return data.data.summary;
    },
  });

  useEffect(() => {
    if (isSuccess && purchase?.paymentDetails?.paymentStatus === "SUCCESS") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(
        "🎉 Order placed successfully! Your subscription is now active."
      );
    }
  }, [isSuccess, purchase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <Package className="w-10 h-10 animate-pulse text-blue-500 mr-2" />
        Loading order details...
      </div>
    );
  }

  if (isError || !purchase) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-2" />
        <h2 className="text-lg font-semibold">Order not found</h2>
        <p className="text-gray-500 mb-4">We couldn’t find this order.</p>
        <Link href="/orders">
          <Button>Go back to orders</Button>
        </Link>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "SUCCESS":
      case "DELIVERED":
        return "text-green-600 bg-green-100";
      case "PENDING":
      case "SCHEDULED":
        return "text-yellow-600 bg-yellow-100";
      case "CANCELLED":
      case "FAILED":
      case "MISSED":
        return "text-red-600 bg-red-100";
      case "PAUSED":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success banner */}
      {isSuccess && purchase.paymentDetails?.paymentStatus === "SUCCESS" && (
        <div className="bg-green-600 text-white py-3 text-center">
          <CheckCircle2 className="w-5 h-5 inline-block mr-1" />
          Payment successful! Subscription active.
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Order #{purchase._id.slice(-8)}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(purchase.purchaseDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge
              className={`px-3 py-1 ${getStatusColor(purchase.purchaseStatus)}`}
            >
              {purchase.purchaseStatus}
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Invoice
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="flex space-x-6 border-b mb-6">
          {[
            { id: "overview", label: "Overview", icon: Package },
            { id: "deliveries", label: "Deliveries", icon: Truck },
            { id: "subscriptions", label: "Subscriptions", icon: Calendar },
            { id: "payment", label: "Payment", icon: CreditCard },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center py-3 px-1 border-b-2 ${
                activeTab === id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Content (simplified for now) */}
        {activeTab === "overview" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <p>
              <strong>Kitchen:</strong> {purchase.kitchenId?.name}
            </p>
            <p>
              <strong>Amount Paid:</strong>{" "}
              {formatCurrency(purchase.finalAmount)}
            </p>
            <p>
              <strong>Payment:</strong> {purchase.paymentDetails?.paymentStatus}
            </p>
          </div>
        )}

        {activeTab === "payment" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Payment Info</h2>
            <p>Method: {purchase.paymentDetails?.paymentMethod || "N/A"}</p>
            <p>Status: {purchase.paymentDetails?.paymentStatus}</p>
          </div>
        )}
      </div>

      {/* Sidebar / summary insights */}
      {summary && (
        <div className="max-w-5xl mx-auto px-4 mt-10">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Your Purchase Summary
            </h2>
            <p>Total Purchases: {summary.totalPurchases}</p>
            <p>Total Spent: {formatCurrency(summary.totalSpent)}</p>
            <p>Active Subscriptions: {summary.activePurchases}</p>
            <p>Meals Delivered: {summary.totalMealsDelivered}</p>
          </div>
        </div>
      )}
    </div>
  );
}
