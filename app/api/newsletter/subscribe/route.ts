import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import Newsletter from '../../../..//src/models/Newsletter';
import { newsletterValidation } from '../../../../src/validators/marketing.validator';

export async function POST(req: NextRequest) {
  try {
    // Connection handled by singleton
    const body = await req.json();
    const { error } = newsletterValidation.subscribe.validate(body);

    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    const existing = await Newsletter.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
    }

    const subscription = await Newsletter.create(body);
    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
