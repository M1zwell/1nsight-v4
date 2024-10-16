"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Subscription() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be signed in to subscribe",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { sessionId } = await response.json()
    const stripe = await stripePromise

    const { error } = await stripe!.redirectToCheckout({ sessionId })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subscription</h1>
      <p className="mb-4">Upgrade to Investor status to access premium content.</p>
      <Button onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Processing...' : 'Subscribe Now'}
      </Button>
    </div>
  )
}