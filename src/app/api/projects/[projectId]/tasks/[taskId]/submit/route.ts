import { NextRequest, NextResponse } from 'next/server';
import { userAuth } from '@/middleware/userAuth';
import dbConnect, { Task } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string; taskId: string } }
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

      // Get submission data from request body
      const { link, description } = await request.json();
      if (!link || !description) {
        return NextResponse.json({
          success: false,
          message: 'Link and description are required'
        }, { status: 400 });
      }

      // Find task and verify ownership
      const task = await Task.findOne({
        _id: params.taskId,
        projectId: params.projectId,
        userId: userEmail
      });

      if (!task) {
        return NextResponse.json({
          success: false,
          message: 'Task not found or you do not have permission to submit'
        }, { status: 404 });
      }

      // Verify task is in a submittable state
      const submittableStates = ['PENDING', 'IN_PROGRESS', 'NEGOTIATION'];
      if (!submittableStates.includes(task.status)) {
        return NextResponse.json({
          success: false,
          message: `Cannot submit task in ${task.status} status`
        }, { status: 400 });
      }

      // Update task with submission
      task.submission = { link, description };
      task.status = 'SUBMITTED';
      await task.save();

      return NextResponse.json({
        success: true,
        message: 'Task submitted successfully',
        task
      });
    } catch (error) {
      console.error('Error submitting task:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to submit task'
      }, { status: 500 });
    }
  })(request);
} 