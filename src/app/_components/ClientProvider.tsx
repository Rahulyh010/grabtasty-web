'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  emailVerified: boolean
  phoneVerified: boolean
}

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = ['/signin', '/signup', '/verify-email', '/forgot-password']
  
  // Routes that require authentication
  const protectedRoutes = ['/', '/dashboard', '/profile', '/orders', '/subscription']
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )



  // Clear authentication data
  const clearAuth = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('emailVerificationToken')
    setUser(null)
  }

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')

        if (!storedUser || !storedToken) {
          // No auth data found
          setUser(null)
          setIsLoading(false)
          
          // Redirect to signin if trying to access protected route
          if (isProtectedRoute && !isPublicRoute) {
            router.push('/signin')
          }
          return
        }

        const parsedUser: User = JSON.parse(storedUser)
        
        // User is authenticated
        setUser(parsedUser)
        setIsLoading(false)

        // Handle routing based on auth state
        if (isPublicRoute && pathname !== '/verify-email') {
          // User is logged in but on public route (except verify-email)
          if (!parsedUser.emailVerified) {
            // Email not verified, redirect to verification
            router.push('/verify-email')
          } else {
            // Email verified, redirect to home
            router.push('/')
          }
        } else if (isProtectedRoute && !parsedUser.emailVerified) {
          // User trying to access protected route but email not verified
          router.push('/verify-email')
        }

      } catch (error) {
        console.error('Auth check error:', error)
        clearAuth()
        setIsLoading(false)
        
        if (isProtectedRoute && !isPublicRoute) {
          router.push('/signin')
        }
      }
    }

    checkAuth()
  }, [pathname, router, isProtectedRoute, isPublicRoute])

  // Listen for storage changes (for logout from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'token') {
        if (!e.newValue) {
          // Auth data was removed, clear local state
          setUser(null)
          if (isProtectedRoute && !isPublicRoute) {
            router.push('/signin')
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [router, isProtectedRoute, isPublicRoute])

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}