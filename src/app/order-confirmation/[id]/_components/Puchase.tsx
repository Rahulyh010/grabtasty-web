/* eslint-disable react/no-unescaped-entities */
'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  Utensils,
  Clock,
  CreditCard,
  ArrowRight,
  Home,
  Package
} from 'lucide-react'

interface Purchase {
  _id: string
  userId: string
  subscriptionId: {
    comboConfig: {
      name: string
      description: string
      mealTypes: string[]
      cuisineType: string
      foodType: string
      price: number
      discountPercentage?: number
    }
  }
  kitchenId: {
    name: string
    address: string
    phone: string
  }
  userAddress: string
  userPincode: string
  finalPrice: number
  startDate: string
  endDate: string
  duration: number
  paymentStatus: string
  paymentMethod: string
  status: string
  createdAt: string
}

interface OrderConfirmationProps {
  purchaseId: string
}

const fetchPurchase = async (purchaseId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchases/${purchaseId}`)
  if (!response.ok) throw new Error('Failed to fetch purchase')
  return response.json()
}

export default function OrderConfirmation({ purchaseId }: OrderConfirmationProps) {
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['purchase', purchaseId],
    queryFn: () => fetchPurchase(purchaseId),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
        <div className="max-w-3xl mx-auto pt-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  const purchase: Purchase = data?.data?.purchase

  if (!purchase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Your subscription has been successfully activated</p>
        </div>

        {/* Order Details Card */}
        <Card className="shadow-2xl border-0 overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-6 w-6" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Subscription Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {purchase.subscriptionId.comboConfig.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {purchase.subscriptionId.comboConfig.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {purchase.subscriptionId.comboConfig.mealTypes.map((meal) => (
                  <Badge key={meal} className="bg-green-100 text-green-800">
                    {meal}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-medium">{purchase.duration} Days</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Utensils className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-medium">{purchase.subscriptionId.comboConfig.cuisineType.replace('_', ' ')}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Badge className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-medium">{purchase.subscriptionId.comboConfig.foodType}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                  <div className="font-medium">₹{purchase.finalPrice}</div>
                </div>
              </div>
            </div>

            {/* Kitchen Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Utensils className="h-4 w-4 text-blue-500" />
                Kitchen Details
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {purchase.kitchenId.name}</div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>{purchase.kitchenId.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{purchase.kitchenId.phone}</span>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Delivery Address
              </h4>
              <div className="text-sm space-y-1">
                <div>{purchase.userAddress}</div>
                <div><strong>Pincode:</strong> {purchase.userPincode}</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                Subscription Timeline
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">Start Date</div>
                  <div className="text-gray-600">{formatDate(purchase.startDate)}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">End Date</div>
                  <div className="text-gray-600">{formatDate(purchase.endDate)}</div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-500" />
                Payment Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">Amount Paid</div>
                  <div className="text-lg font-bold text-green-600">₹{purchase.finalPrice}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Payment Method</div>
                  <div className="text-gray-600">{purchase.paymentMethod}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Status</div>
                  <Badge className={purchase.paymentStatus === 'SUCCESS' ? 'bg-green-500' : 'bg-yellow-500'}>
                    {purchase.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Delivery Starts Tomorrow</h4>
                  <p className="text-sm text-gray-600">Your first meal will be delivered starting from {formatDate(purchase.startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Track Your Orders</h4>
                  <p className="text-sm text-gray-600">You'll receive updates about your daily deliveries</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Enjoy Fresh Meals</h4>
                  <p className="text-sm text-gray-600">Delicious {purchase.subscriptionId.comboConfig.cuisineType.replace('_', ' ').toLowerCase()} cuisine delivered daily</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          
          <Button 
            onClick={() => router.push(`/orders`)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            View My Orders
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}