import { NextRequest, NextResponse } from 'next/server';
import { userAuth } from '@/middleware/userAuth';
import dbConnect, { Application } from '@/lib/db';

export async function GET(request: NextRequest) {
  return userAuth(async (req: NextRequest) => {
    try {
      // Connect to database
      await dbConnect();

      // Get user email from auth header
      const userEmail = req.headers.get('x-user-email');
      if (!userEmail) {
        return NextResponse.json({
          success: false,
          message: 'User email not found'
        }, { status: 401 });
      }

      // Get all applications for the user
      const applications = await Application.find({ userId: userEmail })
        .sort({ createdAt: -1 })  // Sort by newest first
        .populate('projectId', 'title status'); // Include project details

      return NextResponse.json({
        success: true,
        message: 'Applications retrieved successfully',
        applications
      });
    } catch (error) {
      console.error('Error getting applications:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to get applications'
      }, { status: 500 });
    }
  })(request);
} 