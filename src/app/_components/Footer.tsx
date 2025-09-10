"use client";
import React from "react";
import {
  Home,
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  HelpCircle,
  Heart,
  ChefHat,
  Package,
  Search,
  UserPlus,
  LogIn,
  Calendar,
  Shield,
  FileText,
  RotateCcw,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

export default function Footer() {
  const footerSections = {
    Account: [
      { name: "Sign In", link: "/signin", icon: LogIn },
      { name: "Sign Up", link: "/signup", icon: UserPlus },
      { name: "Profile", link: "/profile", icon: User },
      { name: "Verify Email", link: "/verify-email", icon: Mail },
    ],
    Shopping: [
      { name: "Home", link: "/", icon: Home },
      { name: "Kitchen", link: "/kitchen", icon: ChefHat },
      { name: "Cart", link: "/cart", icon: ShoppingBag },
      { name: "Checkout", link: "/checkout", icon: CreditCard },
      { name: "Favourites", link: "/favourites", icon: Heart },
      { name: "Search", link: "/search", icon: Search },
    ],
    "Orders & Subscriptions": [
      { name: "Orders", link: "/orders", icon: Package },
      { name: "Subscriptions", link: "/subscriptions", icon: Calendar },
      {
        name: "Order Confirmation",
        link: "/order-confirmation",
        icon: Package,
      },
      { name: "Address", link: "/address", icon: MapPin },
    ],
    "Support & Legal": [
      { name: "FAQ", link: "/faq", icon: HelpCircle },
      { name: "Privacy Policy", link: "/privacy-policy", icon: Shield },
      {
        name: "Terms & Conditions",
        link: "/terms-and-conditions",
        icon: FileText,
      },
      {
        name: "Return & Refund Policy",
        link: "/return-and-refund-policy",
        icon: RotateCcw,
      },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section - Brand & Newsletter */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <ChefHat className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">FoodSubscribe</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Delivering fresh, delicious meals to your doorstep every day.
              Experience the convenience of healthy eating with our premium food
              subscription service.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, color: "hover:text-blue-500" },
                { icon: Twitter, color: "hover:text-sky-400" },
                { icon: Instagram, color: "hover:text-pink-500" },
                { icon: Youtube, color: "hover:text-red-500" },
              ].map((social, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 transition-colors ${social.color} hover:bg-gray-600`}
                >
                  <social.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Stay Updated!</h3>
              <p className="text-orange-100 mb-6">
                Subscribe to our newsletter for exclusive offers, new menu
                items, and cooking tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerSections).map(([sectionTitle, links]) => (
            <div key={sectionTitle}>
              <h4 className="text-lg font-semibold mb-6 text-white border-b border-gray-700 pb-2">
                {sectionTitle}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.link}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group"
                    >
                      <link.icon className="h-4 w-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
                      <span className="hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800/50 rounded-xl p-8 mb-8">
          <h4 className="text-xl font-semibold mb-6 text-center">
            Get In Touch
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-medium">Phone</p>
              <p className="text-gray-300 text-sm">[Phone Number]</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium">Email</p>
              <p className="text-gray-300 text-sm">support@yourbrand.com</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <p className="font-medium">Address</p>
              <p className="text-gray-300 text-sm">Your Business Address</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>
                &copy; {new Date().getFullYear()} FoodSubscribe. All rights
                reserved.
              </p>
            </div>

            <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
              <a
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="/terms-and-conditions"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <span>•</span>
              <a
                href="/return-and-refund-policy"
                className="hover:text-white transition-colors"
              >
                Refund Policy
              </a>
              <span>•</span>
              <a href="/faq" className="hover:text-white transition-colors">
                FAQ
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Made with ❤️ for food lovers everywhere • Fresh meals delivered
              daily
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
