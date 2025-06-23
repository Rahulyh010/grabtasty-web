/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { Utensils, Coffee, Cookie, Wine, ChefHat } from 'lucide-react'

interface CategoryCardProps {
  icon: React.ReactNode
  title: string
  isActive?: boolean
  onClick: () => void
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-2xl transition-all min-w-[85px] shadow-lg hover:shadow-xl ${
        isActive 
          ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-200' 
          : 'bg-white text-gray-600'
      }`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-semibold">{title}</span>
    </button>
  )
}

interface CategoriesSectionProps {
  activeCategory: string
  setActiveCategory: (category: string) => void
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  activeCategory, 
  setActiveCategory 
}) => {
  const categories = [
    { id: 'ALL', icon: <Utensils size={22} />, title: 'All' },
    { id: 'BREAKFAST', icon: <Coffee size={22} />, title: 'Breakfast' },
    { id: 'LUNCH', icon: <Utensils size={22} />, title: 'Lunch' },
    { id: 'DINNER', icon: <ChefHat size={22} />, title: 'Dinner' },
    { id: 'SNACKS', icon: <Cookie size={22} />, title: 'Snacks' },
    { id: 'DRINKS', icon: <Wine size={22} />, title: 'Drinks' }
  ]

  return (
    <section className="px-4 py-6 bg-gradient-to-b from-orange-50 to-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">What's on your mind?</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            icon={category.icon}
            title={category.title}
            isActive={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default CategoriesSection