/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUserPurchases } from "@/hooks/usePurchases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";

export default function SubscriptionsPage() {
  const { data, isLoading, isError, error } = useUserPurchases();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2">Loading purchases...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertCircle className="h-6 w-6 mb-2" />
        <p>Failed to load purchases</p>
        <pre className="text-xs text-gray-500">
          {String((error as any)?.message)}
        </pre>
      </div>
    );
  }

  const purchases = data?.purchases || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">My Subscriptions</h1>

      {purchases.length === 0 ? (
        <p className="text-gray-600">No purchases found.</p>
      ) : (
        purchases.map((purchase: any) => (
          <Card key={purchase._id} className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{purchase._id.slice(-6)}</span>
                <Badge
                  variant={
                    purchase.paymentDetails?.paymentStatus === "SUCCESS"
                      ? "default"
                      : purchase.paymentDetails?.paymentStatus === "PENDING"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {purchase.paymentDetails?.paymentStatus || "UNKNOWN"}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-500">
                {new Date(purchase.purchaseDate).toLocaleString()}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Subscriptions inside purchase */}
              {purchase.purchasedSubscriptions?.length > 0 ? (
                <div className="grid gap-3">
                  {purchase.purchasedSubscriptions.map((sub: any) => (
                    <div
                      key={sub._id}
                      className="border rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{sub.planName}</p>
                        <p className="text-sm text-gray-500">
                          {sub.cuisineType}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(sub.startDate).toLocaleDateString()} →{" "}
                          {new Date(sub.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{sub.totalPrice}</p>
                        <Badge
                          variant={
                            sub.subscriptionStatus === "ACTIVE"
                              ? "default"
                              : sub.subscriptionStatus === "EXPIRED"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {sub.subscriptionStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No subscriptions found in this order.
                </p>
              )}

              {/* Totals */}
              <div className="border-t pt-3 text-sm text-gray-700 flex justify-between">
                <span>Total Amount</span>
                <span className="font-semibold">₹{purchase.finalAmount}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
