import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting
const attempts = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export async function adminAuth(request: NextRequest) {
  // Get the user's IP for rate limiting
  const ip = request.ip || 'unknown';
  
  // Check if user is in timeout
  const userAttempts = attempts.get(ip);
  if (userAttempts) {
    const timeElapsed = Date.now() - userAttempts.timestamp;
    if (userAttempts.count >= MAX_ATTEMPTS && timeElapsed < TIMEOUT_DURATION) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }
    // Reset attempts if timeout has passed
    if (timeElapsed >= TIMEOUT_DURATION) {
      attempts.delete(ip);
    }
  }

  // Get the admin code from the request
  const { adminCode } = await request.json();
  
  // Verify the admin code
  if (adminCode === process.env.ADMIN_ACCESS_CODE) {
    // Reset attempts on successful login
    attempts.delete(ip);
    
    // Set admin session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('adminAccess', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });
    
    return response;
  }

  // Increment failed attempts
  const currentAttempts = attempts.get(ip);
  if (currentAttempts) {
    currentAttempts.count += 1;
    currentAttempts.timestamp = Date.now();
  } else {
    attempts.set(ip, { count: 1, timestamp: Date.now() });
  }

  return NextResponse.json(
    { error: 'Invalid admin code' },
    { status: 401 }
  );
} 