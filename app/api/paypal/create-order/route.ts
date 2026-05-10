import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Order from '../../../../src/models/Order';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials are not configured');
  }
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${PAYPAL_CLIENT_ID}&client_secret=${PAYPAL_CLIENT_SECRET}`,
  });

  if (!response.ok) {
    throw new Error('Failed to obtain PayPal access token');
  }
  const data = await response.json();
  if (!data.access_token) {
    throw new Error('PayPal access token missing from response');
  }
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    // Connection handled by singleton
    const { orderId } = await req.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const accessToken = await getPayPalAccessToken();

    const paypalOrder = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: order.totalAmount.toFixed(2),
            },
            description: `Order ${order._id}`,
          },
        ],
        application_context: {
          return_url: `${APP_BASE_URL}/success`,
          cancel_url: `${APP_BASE_URL}/cancel`,
          brand_name: 'E-Shop',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!paypalOrder.ok) {
      const errorData = await paypalOrder.json();
      return NextResponse.json({ error: 'PayPal order creation failed', details: errorData }, { status: 400 });
    }

    const data = await paypalOrder.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
