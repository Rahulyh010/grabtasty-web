/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAxios } from "@/hooks/useAxios";
import {
  User,
  Mail,
  Phone,
  Home,
  ShoppingCart,
  Package,
  LogOut,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ---------------- Types ----------------
interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  address?: Address;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface Purchase {
  _id: string;
  status: string;
  items: { name: string; quantity: number }[];
}

interface CartItem {
  _id: string;
  planName: string;
  cuisineType: string;
  durationType: string;
  durationValue: number;
  totalPrice: number;
}

interface Subscription {
  _id: string;
  planName: string;
  cuisineType: string;
  durationType: string;
  durationValue: number;
  startDate: string;
  endDate: string;
  subscriptionStatus: "ACTIVE" | "INACTIVE" | string;
}

interface Purchase {
  _id: string;
  kitchenId?: {
    name?: string;
    phone?: string;
  };
  purchasedSubscriptions?: Subscription[];
  paymentDetails?: {
    paymentStatus?: string;
  };
  finalAmount?: number;
  finalPrice?: number;
}

// ---------------- Fetchers ----------------
const fetchUserProfile = async (api: any): Promise<UserProfile> => {
  const res = await api.get("/auth/me");
  return res.data.data.user;
};

const fetchUserPurchases = async (api: any): Promise<Purchase[]> => {
  const res = await api.get("/api/purchase/user/me");
  return res.data.data.purchases || [];
};

const fetchUserCart = async (api: any): Promise<CartItem[]> => {
  const res = await api.get("/api/cart/user/me");
  return res.data.data?.cart.items || [];
};

// ---------------- Helpers ----------------
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

// ---------------- Page ----------------
export default function ProfilePage() {
  const api = useAxios();
  const router = useRouter();

  // Queries
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(api),
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ["userPurchases"],
    queryFn: () => fetchUserPurchases(api),
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ["userCart"],
    queryFn: () => fetchUserCart(api),
  });

  const handleLogout = async () => {
    try {
      await api.post("/auth/signout");
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.clear();
      router.push("/signin");
    }
  };

  console.log(user, "user");
  console.log(purchases, "purchases");
  console.log(cartItems, "cartItems");

  if (loadingUser) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-gray-600">Please login to view profile</p>
        <Button onClick={() => router.push("/signin")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-orange-500" />
              {user.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" /> {user.email}
              <Badge
                className={
                  user.isVerified
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }
              >
                {user.isVerified ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" /> Not Verified
                  </>
                )}
              </Badge>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" /> {user.phone}
            </p>
            {user.address && (
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <span>
                  {user.address.line1}
                  <br />
                  {user.address.line2}
                  <br />
                  {[user.address.city, user.address.state, user.address.pincode]
                    .filter(Boolean)
                    .join(", ")}
                  {user.address.landmark && (
                    <span> (Landmark: {user.address.landmark})</span>
                  )}
                </span>
              </p>
            )}
            <Separator className="my-2" />
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" /> Member since:{" "}
              {formatDate(user.createdAt)}
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" /> Last updated:{" "}
              {formatDate(user.updatedAt)}
            </p>
            {user.lastLogin && (
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" /> Last login:{" "}
                {formatDate(user.lastLogin)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!purchases || purchases.length === 0 ? (
              <p className="text-gray-600">No subscriptions found.</p>
            ) : (
              <ul className="space-y-3">
                {purchases.map((purchase) => (
                  <li
                    key={purchase._id}
                    className="border rounded-md p-3 space-y-2 bg-gray-50"
                  >
                    {/* Kitchen Info */}
                    {purchase.kitchenId ? (
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          {purchase.kitchenId.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {purchase.kitchenId.phone}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No kitchen linked</p>
                    )}

                    {/* Subscription Plans */}
                    {purchase.purchasedSubscriptions &&
                    purchase.purchasedSubscriptions?.length > 0 ? (
                      <ul className="space-y-1">
                        {purchase.purchasedSubscriptions.map((sub) => (
                          <li
                            key={sub._id}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{sub.planName}</p>
                              <p className="text-xs text-gray-500">
                                {sub.cuisineType} • {sub.durationType} (
                                {sub.durationValue})
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(sub.startDate).toLocaleDateString()} →{" "}
                                {new Date(sub.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              className={
                                sub.subscriptionStatus === "ACTIVE"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {sub.subscriptionStatus}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No subscription details
                      </p>
                    )}

                    {/* Payment Info */}
                    <div className="flex justify-between text-sm text-gray-600 pt-2 border-t">
                      <span>
                        Paid:{" "}
                        {purchase.paymentDetails?.paymentStatus === "SUCCESS"
                          ? "✅ Success"
                          : purchase.paymentDetails?.paymentStatus || "Unknown"}
                      </span>
                      <span>
                        ₹{purchase.finalAmount || purchase.finalPrice}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Cart Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-500" />
              My Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems?.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <ul className="space-y-2">
                {cartItems?.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between items-center border rounded-md p-2"
                  >
                    <div>
                      <p className="font-medium">{item.planName}</p>
                      <p className="text-sm text-gray-500">
                        {item.cuisineType} | {item.durationValue}{" "}
                        {item.durationType.toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-700">
                        ₹{item.totalPrice}
                      </p>
                    </div>
                    {/* Quantity not present in your data, you can add a default if needed */}
                    <span>x1</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/subscriptions")}
            >
              <Package className="h-4 w-4 mr-2" />
              Subscriptions
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
