import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Investor Subscription',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${req.headers.get('origin')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get('origin')}/subscription/canceled`,
  })

  return NextResponse.json({ sessionId: checkoutSession.id })
}