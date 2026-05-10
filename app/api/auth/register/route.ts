import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import User from '../../../../src/models/User';
import { userValidation } from '../../../../src/validators/user.validator';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Connection handled by singleton

    const body = await req.json();
    const { error } = userValidation.register.validate(body);

    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ email: body.email }, { phone: body.phone }] });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(body.password);
    let user;
    try {
      user = await User.create({ ...body, password: hashedPassword });
    } catch (err: any) {
      if (err.code === 11000) {
        return NextResponse.json({ error: 'Email or phone already registered' }, { status: 409 });
      }
      throw err;
    }

    const token = generateToken(user._id.toString(), user.role);

    const response = NextResponse.json({
      message: 'User registered successfully',
      user: { name: user.name, email: user.email, role: user.role }
    }, { status: 201 });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
