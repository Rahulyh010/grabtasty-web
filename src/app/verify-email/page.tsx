/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useAxios } from "@/hooks/useAxios";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Timer,
} from "lucide-react";

// Validation Schema
const verifyEmailSchema = z.object({
  token: z.string().min(6, "Verification code must be 6 digits").max(6),
});

type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for OTP expiry
  const [resendTimeLeft, setResendTimeLeft] = useState(30); // 30 seconds for resend
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  // Timer countdown for OTP expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Timer countdown for resend button
  useEffect(() => {
    if (resendTimeLeft > 0) {
      const timer = setTimeout(
        () => setResendTimeLeft(resendTimeLeft - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (
      newOtpValues.every((val) => val !== "") &&
      newOtpValues.join("").length === 6
    ) {
      handleVerifyEmail(newOtpValues.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length === 6) {
      const newOtpValues = pastedData.split("");
      setOtpValues(newOtpValues);
      handleVerifyEmail(pastedData);
    }
  };

  const handleVerifyEmail = async (token: string) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use /auth endpoint
      const response = await axios.post("/auth/verify-email", { token });

      if (response.data.success) {
        setSuccess("Email verified successfully! Redirecting to profile...");
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        setError(response.data.message || "Verification failed");
        setOtpValues(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Verification failed. Please try again.";
      setError(errorMessage);
      setOtpValues(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !email) return;

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      // Use correct /auth/resend-otp endpoint
      const response = await axios.post("/auth/resend-otp", {
        email,
      });

      if (response.data.success) {
        setSuccess("Verification code sent successfully!");
        setTimeLeft(300); // Reset OTP expiry timer to 5 minutes
        setResendTimeLeft(30); // Reset resend timer to 30 seconds
        setCanResend(false);
        setOtpValues(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        setError(response.data.message || "Failed to resend code");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to resend code. Please try again.";
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        {/* Verification Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center">
              Enter Verification Code
            </CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Code expires in {formatTime(timeLeft)}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Alert */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* OTP Input */}
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={otpValues[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-orange-500"
                      disabled={isLoading}
                    />
                  ))}
              </div>

              <p className="text-xs text-gray-500 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Manual Verify Button (if needed) */}
            {otpValues.join("").length === 6 && !isLoading && (
              <Button
                onClick={() => handleVerifyEmail(otpValues.join(""))}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Verify Email
                  </div>
                )}
              </Button>
            )}

            {/* Resend Section */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>

              {canResend ? (
                <Button
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  {isResending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Resend Code
                    </div>
                  )}
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Timer className="h-4 w-4" />
                  Resend available in {resendTimeLeft} seconds
                </div>
              )}
            </div>

            {/* Change Email */}
            <div className="text-center">
              <button
                onClick={() => router.push("/signup")}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Wrong email? Change it
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Back to Signup */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/signup")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
}
