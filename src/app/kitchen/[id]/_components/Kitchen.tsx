/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  MapPin, 
  ChefHat, 
  Utensils, 
  ArrowRight,
  Shield,
  Flame,
  Heart,
  Plus,
  Sparkles,
  Crown,
  Zap,
  Coffee,
  Sun,
  Moon,
  Soup,
  Pizza,
  Fish,
  Wheat,
  Leaf,
  Cherry,
  Apple,
  Beef,
  Salad
} from 'lucide-react'
import SubscriptionCard from './Card'

interface Dish {
  _id: string
  name: string
  cuisineType: string
  mealType: string
  foodType: string
  imageUrl: string
  price: number
  isSpicy?: boolean
  description?: string
  rating: {
    average: number
    totalRatings: number
  }
}

interface Kitchen {
  _id: string
  name: string
  address: string
  adminName: string
  phone: string
  banner?: string
  allDishes: Dish[]
}

interface Subscription {
  _id: string
  comboConfig: {
    name: string
    description: string
    mealTypes: string[]
    cuisineType: string
    foodType: string
    price: number
    discountPercentage?: number
    imageUrl?: string
  }
  duration: number
  status: string
}

interface KitchenData {
  kitchen: Kitchen
}

interface SubscriptionData {
  kitchenId: string
  totalSubscriptions: number
  subscriptions: Subscription[]
}

const fetchKitchen = async (kitchenId: string): Promise<{data:KitchenData}> => {
  const response = await fetch(`http://localhost:5000/api/kitchen/${kitchenId}`)
  if (!response.ok) throw new Error('Failed to fetch kitchen')
  return response.json()
}

const fetchSubscriptions = async (kitchenId: string): Promise<{data:SubscriptionData}> => {
  const response = await fetch(`http://localhost:5000/api/subscriptions/kitchen/${kitchenId}`)
  if (!response.ok) throw new Error('Failed to fetch subscriptions')
  return response.json()
}

// Cuisine icons mapping
const cuisineIcons = {
  'INDIAN': Soup,
  'CHINESE': Utensils, 
  'ITALIAN': Pizza,
  'MEXICAN': Cherry,
  'THAI': Soup,
  'JAPANESE': Fish,
  'MEDITERRANEAN': Apple,
  'AMERICAN': Beef,
  'FRENCH': Coffee,
  'KOREAN': Soup
}

const foodTypeIcons = {
  'VEG': Salad,
  'NON_VEG': Beef,
  'VEGAN': Leaf,
  'JAIN': Wheat
}

const mealTypeIcons = {
  'Breakfast': Coffee,
  'Lunch': Sun,
  'Dinner': Moon,
  'Snacks': Cherry
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50">
    <div className="relative h-80 overflow-hidden">
      <Skeleton className="w-full h-full rounded-none" />
    </div>
    <div className="px-4 py-8 space-y-6">
      <div className="grid gap-4 grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-3xl" />
        ))}
      </div>
    </div>
  </div>
)

interface KitchenPageProps {
  kitchenId: string
}

