/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAxios } from "@/hooks/useAxios";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Crown,
  Clock,
  Star,
  LogIn,
} from "lucide-react";

// TypeScript Interfaces
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  isActive: boolean;
  role: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}

// Fetch function using axios
const fetchUserProfile = async (api: any): Promise<UserProfileResponse> => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatJoinedDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

// Quick Links Configuration
const quickLinks = [
  {
    title: "My Subscriptions",
    description: "View and manage your active meal subscriptions",
    icon: Package,
    href: "/subscriptions",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
  },
  {
    title: "Delivery Addresses",
    description: "Manage your saved delivery addresses",
    icon: MapPin,
    href: "/addresses",
    color: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-50",
  },
];

// Profile Stats Component
function ProfileStats({ user }: { user: UserProfile }) {
  const memberSince = formatJoinedDate(user.createdAt);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center">
        <Crown className="h-6 w-6 text-orange-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-orange-600">
          {user.role === "USER" ? "Premium" : user.role}
        </p>
        <p className="text-xs text-orange-600">Member</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
        <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-blue-600">Member</p>
        <p className="text-xs text-blue-600">{memberSince}</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
        <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-green-600">
          {user.isVerified ? "Verified" : "Unverified"}
        </p>
        <p className="text-xs text-green-600">Account</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
        <Star className="h-6 w-6 text-purple-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-purple-600">4.8</p>
        <p className="text-xs text-purple-600">Rating</p>
      </div>
    </div>
  );
}

// Quick Link Card Component
function QuickLinkCard({ link }: { link: (typeof quickLinks)[0] }) {
  const router = useRouter();
  const Icon = link.icon;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 shadow-md"
      onClick={() => router.push(link.href)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${link.bgColor}`}>
              <Icon className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
              <p className="text-sm text-gray-600">{link.description}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
}

// Login Prompt Component
function LoginPrompt() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-orange-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Welcome to Food Hub
          </h2>
          <p className="text-gray-600 mb-8">
            Please sign in to view your profile and manage your meal
            subscriptions
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/signin")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>

            <Button
              onClick={() => router.push("/signup")}
              variant="outline"
              className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading Component
function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Component
function ProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't load your profile. Please try again.
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

// Main Profile Page Component
export default function ProfilePage() {
  const router = useRouter();
  const api = useAxios();

  // Fetch user profile
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(api),
    retry: 1,
  });

  const handleLogout = async () => {
    try {
      await api.post("/auth/signout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear any local storage if needed
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      router.push("/signin");
    }
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  // Show loading state
  // if (isLoading) {
  //   return <ProfileLoading />;
  // }

  // Show login prompt for authentication errors
  if (error || !data?.success) {
    const errorStatus = (error as any)?.response?.status;

    if (errorStatus === 401 || errorStatus === 403) {
      return <LoginPrompt />;
    }

    return <LoginPrompt />;
  }

  const user = data.data.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your account and meal preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {user.name}
                  </CardTitle>
                  <p className="text-orange-100">Food Hub Member</p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleEditProfile}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Profile Stats */}
            <ProfileStats user={user} />

            <Separator />

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Email Address
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{user.email}</span>
                    <Badge
                      className={
                        user.isVerified
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {user.isVerified ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Verified
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Phone Number
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{user.phone}</span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <Phone className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Address if available */}
              {user.address && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Address
                    </span>
                  </div>
                  <div className="text-gray-900">
                    <p>{user.address.line1}</p>
                    {user.address.line2 && <p>{user.address.line2}</p>}
                    <p>
                      {[
                        user.address.city,
                        user.address.state,
                        user.address.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Account Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Account Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </p>
                  <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </p>
                  <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
                </div>
                {user.lastLogin && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Last Login
                    </p>
                    <p className="text-gray-900">
                      {formatDate(user.lastLogin)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quickLinks.map((link, index) => (
              <QuickLinkCard key={index} link={link} />
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Account Actions
                </h3>
                <p className="text-sm text-gray-600">
                  Manage your account security
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
