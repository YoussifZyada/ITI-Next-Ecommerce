import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Order from '../../../src/models/Order';
import Product from '../../../src/models/Product';
import { verifyToken } from '@/lib/auth';
import { adminAuth } from '@/lib/admin-guard';

export async function GET(req: NextRequest) {
  try {
    const authError = await adminAuth(req);
    if (authError) return authError;

    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    const serialized = orders.map((order: any) => ({
      _id: order._id.toString(),
      user: order.user
        ? { _id: (order.user as any)._id?.toString(), name: (order.user as any).name, email: (order.user as any).email }
        : null,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      itemCount: order.items.length,
      createdAt: order.createdAt,
    }));
    return NextResponse.json(serialized);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Connection handled by singleton

    const token = req.cookies.get('auth-token')?.value;
    let userId = null;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) userId = decoded.userId;
    }

    const body = await req.json();
    const { items, shippingAddress, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Guest checkout: If no userId, we still create order but maybe mark as guest
    // For this implementation, we'll require a userId or handle guest logically
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required for checkout' }, { status: 401 });
    }

    // Validate stock and calculate final total on server to prevent client manipulation
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ error: `Product ${item.name} is out of stock` }, { status: 400 });
      }
      calculatedTotal += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount: calculatedTotal,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });

    return NextResponse.json({
      message: 'Order created successfully',
      orderId: order._id.toString(),
      totalAmount: calculatedTotal
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
