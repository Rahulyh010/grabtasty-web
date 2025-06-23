/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react'

interface VerifyEmailResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      emailVerified: boolean
    }
  }
}

interface ResendEmailResponse {
  success: boolean
  message: string
  data: {
    emailVerificationToken: string
  }
}

const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email/${token}`, {
    method: 'GET'
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Verification failed')
  }
  
  return response.json()
}

const resendVerification = async (email: string): Promise<ResendEmailResponse> => {
  const response = await fetch( process.env.NEXT_PUBLIC_API_BASE_URL + '/api/auth/send-email-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to resend verification')
  }
  
  return response.json()
}

export default function VerifyEmailPage() {
  const router = useRouter()
  const [verificationToken, setVerificationToken] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isManualVerification, setIsManualVerification] = useState(false)

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user')
    const storedToken = localStorage.getItem('emailVerificationToken')
    
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // If already verified, redirect to home
      if (parsedUser.emailVerified) {
        router.push('/')
      }
    }
    
    if (storedToken) {
      setVerificationToken(storedToken)
    }
  }, [router])

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      // Update user in localStorage
      const updatedUser = { ...user, emailVerified: true }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    },
    onError: (error: Error) => {
      console.error('Verification error:', error.message)
    }
  })

  const resendMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: (data) => {
      // Update token in localStorage
      localStorage.setItem('emailVerificationToken', data.data.emailVerificationToken)
      setVerificationToken(data.data.emailVerificationToken)
    },
    onError: (error: Error) => {
      console.error('Resend error:', error.message)
    }
  })

  const handleVerify = (token?: string) => {
    const tokenToUse = token || verificationToken
    if (tokenToUse) {
      verifyMutation.mutate(tokenToUse)
    }
  }

  const handleResend = () => {
    if (user?.email) {
      resendMutation.mutate(user.email)
    }
  }

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerify(verificationToken)
  }

  // Auto-verify if token exists
  useEffect(() => {
    if (verificationToken && !isManualVerification && !verifyMutation.isPending) {
      // Auto-verify after 1 second
      const timer = setTimeout(() => {
        handleVerify(verificationToken)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [verificationToken, isManualVerification])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (verifyMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-4">Your email has been successfully verified</p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a verification link to <strong>{user.email}</strong>
          </p>
        </div>

        {/* Verification Status */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle>Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            
            {/* Auto-verification in progress */}
            {verifyMutation.isPending && (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
                <p className="text-gray-600">Verifying your email...</p>
              </div>
            )}

            {/* Auto-verification waiting */}
            {!verifyMutation.isPending && !isManualVerification && verificationToken && (
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-gray-600 mb-4">
                  We found your verification token. Verifying automatically...
                </p>
                <Button
                  onClick={() => setIsManualVerification(true)}
                  variant="outline"
                  size="sm"
                >
                  Verify Manually Instead
                </Button>
              </div>
            )}

            {/* Manual verification form */}
            {(isManualVerification || !verificationToken) && !verifyMutation.isPending && (
              <form onSubmit={handleManualVerify} className="space-y-4">
                <div>
                  <Label htmlFor="token">Verification Token</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter verification token"
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Check your email for the verification token
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!verificationToken}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Email
                </Button>
              </form>
            )}

            {/* Error Display */}
            {verifyMutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {verifyMutation.error?.message || 'Verification failed'}
                </AlertDescription>
              </Alert>
            )}

            {/* Resend Success */}
            {resendMutation.isSuccess && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Verification email sent successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Resend Verification */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the email?
              </p>
              <Button
                onClick={handleResend}
                disabled={resendMutation.isPending}
                variant="outline"
                size="sm"
              >
                {resendMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Email
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skip for now (development) */}
        <div className="text-center mt-6">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            Skip for now
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}