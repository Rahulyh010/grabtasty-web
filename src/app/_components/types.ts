// Food Types
export type FoodType = 'VEG' | 'NON_VEG' | 'EGG' | 'VEGAN' | 'JAIN'

// Meal Types
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS' | 'DRINKS'

// Rating interface
export interface Rating {
  average: number
  count?: number
}

// Dish interface
export interface IDish {
  _id: string
  name: string
  description: string
  price: number
  imageUrl: string
  rating?: Rating
  foodType: FoodType
  mealType: MealType
  isSpicy?: boolean
  calories?: number
  ingredients?: string[]
  preparationTime?: number
  kitchenId?: string
  isAvailable?: boolean
  discount?: {
    percentage: number
    validUntil: string
  }
}

// Kitchen interface
export interface Kitchen {
  _id: string
  name: string
  imageUrl: string
  rating: number
  cuisines: string[]
  deliveryTime: string
  distance: string
  deliveryFee: number
  isOpen: boolean
  address?: {
    street: string
    city: string
    pincode: string
    state: string
  }
  openHours?: {
    open: string
    close: string
  }
  minOrderAmount?: number
  acceptsOnlinePayment?: boolean
}

// Subscription interface
export interface Subscription {
  _id: string
  name: string
  description: string
  price: number
  duration: string
  meals: number
  imageUrl: string
  benefits: string[]
  isPopular?: boolean
  category?: 'WEEKLY' | 'MONTHLY' | 'CUSTOM'
  validityDays?: number
  termsAndConditions?: string[]
}

// Cart Item interface
export interface CartItem {
  dishId: string
  dish: IDish
  quantity: number
  totalPrice: number
  addedAt: string
}

// Cart interface
export interface Cart {
  _id: string
  userId?: string
  items: CartItem[]
  totalItems: number
  totalAmount: number
  deliveryFee: number
  taxes: number
  grandTotal: number
  lastUpdated: string
}

// Order Status
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

// Order interface
export interface Order {
  _id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  deliveryFee: number
  taxes: number
  grandTotal: number
  status: OrderStatus
  deliveryAddress: {
    street: string
    city: string
    pincode: string
    state: string
    landmark?: string
  }
  paymentMethod: 'CASH' | 'ONLINE' | 'CARD'
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED'
  estimatedDeliveryTime: string
  createdAt: string
  updatedAt: string
}

// User interface
export interface User {
  _id: string
  name: string
  email: string
  phone: string
  addresses: {
    _id: string
    type: 'HOME' | 'WORK' | 'OTHER'
    street: string
    city: string
    pincode: string
    state: string
    landmark?: string
    isDefault: boolean
  }[]
  preferences: {
    foodType: FoodType[]
    cuisines: string[]
    spicyLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  }
  createdAt: string
  lastLogin: string
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Pagination interface
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// API Response with pagination
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination
}

// Search filters
export interface DishFilters {
  mealType?: MealType
  foodType?: FoodType
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  isSpicy?: boolean
  kitchenId?: string
  sortBy?: 'price' | 'rating' | 'popularity' | 'name'
  sortOrder?: 'asc' | 'desc'
}

// Kitchen filters
export interface KitchenFilters {
  pincode?: string
  cuisine?: string
  rating?: number
  deliveryTime?: number
  isOpen?: boolean
  sortBy?: 'rating' | 'deliveryTime' | 'deliveryFee' | 'distance'
  sortOrder?: 'asc' | 'desc'
}

// Error types
export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}