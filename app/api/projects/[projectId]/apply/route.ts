import { NextRequest, NextResponse } from 'next/server';
import { userAuth } from '@/middleware/userAuth';
import dbConnect, { Project, Application } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
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

      // Check if project exists and is open for applications
      const project = await Project.findById(params.projectId);
      if (!project) {
        return NextResponse.json({
          success: false,
          message: 'Project not found'
        }, { status: 404 });
      }

      if (project.status !== 'OPEN') {
        return NextResponse.json({
          success: false,
          message: 'Project is not open for applications'
        }, { status: 400 });
      }

      // Get application data from request body
      const { answers } = await request.json();
      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Answers are required'
        }, { status: 400 });
      }

      // Check if user already has a pending application for this project
      const existingApplication = await Application.findOne({
        projectId: params.projectId,
        userId: userEmail,
        status: 'PENDING'
      });

      if (existingApplication) {
        return NextResponse.json({
          success: false,
          message: 'You already have a pending application for this project'
        }, { status: 400 });
      }

      // Create application
      const application = await Application.create({
        projectId: params.projectId,
        userId: userEmail,
        answers
      });

      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully',
        application
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to submit application'
      }, { status: 500 });
    }
  })(request);
} 