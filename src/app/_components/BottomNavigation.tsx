import React, { useState } from "react";
import { Home, Search, ShoppingBag, User, Map } from "lucide-react";
import { useRouter } from "next/navigation";

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();

  const tabs = [
    { id: "home", icon: Home, label: "Home", link: "/" },
    { id: "search", icon: Search, label: "Search", link: "/search" },
    { id: "cart", icon: ShoppingBag, label: "Cart", link: "/cart" },
    { id: "favorites", icon: Map, label: "Address", link: "/address" },
    { id: "profile", icon: User, label: "Profile", link: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-2 px-4 flex items-center justify-between">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            router.push(tab.link);
          }}
          className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-colors ${
            activeTab === tab.id
              ? "text-amber-600 bg-amber-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <tab.icon className="w-6 h-6" />
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
