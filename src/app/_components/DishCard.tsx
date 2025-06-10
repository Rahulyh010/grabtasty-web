import React, { useState } from 'react'
import { Star, Timer, Flame, Plus, Minus } from 'lucide-react'
import { IDish, FoodType } from './types'

interface FoodTypeBadgeProps {
  foodType: FoodType
}

const FoodTypeBadge: React.FC<FoodTypeBadgeProps> = ({ foodType }) => {
  const getFoodTypeStyle = (type: FoodType) => {
    switch (type) {
      case 'VEG': return 'bg-green-500 text-white'
      case 'NON_VEG': return 'bg-red-500 text-white'
      case 'EGG': return 'bg-yellow-500 text-white'
      case 'VEGAN': return 'bg-green-600 text-white'
      case 'JAIN': return 'bg-orange-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <span className={`absolute top-3 left-3 ${getFoodTypeStyle(foodType)} text-xs px-3 py-1 rounded-full font-semibold shadow-lg`}>
      {foodType.replace('_', ' ')}
    </span>
  )
}

interface DishCardProps {
  dish: IDish
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const [quantity, setQuantity] = useState(0)

  const handleAddToCart = () => {
    setQuantity(1)
  }

  const handleIncrement = () => {
    setQuantity(prev => prev + 1)
  }

  const handleDecrement = () => {
    setQuantity(prev => Math.max(0, prev - 1))
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <FoodTypeBadge foodType={dish.foodType} />
        {dish.isSpicy && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
            <Flame size={12} className="inline mr-1" />
            Spicy
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{dish.name}</h3>
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
            <Star className="fill-amber-400 text-amber-400" size={14} />
            <span className="text-sm font-semibold text-gray-700">
              {dish.rating?.average?.toFixed(1) || '4.0'}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {dish.description}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-gray-500">
            <Timer size={14} />
            <span className="text-sm">25-30 min</span>
          </div>
          {dish.calories && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
              {dish.calories} cal
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* <span className="text-2xl font-bold text-green-600">₹{dish.price}</span> */}
          
          {/* {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-colors"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl px-3 py-2 shadow-lg">
              <button
                onClick={handleDecrement}
                className="text-white bg-white/20 rounded-lg p-1 hover:bg-white/30 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-white text-lg font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="text-white bg-white/20 rounded-lg p-1 hover:bg-white/30 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default DishCard