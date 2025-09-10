import React from "react";
import {
  RotateCcw,
  DollarSign,
  XCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <RotateCcw className="h-8 w-8 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Return & Refund Policy
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Understanding our return and refund procedures for fresh food
            delivery.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Introduction */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Fair & Transparent Refunds
            </h2>
            <p className="text-lg opacity-90">
              Since we provide fresh, perishable meals, our refund policy is
              designed to be fair while ensuring food safety and quality.
            </p>
          </div>

          <div className="p-8 space-y-10">
            {/* Food Return Policy */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Food Return Policy
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-medium mb-2">
                        No Returns on Delivered Meals
                      </p>
                      <p className="text-red-700 text-sm">
                        As meals are freshly prepared and perishable, we do not
                        accept returns once delivered to maintain food safety
                        standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refunds Section */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  When Refunds Apply
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800 mb-1">
                          Subscription Cancellations
                        </p>
                        <p className="text-green-700 text-sm">
                          Before the start date of your subscription
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800 mb-1">
                          Payment Issues
                        </p>
                        <p className="text-green-700 text-sm">
                          Failed or duplicate payments will be refunded
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      Processing Time
                    </span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Refunds are processed to the original payment method within{" "}
                    <span className="font-semibold">7–10 business days</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Failures */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Delivery Failures
                </h3>
                <div className="bg-orange-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    If a meal is not delivered due to our error, we will provide
                    one of the following solutions:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <RotateCcw className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        Re-delivery
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        Account Credit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Cancellations */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Mid-Month Cancellations
                </h3>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium mb-2">
                        Prorated Refunds
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        If you cancel your subscription mid-month, we will
                        calculate and refund a prorated amount for any
                        undelivered meals remaining in your current billing
                        cycle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Important Notes
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">
                    🔄 Original Payment Method
                  </h4>
                  <p className="text-sm text-gray-600">
                    All refunds are processed back to your original payment
                    method used for the purchase.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">
                    ⏰ Processing Time
                  </h4>
                  <p className="text-sm text-gray-600">
                    While we process refunds within 7-10 business days, your
                    bank may take additional time to reflect the credit.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">
                    📞 Customer Support
                  </h4>
                  <p className="text-sm text-gray-600">
                    Have questions about a refund? Contact our support team for
                    personalized assistance.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">
                    📋 Documentation
                  </h4>
                  <p className="text-sm text-gray-600">
                    Keep your order confirmation emails for faster resolution of
                    refund requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-2 text-sm">
            For refund inquiries, please contact our customer support team.
          </p>
        </div>
      </div>
    </div>
  );
}
