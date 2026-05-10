import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import User from '../../../../../src/models/User';
import { adminAuth } from '@/lib/admin-guard';

export async function DELETE(req: NextRequest) {
  try {
    const guard = await adminAuth(req);
    if (guard) return guard;

    // Connection handled by singleton
    const { userId } = await req.json();

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User soft-deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
