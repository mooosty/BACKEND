import { NextRequest } from 'next/server';
import { projectController } from '@/controllers/projectController';
import { userAuth } from '@/middleware/userAuth';
import { adminAuth } from '@/middleware/adminAuth';
import connectDB from '@/config/database';

// Connect to database
connectDB();

// List projects (requires user auth)
export const GET = userAuth(async (req: NextRequest) => {
  return projectController.getAll();
});

// Create project (requires admin auth)
export const POST = adminAuth(async (req: NextRequest) => {
  return projectController.create(req);
}); 