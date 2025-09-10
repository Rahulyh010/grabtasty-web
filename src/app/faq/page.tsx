"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Pause,
  Utensils,
  XCircle,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
      question: "How does the subscription work?",
      answer:
        "Choose a meal plan, pay online, and enjoy daily delivery for your chosen duration. Plans auto-renew unless canceled.",
      category: "General",
    },
    {
      id: 2,
      icon: <MapPin className="h-5 w-5 text-green-600" />,
      question: "Can I change my delivery address or timing?",
      answer:
        "Yes, you can update your address or timing at least 24 hours before delivery through your account dashboard.",
      category: "Delivery",
    },
    {
      id: 3,
      icon: <Pause className="h-5 w-5 text-orange-600" />,
      question: "Can I pause my subscription?",
      answer:
        "Yes, you can pause for up to [X] days per month by notifying us 24 hours in advance through your account or customer support.",
      category: "Subscription",
    },
    {
      id: 4,
      icon: <Utensils className="h-5 w-5 text-purple-600" />,
      question: "What if I have dietary restrictions?",
      answer:
        "You can customize your meal plan when subscribing. We also label all meals clearly with ingredients and allergen information.",
      category: "Meals",
    },
    {
      id: 5,
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      question: "How do I cancel my subscription?",
      answer:
        "Cancel anytime from your account dashboard or by contacting support. Refunds are issued as per our refund policy.",
      category: "Subscription",
    },
    {
      id: 6,
      icon: <Calendar className="h-5 w-5 text-indigo-600" />,
      question: "Do you deliver on weekends and holidays?",
      answer:
        "We deliver on weekends, but delivery schedules may change during major holidays (notified in advance).",
      category: "Delivery",
    },
    {
      id: 7,
      icon: <Phone className="h-5 w-5 text-teal-600" />,
      question: "How do I contact support?",
      answer:
        "Reach us at support@yourbrand.com or call [Phone Number]. Our support team is available to help with any questions.",
      category: "Support",
    },
  ];

  const toggleFAQ = (id: number) => {
    // @ts-expect-error err
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-8 w-8 text-indigo-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Quick answers to common questions about our food subscription
            service.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Got Questions? We've Got Answers!
            </h2>
            <p className="text-lg opacity-90">
              Find answers to the most common questions about our monthly food
              subscription service.
            </p>
          </div>

          {/* Category Pills */}
          <div className="p-6 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Browse by category:
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-600 border shadow-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">{faq.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {openFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </button>

              {openFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <div className="pl-9">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-indigo-400">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-lg opacity-90 mb-6">
              Our friendly support team is here to help you with any additional
              questions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
                <Mail className="h-5 w-5" />
                <span className="font-medium">support@yourbrand.com</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
                <Phone className="h-5 w-5" />
                <span className="font-medium">[Phone Number]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            💡 Quick Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Plan Ahead</h4>
                <p className="text-sm text-gray-600">
                  Make changes to your subscription at least 24 hours before
                  your next delivery.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Utensils className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Customize Your Meals
                </h4>
                <p className="text-sm text-gray-600">
                  Update your dietary preferences anytime in your account
                  settings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Delivery Address
                </h4>
                <p className="text-sm text-gray-600">
                  Keep your delivery address updated to ensure smooth
                  deliveries.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Pause className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Pause Anytime
                </h4>
                <p className="text-sm text-gray-600">
                  Going on vacation? Pause your subscription temporarily instead
                  of canceling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-2 text-sm">
            These FAQs are updated regularly to reflect the most current
            information about our service.
          </p>
        </div>
      </div>
    </div>
  );
}
