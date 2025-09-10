import React from "react";
import {
  FileText,
  CreditCard,
  Truck,
  Edit,
  XCircle,
  Scale,
  AlertCircle,
} from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Please read these terms carefully before using our service.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Service Agreement</h2>
            <p className="text-lg opacity-90">
              By using our monthly food subscription service, you agree to
              comply with and be bound by the following terms and conditions.
            </p>
          </div>

          <div className="p-8 space-y-10">
            {/* Service Overview */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Service Overview
                </h3>
                <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-3">
                    We provide a monthly subscription-based food delivery
                    service to your registered address.
                  </p>
                  <p className="text-gray-700">
                    Subscription plans are prepaid and renewed automatically
                    unless canceled.
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription & Payment */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Subscription & Payment
                </h3>
                <div className="grid gap-4">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="text-gray-700 font-medium">Monthly Billing</p>
                    <p className="text-gray-600 text-sm">
                      Subscriptions are billed monthly
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="text-gray-700 font-medium">
                      Secure Processing
                    </p>
                    <p className="text-gray-600 text-sm">
                      Payments are processed securely through [Payment Gateway
                      Name]
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="text-gray-700 font-medium">Price Changes</p>
                    <p className="text-gray-600 text-sm">
                      Any changes to pricing will be communicated at least 15
                      days in advance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Policy */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Delivery Policy
                </h3>
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 font-medium mb-1">
                        Daily Delivery
                      </p>
                      <p className="text-gray-600 text-sm">
                        Meals are delivered daily as per your chosen plan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 font-medium mb-1">
                        Timing Variations
                      </p>
                      <p className="text-gray-600 text-sm">
                        Delivery timings may vary due to unforeseen conditions
                        (traffic, weather, etc.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Modifications */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Edit className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Modifications
                </h3>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    Meal preference changes must be submitted at least{" "}
                    <span className="font-semibold text-purple-700">
                      24 hours in advance
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Cancellations */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Cancellations
                </h3>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    Subscriptions can be canceled anytime, with refunds
                    processed as per our refund policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Sections */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-6 w-6 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Liability</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We ensure hygienic preparation and delivery. However, we are
                  not responsible for food spoilage if delivery is delayed due
                  to customer unavailability.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Governing Law</h4>
                </div>
                <p className="text-sm text-gray-700">
                  These terms are governed by the laws of [Your Country/State].
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-2 text-sm">
            By continuing to use our service, you acknowledge that you have read
            and agree to these terms.
          </p>
        </div>
      </div>
    </div>
  );
}
