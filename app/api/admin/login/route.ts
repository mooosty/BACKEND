import { NextRequest, NextResponse } from 'next/server';

const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE;
const ADMIN_EMAILS = ['admin@savekat.com']; // Add any admin emails here

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate email and password
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if email is in admin list
    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password against admin access code
    if (password !== ADMIN_ACCESS_CODE) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return success
    return NextResponse.json({ 
      success: true,
      message: 'Admin login successful'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 