'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  LogIn, 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle 
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
  const response = await fetch('http://localhost:5000/api/auth/signin', {
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

  const signinMutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.data.user))
      localStorage.setItem('token', data.data.token)
      
      // Check if email is verified
      if (!data.data.user.emailVerified) {
        router.push('/verify-email')
      } else {
        router.push('/')
      }
    },
    onError: (error: Error) => {
      console.error('Signin error:', error.message)
    }
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signinMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Signin Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {signinMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {signinMutation.error?.message || 'Signin failed'}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={signinMutation.isPending}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-semibold py-3"
              >
                {signinMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Forgot Password & Signup Links */}
            <div className="text-center mt-6 space-y-2">
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Forgot Password?
              </button>
              
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/signup')}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}