"use client"
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchDishes } from './_components/api'
import { IDish, MealType } from './_components/types'
import Header from './_components/Header'
import CategoriesSection from './_components/CategoriesSection'
import DishesSection from './_components/DishesSection'
import NearbyKitchens from './_components/NearbyKitchens'
import SubscriptionsSection from './_components/SubscriptionsSection'
import BottomNavigation from './_components/BottomNavigation'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [pincode, setPincode] = useState<string>('')

  // Fetch all dishes
  const { data: allDishes = [], isLoading: isDishesLoading, error: dishesError } = useQuery({
    queryKey: ['dishes'],
    queryFn: () => fetchDishes(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })
  
  // Fetch dishes by category when category changes
  const { data: categoryDishes = [] } = useQuery({
    queryKey: ['dishes', activeCategory],
    queryFn: () => activeCategory === 'ALL' 
      ? Promise.resolve([]) 
      : fetchDishes({ mealType: activeCategory as MealType }),
    enabled: activeCategory !== 'ALL',
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  // Group dishes by meal type for displaying in sections
  const groupedDishes = React.useMemo(() => {
    return allDishes.reduce((acc, dish) => {
      if (!acc[dish.mealType]) {
        acc[dish.mealType] = []
      }
      acc[dish.mealType].push(dish)
      return acc
    }, {} as Record<MealType, IDish[]>)
  }, [allDishes])

  // Get the appropriate dishes based on active category
  const filteredDishes = activeCategory === 'ALL' ? allDishes : categoryDishes

  // Loading state
  if (isDishesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 pb-24">
        <Header pincode={pincode} setPincode={setPincode} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious meals...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  // Error state
  if (dishesError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 pb-24">
        <Header pincode={pincode} setPincode={setPincode} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load dishes {JSON.stringify(dishesError)}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-amber-500 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 pb-24">
      <Header pincode={pincode} setPincode={setPincode} />
      
      <CategoriesSection 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      
      <div className="space-y-8">
        {activeCategory === 'ALL' ? (
          <>
            {groupedDishes.BREAKFAST && groupedDishes.BREAKFAST.length > 0 && (
              <DishesSection dishes={groupedDishes.BREAKFAST} title="🌅 Breakfast Specials" />
            )}
            
            {groupedDishes.LUNCH && groupedDishes.LUNCH.length > 0 && (
              <DishesSection dishes={groupedDishes.LUNCH} title="🍽️ Lunch Favorites" />
            )}
            
            {groupedDishes.DINNER && groupedDishes.DINNER.length > 0 && (
              <DishesSection dishes={groupedDishes.DINNER} title="🌙 Dinner Delights" />
            )}
            
            {groupedDishes.SNACKS && groupedDishes.SNACKS.length > 0 && (
              <DishesSection dishes={groupedDishes.SNACKS} title="🍿 Quick Snacks" />
            )}
            
            {groupedDishes.DRINKS && groupedDishes.DRINKS.length > 0 && (
              <DishesSection dishes={groupedDishes.DRINKS} title="🥤 Refreshing Drinks" />
            )}
            
            <SubscriptionsSection />
            <NearbyKitchens pincode={pincode} />
          </>
        ) : (
          <>
            {filteredDishes.length > 0 ? (
              <DishesSection 
                dishes={filteredDishes} 
                title={`${activeCategory.charAt(0)}${activeCategory.slice(1).toLowerCase()} Items`} 
              />
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-600">No items found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  )
}