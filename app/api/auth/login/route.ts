import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import User from '../../../../src/models/User';
import { userValidation } from '../../../../src/validators/user.validator';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Ensure DB connection (if your db util requires it)
    await db();

    const body = await req.json();

    // Validate input
    const { error } = userValidation.login.validate(body);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: body.email });

    // Validate credentials
    const isPasswordValid =
      user && (await comparePassword(body.password, user.password));

    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateToken(user._id.toString(), user.role);

    // Create response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set HttpOnly cookie (FIXED API)
    response.cookies.set({
  name: 'auth-token',
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
});

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}