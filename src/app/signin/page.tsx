'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  LogIn, 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle,
  Eye,
  EyeOff,
  Chrome,
  ArrowRight,
  Leaf,
  Shield
} from 'lucide-react'

interface SigninData {
  email: string
  password: string
}

interface SigninResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      phone?: string
      emailVerified: boolean
      phoneVerified: boolean
    }
    token: string
  }
}

const signin = async (userData: SigninData): Promise<SigninResponse> => {
  const response = await fetch( process.env.NEXT_PUBLIC_API_BASE_URL + '/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Signin failed')
  }
  
  return response.json()
}

export default function SigninPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const signinMutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.data.user))
      localStorage.setItem('token', data.data.token)


      router.push('/')
      
      if (!data.data.user.emailVerified) {
        router.push('/verify-email')
      } else {
        router.push('/')
      }
    },
    onError: (error: Error) => {
      console.error('Signin error:', error.message)
    },
    
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signinMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 relative">
      {/* Subtle Background Elements - No blur for mobile clarity */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-green-200/30 rounded-full"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-yellow-200/40 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-green-300/20 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-yellow-300/25 rounded-full"></div>
      </div>

      {/* Grid Pattern - Lighter for mobile */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:50px_50px]"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="relative inline-block mb-4 md:mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 via-yellow-400 to-green-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/25 transform rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-105">
                <Leaf className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-yellow-600 bg-clip-text text-transparent mb-2 md:mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-green-700 text-base md:text-lg">Sign in to continue your journey</p>
          </div>

          {/* Main Card - Solid background for mobile clarity */}
          <Card className="bg-white/95 md:bg-white/90 border border-green-200/50 shadow-xl shadow-green-500/10 rounded-xl md:rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              
              {/* Social Login Options */}
              <div className="space-y-3 mb-6 md:mb-8">
                <Button 
                  variant="outline" 
                  className="w-full h-11 md:h-12 bg-white border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300 text-sm md:text-base"
                  type="button"
                >
                  <Chrome className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                  Continue with Google
                </Button>
                
              </div>

              {/* Divider */}
              <div className="relative mb-6 md:mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-green-200"></div>
                </div>
                <div className="relative flex justify-center text-xs md:text-sm">
                  <span className="px-3 md:px-4 bg-white text-green-600 font-medium">or continue with email</span>
                </div>
              </div>

              <div className="space-y-5 md:space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-green-700">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4 md:h-5 md:w-5 transition-colors group-focus-within:text-yellow-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 md:pl-12 h-11 md:h-12 bg-green-50/50 border-green-200 text-green-900 placeholder:text-green-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-green-700">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4 md:h-5 md:w-5 transition-colors group-focus-within:text-yellow-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 md:pl-12 pr-10 md:pr-12 h-11 md:h-12 bg-green-50/50 border-green-200 text-green-900 placeholder:text-green-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm md:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-yellow-500 transition-colors touch-target"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded bg-white"
                    />
                    <Label htmlFor="remember" className="text-xs md:text-sm text-green-700 cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-xs md:text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors touch-target"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error Message */}
                {signinMutation.isError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700 text-sm">
                      {signinMutation.error?.message || 'Signin failed'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={signinMutation.isPending}
                  className="w-full h-12 md:h-12 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:transform-none disabled:hover:scale-100 border-0 text-sm md:text-base"
                >
                  {signinMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 animate-spin" />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                      Sign In
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 md:ml-3" />
                    </>
                  )}
                </Button>
              </div>

              {/* Signup Link */}
              <div className="text-center mt-6 md:mt-8">
                <p className="text-green-700 text-sm md:text-base text-center">
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/signup')}
                    className="text-yellow-600 text-center hover:text-yellow-700 font-semibold transition-colors hover:underline touch-target"
                  >
                    Create your account now
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="text-center mt-6 md:mt-8">
            <div className="flex items-center justify-center space-x-4 md:space-x-6 text-xs md:text-sm text-green-600">
              <div className="flex items-center space-x-1 md:space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Secure Login</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .touch-target {
          min-height: 44px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .touch-target {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  )
}