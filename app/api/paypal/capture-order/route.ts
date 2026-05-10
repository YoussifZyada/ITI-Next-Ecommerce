import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Order from '../../../../src/models/Order';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';

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
    const { orderID, mongoOrderId } = await req.json();

    const accessToken = await getPayPalAccessToken();

    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await captureResponse.json();

    if (data.status === 'COMPLETED') {
      await Order.findByIdAndUpdate(mongoOrderId, {
        paymentStatus: 'completed',
      });
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
