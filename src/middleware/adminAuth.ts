import { NextRequest, NextResponse } from 'next/server';
import { userAuth } from './userAuth';

export function adminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return userAuth(async (req: NextRequest) => {
    const adminAccess = req.cookies.get('adminAccess')?.value;

    if (!adminAccess || adminAccess !== 'true') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return handler(req);
  });
} 