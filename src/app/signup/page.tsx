/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

// Address Schema
const addressSchema = z
  .object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().min(6).max(6).optional(),
    landmark: z.string().optional(),
  })
  .optional();

// Signup Schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
  address: addressSchema,
});

type SignupInput = z.infer<typeof signupSchema>;

const STEPS = [
  { id: 1, title: "Personal Info", description: "Basic information" },
  { id: 2, title: "Address", description: "Delivery address (optional)" },
  { id: 3, title: "Complete", description: "Review and submit" },
];

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const watchedValues = watch();

  const validateStep = async (step: number) => {
    const fieldsToValidate: (keyof SignupInput)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate.push("name", "email", "phone", "password");
        break;
      case 2:
        // Address is optional, so no validation needed
        return true;
      default:
        return true;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/signup", data);

      if (response.data.success) {
        // Redirect to email verification page
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10 h-12"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="pl-10 h-12"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10 pr-10 h-12"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delivery Address (Optional)
              </h3>
              <p className="text-sm text-gray-600">
                You can skip this step and add your address later
              </p>
            </div>

            {/* Address Line 1 */}
            <div className="space-y-2">
              <Label
                htmlFor="address.line1"
                className="text-sm font-medium text-gray-700"
              >
                Address Line 1
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="address.line1"
                  type="text"
                  placeholder="Street address"
                  className="pl-10 h-12"
                  {...register("address.line1")}
                />
              </div>
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <Label
                htmlFor="address.line2"
                className="text-sm font-medium text-gray-700"
              >
                Address Line 2
              </Label>
              <Input
                id="address.line2"
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                className="h-12"
                {...register("address.line2")}
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="address.city"
                  className="text-sm font-medium text-gray-700"
                >
                  City
                </Label>
                <Input
                  id="address.city"
                  type="text"
                  placeholder="City"
                  className="h-12"
                  {...register("address.city")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="address.state"
                  className="text-sm font-medium text-gray-700"
                >
                  State
                </Label>
                <Input
                  id="address.state"
                  type="text"
                  placeholder="State"
                  className="h-12"
                  {...register("address.state")}
                />
              </div>
            </div>

            {/* Pincode and Landmark */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="address.pincode"
                  className="text-sm font-medium text-gray-700"
                >
                  Pincode
                </Label>
                <Input
                  id="address.pincode"
                  type="text"
                  placeholder="123456"
                  className="h-12"
                  {...register("address.pincode")}
                />
                {errors.address?.pincode && (
                  <p className="text-sm text-red-600">
                    {errors.address.pincode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="address.landmark"
                  className="text-sm font-medium text-gray-700"
                >
                  Landmark
                </Label>
                <Input
                  id="address.landmark"
                  type="text"
                  placeholder="Near landmark"
                  className="h-12"
                  {...register("address.landmark")}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Review Your Information
              </h3>
              <p className="text-sm text-gray-600">
                Please review your details before creating your account
              </p>
            </div>

            {/* Review Personal Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{watchedValues.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{watchedValues.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{watchedValues.phone}</p>
                </div>
              </div>
            </div>

            {/* Review Address if provided */}
            {(watchedValues.address?.line1 || watchedValues.address?.city) && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">Delivery Address</h4>
                <div className="text-sm">
                  {watchedValues.address?.line1 && (
                    <p>{watchedValues.address.line1}</p>
                  )}
                  {watchedValues.address?.line2 && (
                    <p>{watchedValues.address.line2}</p>
                  )}
                  {(watchedValues.address?.city ||
                    watchedValues.address?.state ||
                    watchedValues.address?.pincode) && (
                    <p>
                      {[
                        watchedValues.address?.city,
                        watchedValues.address?.state,
                        watchedValues.address?.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Food Hub
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-16 h-1 ml-2 ${
                    currentStep > step.id ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Signup Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center">
              {STEPS[currentStep - 1].title}
            </CardTitle>
            <p className="text-sm text-gray-600 text-center">
              {STEPS[currentStep - 1].description}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50 mb-6">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={`h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white ${
                      currentStep === 1 ? "w-full" : "flex-1"
                    }`}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/signin")}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
