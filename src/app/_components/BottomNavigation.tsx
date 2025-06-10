import React, { useState } from 'react'
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react'

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home')
  
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'cart', icon: ShoppingBag, label: 'Cart' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'profile', icon: User, label: 'Profile' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-2 px-4 flex items-center justify-between">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-colors ${
            activeTab === tab.id 
              ? 'text-amber-600 bg-amber-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <tab.icon className="w-6 h-6" />
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNavigation