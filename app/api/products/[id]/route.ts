import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Product from '../../../../src/models/Product';
import { productValidation } from '../../../../src/validators/product.validator';
import { adminAuth } from '@/lib/admin-guard';

export async function GET(req: NextRequest) {
  try {
    // Connection handled by singleton
    const id = req.nextUrl.pathname.split('/').pop() || '';
    const product = await Product.findById(id).populate('category');

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Serialize MongoDB document to plain object
    return NextResponse.json({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category ? {
        _id: product.category._id?.toString() || product.category,
        name: product.category.name,
      } : null,
      images: product.images,
      isActive: product.isActive,
      createdAt: product.createdAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authError = await adminAuth(req);
    if (authError) return authError;

    // Connection handled by singleton
    const id = req.nextUrl.pathname.split('/').pop() || '';
    const body = await req.json();
    const { error } = productValidation.update.validate(body);

    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(id, body, { new: true }).populate('category');
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Serialize MongoDB document to plain object
    return NextResponse.json({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category ? {
        _id: product.category._id?.toString() || product.category,
        name: product.category.name,
      } : null,
      images: product.images,
      isActive: product.isActive,
      createdAt: product.createdAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authError = await adminAuth(req);
    if (authError) return authError;

    // Connection handled by singleton
    const id = req.nextUrl.pathname.split('/').pop() || '';
    // Soft delete implementation
    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product soft-deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
