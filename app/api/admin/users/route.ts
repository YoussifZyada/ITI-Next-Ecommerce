import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import User from '../../../../src/models/User';
import { adminAuth } from '@/lib/admin-guard';

export async function GET(req: NextRequest) {
  try {
    const guard = await adminAuth(req);
    if (guard) return guard;

    // Connection handled by singleton
    const users = await User.find({ isActive: true }).sort({ createdAt: -1 });
    // Serialize MongoDB documents to plain objects (ObjectId -> string)
    const serializedUsers = users.map((user: any) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }));
    return NextResponse.json(serializedUsers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const guard = await adminAuth(req);
    if (guard) return guard;

    // Connection handled by singleton
    const body = await req.json();
    const { userId, role, isActive } = body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role, isActive },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Serialize MongoDB document to plain object (ObjectId -> string)
    return NextResponse.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
