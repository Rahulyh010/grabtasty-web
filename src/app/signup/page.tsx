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
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Loader2, 
  AlertCircle 
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
  const response = await fetch('http://localhost:5000/api/auth/signup', {
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

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.data.user))
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('emailVerificationToken', data.data.emailVerificationToken)
      
      // Redirect to verification page
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

    signupMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us for delicious meal subscriptions</p>
        </div>

        {/* Signup Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

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

              {/* Phone (Optional) */}
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
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

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {signupMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {signupMutation.error?.message || 'Signup failed'}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-semibold py-3"
              >
                {signupMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/signin')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}