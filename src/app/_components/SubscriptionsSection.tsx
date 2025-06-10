import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Crown } from 'lucide-react'
import { fetchSubscriptions } from './api'
import { Subscription } from './types'

interface SubscriptionCardProps {
  subscription: Subscription
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
      subscription.isPopular ? 'ring-2 ring-amber-400' : ''
    }`}>
      {subscription.isPopular && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-center py-2">
          <Crown size={16} className="inline mr-2" />
          <span className="font-semibold text-sm">Most Popular</span>
        </div>
      )}
      
      <div className="relative h-40">
        <img 
          src={subscription.imageUrl} 
          alt={subscription.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-xl text-gray-800 mb-2">{subscription.name}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {subscription.description}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-3xl font-bold text-green-600">₹{subscription.price}</span>
            <span className="text-gray-500 text-sm">/{subscription.duration}</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{subscription.meals} meals</p>
            <p className="text-xs text-gray-400">included</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {subscription.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{benefit}</span>
            </div>
          ))}
        </div>
        
        <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-colors">
          Subscribe Now
        </button>
      </div>
    </div>
  )
}

const SubscriptionsSection: React.FC = () => {
  const { data: subscriptions = [], isLoading, error } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => fetchSubscriptions(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  })

  if (isLoading) {
    return (
      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Meal Subscriptions</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="bg-white rounded-2xl shadow-lg overflow-hidden h-80 animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-5 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Meal Subscriptions</h2>
        <div className="bg-red-100 p-4 rounded-xl text-red-700 text-center">
          <p className="mb-2">Unable to load subscriptions. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Meal Subscriptions</h2>
        <div className="bg-amber-50 p-4 rounded-xl text-amber-700 text-center">
          No subscriptions available at the moment.
        </div>
      </div>
    )
  }

  return (
    <section className="px-4 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Meal Subscriptions</h2>
      <div className="space-y-6">
        {subscriptions.map((subscription) => (
          <SubscriptionCard key={subscription._id} subscription={subscription} />
        ))}
      </div>
    </section>
  )
}

export default SubscriptionsSection