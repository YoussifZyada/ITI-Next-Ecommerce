import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Category from '../../../src/models/Category';
import { categoryValidation } from '../../../src/validators/product.validator';
import { adminAuth } from '@/lib/admin-guard';

export async function POST(req: NextRequest) {
  try {
    const authError = await adminAuth(req);
    if (authError) return authError;

    // Connection handled by singleton
    const body = await req.json();
    const { error } = categoryValidation.create.validate(body);

    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    const existing = await Category.findOne({ $or: [{ name: body.name }, { slug: body.slug }] });
    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    const category = await Category.create(body);
    return NextResponse.json({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Connection handled by singleton
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    const serializedCategories = categories.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      isActive: cat.isActive,
      createdAt: cat.createdAt,
    }));
    return NextResponse.json(serializedCategories);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
