import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Product from '../../../src/models/Product';
import '../../../src/models/Category';
import { productValidation } from '../../../src/validators/product.validator';
import { adminAuth } from '@/lib/admin-guard';

export async function POST(req: NextRequest) {
  try {
    const authError = await adminAuth(req);
    if (authError) return authError;

    // Connection handled by singleton
    const body = await req.json();
    const { error } = productValidation.create.validate(body);

    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    const product = await Product.create(body);
    // Serialize MongoDB document to plain object (ObjectId -> string)
    return NextResponse.json({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      images: product.images,
      isActive: product.isActive,
      createdAt: product.createdAt,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Connection handled by singleton
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let filters: any = { isActive: true };

    if (query) {
      filters.name = { $regex: query, $options: 'i' };
    }
    if (category) {
      filters.category = category;
    }
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filters).populate('category');
    // Serialize MongoDB documents to plain objects (ObjectId -> string)
    const serializedProducts = products.map((product: any) => ({
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
    }));
    return NextResponse.json(serializedProducts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
