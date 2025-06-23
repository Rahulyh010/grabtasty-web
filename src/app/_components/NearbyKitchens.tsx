/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useQuery } from '@tanstack/react-query'

// Updated Kitchen type based on actual API response
interface Kitchen {
  _id: string
  name: string
  address: string
  pincodes: string[]
  adminName: string
  phone: string
  email: string
  lastLogin: string | null
  todaysMenu: {
    date: string
    dishes: string[]
    active: boolean
  }
  allDishes: string[]
  createdAt: string
  updatedAt: string
  banner?: string
  __v: number
}

interface KitchenCardProps {
  kitchen: Kitchen
}

const KitchenCard: React.FC<KitchenCardProps> = ({ kitchen }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={kitchen.banner || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?fm=jpg&q=60&w=800'} 
          alt={kitchen.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="font-bold text-xl text-white mb-2">{kitchen.name}</h3>
          <div className="flex flex-wrap gap-1">
            {kitchen.pincodes.map((pincode, idx) => (
              <span key={idx} className="text-xs bg-white/90 text-gray-800 px-2 py-1 rounded-lg font-medium">
                {pincode}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-colors">
          View Dishes
        </button>
      </div>
    </div>
  )
}

interface NearbyKitchensProps {
  pincode?: string
}

const NearbyKitchens: React.FC<NearbyKitchensProps> = ({ pincode }) => {
  const { data: kitchens = [], isLoading, error } = useQuery({
    queryKey: ['kitchens', pincode],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kitchen`)
      const data = await response.json()
      console.log(data, "kitchens")
      return data?.data?.kitchens || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })

  if (isLoading) {
    return (
      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Nearby Kitchens</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="bg-white rounded-2xl shadow-lg overflow-hidden h-72 animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-12 bg-gray-200 rounded"></div>
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Nearby Kitchens</h2>
        <div className="bg-red-100 p-4 rounded-xl text-red-700 text-center">
          <p className="mb-2">Unable to load kitchens. Please try again later.</p>
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

  return (
    <section className="px-4 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Nearby Kitchens</h2>
      {kitchens.length === 0 ? (
        <div className="bg-amber-50 p-4 rounded-xl text-amber-700 text-center">
          No kitchens found near you. Try a different pincode.
        </div>
      ) : (
        <div className="space-y-4">
          {kitchens.map((kitchen: Kitchen) => (
            <KitchenCard key={kitchen._id} kitchen={kitchen} />
          ))}
        </div>
      )}
    </section>
  )
}

export default NearbyKitchens