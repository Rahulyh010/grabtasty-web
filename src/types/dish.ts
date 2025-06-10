// types/dish.ts
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS' | 'DRINKS'
export type CuisineType =
  | 'NORTH_INDIAN'
  | 'SOUTH_INDIAN'
  | 'GUJARATI'
  | 'CHINESE'
  | 'ITALIAN'
  | 'MEXICAN'
  | 'OTHER'
export type FoodType = 'VEG' | 'EGG' | 'NON_VEG' | 'VEGAN' | 'JAIN'

export interface IDish {
  _id: string
  name: string
  cuisineType: CuisineType
  mealType: MealType
  calories?: number
  foodType: FoodType
  imageUrl: string
  price: number
  isSpicy?: boolean
  tags?: string[]
  description?: string
  rating?: {
    average: number
    totalRatings: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface DishesResponse {
  dishes: IDish[]
  total: number
  page: number
  limit: number
}

export interface RatingRequest {
  rating: number
}