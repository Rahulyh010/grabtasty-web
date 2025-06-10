/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDish, Kitchen, Subscription, MealType } from './types'

// Base API URL - replace with your actual API endpoint
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000') + '/api'

// API error handling
class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new ApiError(
        `API Error: ${response.status} ${response.statusText}`,
        response.status
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error or invalid response', 500)
  }
}

// Fetch all dishes or filter by meal type
export async function fetchDishes(filters?: { mealType?: MealType }): Promise<IDish[]> {
  try {
    let endpoint = '/dishes'
    
    if (filters?.mealType) {
      const params = new URLSearchParams({ mealType: filters.mealType })
      endpoint += `?${params.toString()}`
    }

    const response = await apiFetch<{ success: boolean; data: { dishes: IDish[] } }>(endpoint)
    
    // if (!response.success || !Array.isArray(response.data?.data?.dishes)) {
    //   throw new ApiError('Invalid response format', 500)
    // }

    return response.data?.dishes
  } catch (error) {
    console.error('Error fetching dishes:', error)
    throw error
  }
}

// Fetch nearby kitchens based on pincode
export async function fetchKitchens(pincode?: string): Promise<Kitchen[]> {
  try {
    let endpoint = '/kitchen'
    
    if (pincode) {
      const params = new URLSearchParams({ pincode })
      endpoint += `?${params.toString()}`
    }

    const response = await apiFetch<{ success: boolean; data: {kitchens : Kitchen[]}  }>(endpoint)
    console.log(response.data,"response")
    if (!response.success) {
      throw new ApiError('Invalid response format', 500)
    }

    return response.data?.kitchens
  } catch (error) {
    console.error('Error fetching kitchens:', error)
    throw error
  }
}

// Fetch available subscriptions
export async function fetchSubscriptions(): Promise<Subscription[]> {
  try {
    const response = await apiFetch<{ success: boolean; data: Subscription[] }>('/subscriptions')
    
    if (!response.success || !Array.isArray(response.data)) {
      throw new ApiError('Invalid response format', 500)
    }

    return response.data
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    throw error
  }
}

// Fetch single dish by ID
export async function fetchDishById(dishId: string): Promise<IDish> {
  try {
    const response = await apiFetch<{ success: boolean; data: IDish }>(`/dishes/${dishId}`)
    
    if (!response.success || !response.data) {
      throw new ApiError('Invalid response format', 500)
    }

    return response.data
  } catch (error) {
    console.error('Error fetching dish:', error)
    throw error
  }
}

// Search dishes by query
export async function searchDishes(query: string): Promise<IDish[]> {
  try {
    const params = new URLSearchParams({ q: query })
    const response = await apiFetch<{ success: boolean; data: IDish[] }>(`/dishes/search?${params.toString()}`)
    
    if (!response.success || !Array.isArray(response.data)) {
      throw new ApiError('Invalid response format', 500)
    }

    return response.data
  } catch (error) {
    console.error('Error searching dishes:', error)
    throw error
  }
}

// Add item to cart
export async function addToCart(dishId: string, quantity: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch<{ success: boolean; message: string }>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ dishId, quantity }),
    })

    return response
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

// Update cart item quantity
export async function updateCartItem(dishId: string, quantity: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch<{ success: boolean; message: string }>('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ dishId, quantity }),
    })

    return response
  } catch (error) {
    console.error('Error updating cart:', error)
    throw error
  }
}

// Remove item from cart
export async function removeFromCart(dishId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch<{ success: boolean; message: string }>('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ dishId }),
    })

    return response
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

// Get cart items
export async function getCartItems(): Promise<any[]> {
  try {
    const response = await apiFetch<{ success: boolean; data: any[] }>('/cart')
    
    if (!response.success || !Array.isArray(response.data)) {
      throw new ApiError('Invalid response format', 500)
    }

    return response.data
  } catch (error) {
    console.error('Error fetching cart:', error)
    throw error
  }
}