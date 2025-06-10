/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Crown,
  MapPin,
  CreditCard,
  Clock,
  Utensils,
  Shield,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Phone,
} from 'lucide-react'

interface Subscription {
  _id: string
  kitchenId: {
    _id: string
    name: string
    address: string
    phone: string
  }
  comboConfig: {
    name: string
    description: string
    mealTypes: string[]
    cuisineType: string
    foodType: string
    price: number
    discountPercentage?: number
  }
  duration: number
}

interface CheckoutPageProps {
  subscriptionId: string
}

const fetchSubscription = async (subscriptionId: string) => {
  const response = await fetch(`http://localhost:5000/api/subscriptions/${subscriptionId}`)
  if (!response.ok) throw new Error('Failed to fetch subscription')
  return response.json()
}

const createPurchase = async (purchaseData: any) => {
  const response = await fetch('http://localhost:5000/api/purchases/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(purchaseData)
  })
  if (!response.ok) throw new Error('Failed to create purchase')
  return response.json()
}

export default function CheckoutPage({ subscriptionId }: CheckoutPageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    userId: '', // Mock user ID
    userAddress: '',
    userPincode: '',
    paymentMethod: 'UPI',
    transactionId: ''
  })


  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      // setUser(parsedUser)
      setFormData(prev => ({ ...prev, userId: parsedUser.id }))
    }
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['subscription', subscriptionId],
    queryFn: () => fetchSubscription(subscriptionId),
  })

  const purchaseMutation = useMutation({
    mutationFn: createPurchase,
    onSuccess: (data) => {
      router.push(`/order-confirmation/${data.data.purchase._id}`)
    },
    onError: (error) => {
      alert(`Error: ${error.message}`)
    }
  })

  const subscription = data?.data?.subscription

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const originalPrice = subscription.comboConfig.price
  const discount = subscription.comboConfig.discountPercentage || 0
  const finalPrice = originalPrice - (originalPrice * discount / 100)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.userAddress || !formData.userPincode) {
      alert('Please fill in your address and pincode')
      return
    }

    purchaseMutation.mutate({
      ...formData,
      subscriptionId,
      transactionId: `TXN${Date.now()}` // Mock transaction ID
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your subscription purchase</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Summary */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Subscription Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {subscription.comboConfig.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {subscription.comboConfig.description}
                </p>

                {/* Meal Types */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {subscription.comboConfig.mealTypes.map((meal: string) => (
                    <Badge key={meal} variant="secondary" className="text-xs">
                      {meal}
                    </Badge>
                  ))}
                </div>

                {/* Kitchen Details */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{subscription.kitchenId.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{subscription.kitchenId.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{subscription.kitchenId.phone}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span>₹{originalPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{originalPrice - finalPrice}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span>{subscription.duration} days</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{finalPrice}</span>
                </div>
                <div className="text-center text-sm text-gray-500">
                  ₹{Math.round(finalPrice / subscription.duration)}/day
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Fresh Daily Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{subscription.comboConfig.cuisineType.replace('_', ' ')} Cuisine</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <span>{subscription.comboConfig.foodType} Only</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Delivery & Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </h3>
                  
                  <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address"
                      value={formData.userAddress}
                      onChange={(e) => handleInputChange('userAddress', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="Enter pincode"
                      value={formData.userPincode}
                      onChange={(e) => handleInputChange('userPincode', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {['UPI', 'CARD', 'NETBANKING', 'WALLET'].map((method) => (
                      <Button
                        key={method}
                        type="button"
                        variant={formData.paymentMethod === method ? 'default' : 'outline'}
                        onClick={() => handleInputChange('paymentMethod', method)}
                        className="text-sm"
                      >
                        {method}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  disabled={purchaseMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-semibold py-3 text-lg"
                >
                  {purchaseMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Place Order - ₹{finalPrice}
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our terms and conditions
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}