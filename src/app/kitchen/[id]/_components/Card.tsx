'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Crown, 
  Zap, 
  ArrowRight, 
  Utensils, 
  Coffee, 
  Sun, 
  Moon, 
  Cookie, 
  Sparkles,
  Shield
} from 'lucide-react'

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
  }
  duration: number
  status: string
}

interface SubscriptionCardProps {
  subscription: Subscription
  index: number
}

const mealTypeIcons = {
  BREAKFAST: Coffee,
  LUNCH: Sun,
  DINNER: Moon,
  SNACKS: Cookie,
  DRINKS: Utensils,
}

const getSubscriptionGradient = (index: number) => {
  const gradients = [
    'from-violet-500 to-pink-500',
    'from-blue-500 to-cyan-500', 
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-rose-500 to-pink-500'
  ]
  return gradients[index % gradients.length]
}

export default function SubscriptionCard({ subscription, index }: SubscriptionCardProps) {
  const router = useRouter()

  const handleSubscribe = () => {
    router.push(`/checkout/${subscription._id}`)
  }

  return (
    <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white">
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getSubscriptionGradient(index)} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Discount Badge */}
      {subscription.comboConfig.discountPercentage && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-bounce">
            <Zap className="h-3 w-3" />
            {subscription.comboConfig.discountPercentage}% OFF
          </div>
        </div>
      )}

      <CardContent className="p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className={`w-16 h-16 bg-gradient-to-br ${getSubscriptionGradient(index)} rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3 group-hover:rotate-6 transition-transform duration-300`}>
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {subscription.comboConfig.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {subscription.comboConfig.description}
          </p>
        </div>

        {/* Price */}
        <div className="text-center py-4 bg-gray-50 rounded-2xl">
          <div className="text-3xl font-bold text-gray-900">
            ₹{subscription.comboConfig.price}
          </div>
          <div className="text-sm text-gray-500">
            ₹{Math.round(subscription.comboConfig.price / subscription.duration)}/day • {subscription.duration} days
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {subscription.comboConfig.mealTypes.map((meal) => {
            const MealIcon = mealTypeIcons[meal as keyof typeof mealTypeIcons] || Utensils
            return (
              <div key={meal} className="flex items-center gap-3 group/feature hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getSubscriptionGradient(index)} flex items-center justify-center flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-200`}>
                  <MealIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{meal}</span>
              </div>
            )
          })}
          
          <div className="flex items-center gap-3 group/feature hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getSubscriptionGradient(index)} flex items-center justify-center flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-200`}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {subscription.comboConfig.cuisineType.replace('_', ' ')} Cuisine
            </span>
          </div>

          <div className="flex items-center gap-3 group/feature hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getSubscriptionGradient(index)} flex items-center justify-center flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-200`}>
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-gray-700 font-medium">Fresh Daily Delivery</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleSubscribe}
          className={`w-full bg-gradient-to-r ${getSubscriptionGradient(index)} hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-white font-semibold py-3 rounded-2xl relative overflow-hidden group/btn`}
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          <span className="relative flex items-center justify-center gap-2">
            Subscribe Now
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}