import React from "react";
import Home from "./_components/home/Page";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FoodDelivery - Fresh Meals Delivered Fast | Order Online",
  description:
    "Order fresh, delicious meals from local kitchens. Fast delivery, breakfast, lunch, dinner & snacks. Free delivery on orders above ₹299. Download now!",

  keywords: [
    "food delivery",
    "online food order",
    "home delivery",
    "fresh meals",
    "breakfast delivery",
    "lunch delivery",
    "dinner delivery",
    "local kitchens",
    "food app",
    "meal delivery",
    "restaurant delivery",
    "quick delivery",
  ],

  authors: [{ name: "FoodDelivery Team" }],
  creator: "FoodDelivery",
  publisher: "FoodDelivery",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.bellysoul.in",
    siteName: "FoodDelivery",
    title: "FoodDelivery - Fresh Meals Delivered Fast",
    description:
      "Order fresh, delicious meals from local kitchens. Fast delivery across your city. Breakfast, lunch, dinner & snacks available.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodDelivery - Fresh Meals Delivered Fast",
        type: "image/jpeg",
      },
      {
        url: "/og-image-square.jpg",
        width: 1200,
        height: 1200,
        alt: "FoodDelivery App",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@fooddelivery",
    creator: "@fooddelivery",
    title: "FoodDelivery - Fresh Meals Delivered Fast",
    description:
      "Order fresh, delicious meals from local kitchens. Fast delivery, breakfast, lunch, dinner & snacks. Free delivery on orders above ₹299.",
    images: ["/twitter-image.jpg"],
  },

  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "facebook-domain-verification": "your-facebook-verification-code",
    },
  },

  alternates: {
    canonical: "https://www.bellysoul.in/",
    languages: {
      "en-IN": "https://www.bellysoul.in//en-in",
      "hi-IN": "https://www.bellysoul.in//hi-in",
    },
  },

  category: "food & dining",

  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "FoodDelivery",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#FBBF24",
    "theme-color": "#FBBF24",
  },

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-touch-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-touch-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-touch-icon-76x76.png", sizes: "76x76", type: "image/png" },
      {
        url: "/apple-touch-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/apple-touch-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/apple-touch-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    ],
  },
};

export default function page() {
  return (
    <div>
      <Home />
    </div>
  );
}
