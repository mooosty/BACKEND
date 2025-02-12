import { NextRequest, NextResponse } from 'next/server';

export function userAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get email from Bearer token
    const userEmail = authHeader.split(' ')[1];
    if (!userEmail || !userEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Add user email to request for use in handlers
    req.headers.set('x-user-email', userEmail);
    
    return handler(req);
  };
} 