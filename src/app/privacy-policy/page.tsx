import React from "react";
import { Shield, Lock, Eye, Users, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Your privacy matters to us. Learn how we protect your data.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Introduction */}
          <div className="bg-gradient-to-r from-orange-500 to-green-500 p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">We Value Your Privacy</h2>
            <p className="text-lg opacity-90">
              We are committed to protecting your personal information. By using
              our website and subscription services, you agree to the terms
              outlined below.
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Information We Collect */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Information We Collect
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Name, email, phone number, address, and payment details
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Dietary preferences and delivery instructions
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Device, IP address, and browsing data for analytics
                  </li>
                </ul>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How We Use Your Information
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    To process and deliver your food subscription
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    To send order confirmations, updates, and promotional offers
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    To improve service quality and personalize your meal
                    experience
                  </li>
                </ul>
              </div>
            </div>

            {/* Data Protection */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Data Protection
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    We use secure payment gateways; we do not store your full
                    card details
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Data is stored securely and accessed only by authorized
                    personnel
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional Sections */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Third-Party Sharing
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    • We may share delivery details with logistics partners
                  </li>
                  <li>• We never sell your personal information</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Cookies</h4>
                <p className="text-sm text-gray-700">
                  We use cookies to enhance website performance and user
                  experience.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Your Rights
                </h4>
                <p className="text-sm text-gray-700">
                  You may request to update, correct, or delete your personal
                  data anytime.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Us</h4>
                <div className="flex items-center text-sm text-gray-700">
                  <Mail className="h-4 w-4 mr-2" />
                  support@yourbrand.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
