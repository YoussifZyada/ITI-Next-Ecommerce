import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../lib/db';
import Newsletter from '../../../../src/models/Newsletter';
import { adminAuth } from '@/lib/admin-guard';

export async function GET(req: NextRequest) {
  try {
    const guard = await adminAuth(req);
    if (guard) return guard;

    // Connection handled by singleton
    const subscribers = await Newsletter.find({ isActive: true });
    const serialized = subscribers.map((sub: any) => ({
      _id: sub._id.toString(),
      email: sub.email,
      isActive: sub.isActive,
      createdAt: sub.createdAt,
    }));
    return NextResponse.json(serialized);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await adminAuth(req);
    if (guard) return guard;

    // Connection handled by singleton
    const { emailContent, target = 'all' } = await req.json();

    // In a real scenario, this would integrate with SendGrid, Mailchimp, or AWS SES
    // Here we simulate the broadcast logic
    console.log(`Broadcasting email to ${target} users: ${emailContent}`);

    return NextResponse.json({ message: 'Newsletter broadcast initiated' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
