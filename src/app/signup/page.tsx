/* eslint-disable react/no-unescaped-entities */
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
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Loader2, 
  AlertCircle,
  Eye,
  EyeOff,
  Chrome,
  ArrowRight,
  Leaf,
  CheckCircle
} from 'lucide-react'

interface SignupData {
  name: string
  email: string
  password: string
  phone?: string
}

interface SignupResponse {
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
    emailVerificationToken: string
  }
}

const signup = async (userData: SignupData): Promise<SignupResponse> => {
  const response = await fetch( process.env.NEXT_PUBLIC_API_BASE_URL + '/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Signup failed')
  }
  
  return response.json()
}

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.data.user))
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('emailVerificationToken', data.data.emailVerificationToken)
      
      router.push('/verify-email')
    },
    onError: (error: Error) => {
      console.error('Signup error:', error.message)
    }
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    if (!agreeTerms) {
      alert('Please agree to the terms and conditions')
      return
    }

    signupMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 relative">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-green-200/30 rounded-full"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-yellow-200/40 rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-green-300/20 rounded-full"></div>
        <div className="absolute bottom-1/2 right-1/3 w-20 h-20 bg-yellow-300/25 rounded-full"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:50px_50px]"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="relative inline-block mb-4 md:mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 via-yellow-400 to-green-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/25 transform rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-105">
                <UserPlus className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Leaf className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-yellow-600 bg-clip-text text-transparent mb-2 md:mb-3 tracking-tight">
              Join Us Today
            </h1>
            <p className="text-green-700 text-base md:text-lg">Create your account and start ordering</p>
          </div>

          {/* Main Card */}
          <Card className="bg-white/95 md:bg-white/90 border border-green-200/50 shadow-xl shadow-green-500/10 rounded-xl md:rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              
              {/* Google Login Option */}
              <div className="mb-6 md:mb-8">
                <Button 
                  variant="outline" 
                  className="w-full h-11 md:h-12 bg-white border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300 text-sm md:text-base"
                  type="button"
                >
                  <Chrome className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                  Sign up with Google
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-6 md:mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-green-200"></div>
                </div>
                <div className="relative flex justify-center text-xs md:text-sm">
                  <span className="px-3 md:px-4 bg-white text-green-600 font-medium">or sign up with email</span>
                </div>
              </div>

              <div className="space-y-4 md:space-y-5">
                
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-green-700">
                    Full Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4 md:h-5 md:w-5 transition-colors group-focus-within:text-yellow-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 md:pl-12 h-11 md:h-12 bg-green-50/50 border-green-200 text-green-900 placeholder:text-green-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

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

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-green-700">
                    Phone Number <span className="text-green-500 font-normal">(Optional)</span>
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4 md:h-5 md:w-5 transition-colors group-focus-within:text-yellow-500" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10 md:pl-12 h-11 md:h-12 bg-green-50/50 border-green-200 text-green-900 placeholder:text-green-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm md:text-base"
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
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-yellow-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-green-700">
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4 md:h-5 md:w-5 transition-colors group-focus-within:text-yellow-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 md:pl-12 pr-10 md:pr-12 h-11 md:h-12 bg-green-50/50 border-green-200 text-green-900 placeholder:text-green-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm md:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-yellow-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <div className="flex items-center space-x-1 mt-1">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-500">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-500">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2 pt-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded bg-white mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-xs md:text-sm text-green-700 cursor-pointer leading-relaxed">
                    I agree to the{' '}
                    <button type="button" className="text-yellow-600 hover:text-yellow-700 font-medium underline">
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button type="button" className="text-yellow-600 hover:text-yellow-700 font-medium underline">
                      Privacy Policy
                    </button>
                  </Label>
                </div>

                {/* Error Message */}
                {signupMutation.isError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700 text-sm">
                      {signupMutation.error?.message || 'Signup failed'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={signupMutation.isPending || !agreeTerms}
                  className="w-full h-12 md:h-12 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:transform-none disabled:hover:scale-100 disabled:opacity-50 border-0 text-sm md:text-base"
                >
                  {signupMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                      Create Account
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 md:ml-3" />
                    </>
                  )}
                </Button>
              </div>

              {/* Signin Link */}
              <div className="text-center mt-6 md:mt-8">
                <p className="text-green-700 text-sm md:text-base">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/signin')}
                    className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors hover:underline"
                  >
                    Sign in here
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
                <span>Secure Registration</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}