export default function KitchenPage({ kitchenId }: KitchenPageProps) {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('ALL')
  const [selectedFoodType, setSelectedFoodType] = useState<string>('ALL')
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set())

  const { data: kitchenData, isLoading: kitchenLoading } = useQuery({
    queryKey: ['kitchen', kitchenId],
    queryFn: () => fetchKitchen(kitchenId),
  })

  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscriptions', 'kitchen', kitchenId],
    queryFn: () => fetchSubscriptions(kitchenId),
  })

  if (kitchenLoading || subscriptionLoading) {
    return <LoadingSkeleton />
  }

  const kitchen = kitchenData?.data.kitchen
  const subscriptions = subscriptionData?.data?.subscriptions || []

  if (!kitchen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center p-8 animate-pulse">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <ChefHat className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Kitchen not found</h3>
          <p className="text-base text-gray-600">The kitchen you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Get unique cuisines and food types
  const uniqueCuisines = [...new Set(kitchen.allDishes.map(dish => dish.cuisineType))]
  const uniqueFoodTypes = [...new Set(kitchen.allDishes.map(dish => dish.foodType))]

  // Filter dishes
  const filteredDishes = kitchen.allDishes.filter(dish => {
    const cuisineMatch = selectedCuisine === 'ALL' || dish.cuisineType === selectedCuisine
    const foodTypeMatch = selectedFoodType === 'ALL' || dish.foodType === selectedFoodType
    return cuisineMatch && foodTypeMatch
  })

  // Group filtered dishes by meal type
  const dishesByMealType = filteredDishes.reduce((acc, dish) => {
    if (!acc[dish.mealType]) acc[dish.mealType] = []
    acc[dish.mealType].push(dish)
    return acc
  }, {} as Record<string, Dish[]>)

  const getSubscriptionGradient = (index: number) => {
    const gradients = [
      'from-violet-500 via-purple-500 to-pink-500',
      'from-blue-500 via-indigo-500 to-purple-500', 
      'from-emerald-500 via-teal-500 to-cyan-500',
      'from-orange-500 via-red-500 to-pink-500',
      'from-yellow-400 via-orange-500 to-red-500',
      'from-green-400 via-blue-500 to-purple-600'
    ]
    return gradients[index % gradients.length]
  }

  const toggleFavorite = (dishId: string) => {
    const newFavorites = new Set(favoriteItems)
    if (newFavorites.has(dishId)) {
      newFavorites.delete(dishId)
    } else {
      newFavorites.add(dishId)
    }
    setFavoriteItems(newFavorites)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50">
      {/* Elegant Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={kitchen.banner || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1400&h=400&fit=crop'}
          alt={kitchen.name}
          className="w-full h-full object-cover scale-110 hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Floating Kitchen Stats */}
        <div className="absolute top-6 right-4 flex gap-3">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{kitchen.allDishes.length}</div>
              <div className="text-xs text-white/80">Dishes</div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{subscriptions.length}</div>
              <div className="text-xs text-white/80">Plans</div>
            </div>
          </div>
        </div>

        {/* Elegant Kitchen Title */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">Live Kitchen</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              {kitchen.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-white/90">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{kitchen.address.split(',')[0]}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <ChefHat className="h-4 w-4" />
                <span className="text-sm font-medium">Chef {kitchen.adminName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 space-y-12">
        
        {/* Subscription Plans Carousel */}
        <section className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Crown className="h-4 w-4" />
              Premium Plans
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose Your Experience</h2>
            <p className="text-gray-600">Curated meal plans crafted with love</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {subscriptions.map((subscription, index) => (
              <SubscriptionCard index={index} key={subscription._id} subscription={subscription}/>
              // <Card key={subscription._id} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white">
              //   {/* Animated Background */}
              //   <div className={`absolute inset-0 bg-gradient-to-br ${getSubscriptionGradient(index)} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
              //   {/* Discount Badge */}
              //   {subscription.comboConfig.discountPercentage && (
              //     <div className="absolute top-4 right-4 z-10">
              //       <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-bounce">
              //         <Zap className="h-3 w-3" />
              //         {subscription.comboConfig.discountPercentage}% OFF
              //       </div>
              //     </div>
              //   )}

              //   <CardContent className="p-6 space-y-6 relative z-10">
              //     {/* Header */}
              //     <div className="text-center space-y-3">
              //       <div className={`w-16 h-16 bg-gradient-to-br ${getSubscriptionGradient(index)} rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3 group-hover:rotate-6 transition-transform duration-300`}>
              //         <Crown className="h-8 w-8 text-white" />
              //       </div>
              //       <h3 className="text-xl font-bold text-gray-900">
              //         {subscription.comboConfig.name}
              //       </h3>
              //       <p className="text-sm text-gray-600 leading-relaxed">
              //         {subscription.comboConfig.description}
              //       </p>
              //     </div>

              //     {/* Price */}
              //     <div className="text-center py-4 bg-gray-50 rounded-2xl">
              //       <div className="text-3xl font-bold text-gray-900">
              //         ₹{subscription.comboConfig.price}
              //       </div>
              //       <div className="text-sm text-gray-500">
              //         ₹{Math.round(subscription.comboConfig.price / subscription.duration)}/day • {subscription.duration} days
              //       </div>
              //     </div>

              //     {/* Features */}
              //     <div className="space-y-3">
              //       {subscription.comboConfig.mealTypes.map((meal, mealIndex) => {
              //         const MealIcon = mealTypeIcons[meal as keyof typeof mealTypeIcons] || Utensils
              //         return (
              //           <div key={meal} className="flex items-center gap-3 group/feature hover:bg-gray-50 p-2 rounded-lg transition-colors">
              //             <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getSubscriptionGradient(index)} flex items-center justify-center flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-200`}>
              //               <MealIcon className="h-4 w-4 text-white" />
              //             </div>
              //             <span className="text-sm text-gray-700 font-medium">{meal}</span>
              //           </div>
              //         )
              //       })}
                    
              //       <div className="flex items-center gap-3 group/feature hover:bg-gray-50 p-2 rounded-lg transition-colors">
              //         <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getSubscriptionGradient(index)} flex items-center justify-center flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-200`}>
              //           <Sparkles className="h-4 w-4 text-white" />
              //         </div>
              //         <span className="text-sm text-gray-700 font-medium">
              //           {subscription.comboConfig.cuisineType.replace('_', ' ')} Cuisine
              //         </span>
              //       </div>

              //       <div className="flex items-center gap-3 group/feature hover:bg-gray-50 p-2 rounded-lg transition-colors">
              //         <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getSubscriptionGradient(index)} flex items-center justify-center flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-200`}>
              //           <Shield className="h-4 w-4 text-white" />
              //         </div>
              //         <span className="text-sm text-gray-700 font-medium">Fresh Daily Delivery</span>
              //       </div>
              //     </div>

              //     {/* CTA Button */}
              //     <Button className={`w-full bg-gradient-to-r ${getSubscriptionGradient(index)} hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-white font-semibold py-3 rounded-2xl relative overflow-hidden group/btn`}>
              //       <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              //       <span className="relative flex items-center justify-center gap-2">
              //         Subscribe Now
              //         <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              //       </span>
              //     </Button>
              //   </CardContent>
              // </Card>
            ))}
          </div>
        </section>

        {/* Elegant Filter Section */}
        <section className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Utensils className="h-4 w-4" />
              Our Menu
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Delicious Creations</h2>
            <p className="text-gray-600">Discover {filteredDishes.length} amazing dishes</p>
          </div>

          {/* Beautiful Filter Chips */}
          <div className="space-y-4">
            {/* Cuisine Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Cuisine Types
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCuisine('ALL')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                    selectedCuisine === 'ALL'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-violet-300'
                  }`}
                >
                  <Utensils className="h-4 w-4" />
                  All Cuisines
                </button>
                {uniqueCuisines.map(cuisine => {
                  const CuisineIcon = cuisineIcons[cuisine as keyof typeof cuisineIcons] || Utensils
                  return (
                    <button
                      key={cuisine}
                      onClick={() => setSelectedCuisine(cuisine)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                        selectedCuisine === cuisine
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-violet-300'
                      }`}
                    >
                      <CuisineIcon className="h-4 w-4" />
                      {cuisine.replace('_', ' ')}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Food Type Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-500" />
                Food Types
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedFoodType('ALL')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                    selectedFoodType === 'ALL'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Salad className="h-4 w-4" />
                  All Types
                </button>
                {uniqueFoodTypes.map(foodType => {
                  const FoodIcon = foodTypeIcons[foodType as keyof typeof foodTypeIcons] || Salad
                  return (
                    <button
                      key={foodType}
                      onClick={() => setSelectedFoodType(foodType)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                        selectedFoodType === foodType
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <FoodIcon className="h-4 w-4" />
                      {foodType}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Menu Tabs */}
          {Object.keys(dishesByMealType).length > 0 ? (
            <Tabs defaultValue={Object.keys(dishesByMealType)[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-gray-100 rounded-2xl mb-8">
                {Object.keys(dishesByMealType).map((mealType) => {
                  const MealIcon = mealTypeIcons[mealType as keyof typeof mealTypeIcons] || Utensils
                  return (
                    <TabsTrigger 
                      key={mealType} 
                      value={mealType}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl py-3 px-4 font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      <MealIcon className="h-4 w-4" />
                      <span className="hidden sm:block">{mealType}</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {dishesByMealType[mealType].length}
                      </Badge>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {Object.entries(dishesByMealType).map(([mealType, dishes]) => (
                <TabsContent key={mealType} value={mealType} className="space-y-4">
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {dishes.map((dish, index) => (
                      <Card key={dish._id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden border-0 shadow-lg bg-white">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Floating Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge 
                              variant={dish.foodType === 'VEG' ? 'default' : 'destructive'} 
                              className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white font-semibold text-xs border-0 shadow-lg"
                            >
                              {dish.foodType === 'VEG' ? <Leaf className="h-3 w-3 mr-1" /> : <Beef className="h-3 w-3 mr-1" />}
                              {dish.foodType}
                            </Badge>
                          </div>
                          
                          {/* Spicy Badge */}
                          {dish.isSpicy && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-red-500/90 backdrop-blur-sm text-white font-semibold text-xs border-0 shadow-lg">
                                <Flame className="h-3 w-3 mr-1" />
                                Spicy
                              </Badge>
                            </div>
                          )}

                          {/* Rating */}
                          {dish.rating.totalRatings > 0 && (
                            <div className="absolute bottom-3 right-3">
                              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold">{dish.rating.average.toFixed(1)}</span>
                              </div>
                            </div>
                          )}

                          {/* Favorite Button */}
                          <button
                            onClick={() => toggleFavorite(dish._id)}
                            className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200"
                          >
                            <Heart className={`h-4 w-4 transition-colors duration-200 ${favoriteItems.has(dish._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                          </button>
                        </div>
                        
                        <CardContent className="p-4 space-y-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-1 mb-1">
                              {dish.name}
                            </h4>
                            {dish.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">{dish.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-gray-900">₹{dish.price}</div>
                            <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-white font-semibold rounded-full px-6 relative overflow-hidden group/btn">
                              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                              <span className="relative flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add
                              </span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}       
            </Tabs>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-12 w-12 text-gray-400" />
              </div>
              <div className="text-gray-500 text-lg font-medium">No dishes found for selected filters</div>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters to see more options</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}