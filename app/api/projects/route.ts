import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Project from '@/models/Project';

// Connect to database
connectDB();

export async function GET(request: NextRequest) {
  // Log headers for debugging
  console.log('Headers:', Object.fromEntries(request.headers.entries()));
  
  // Check for authorization header
  const authHeader = request.headers.get('authorization');
  console.log('Auth Header:', authHeader);
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ 
      error: 'Authentication required',
      received_header: authHeader
    }, { status: 401 });
  }

  // Get email from Bearer token
  const userEmail = authHeader.split(' ')[1];
  if (!userEmail || !userEmail.includes('@')) {
    return NextResponse.json({ 
      error: 'Invalid authentication token',
      received_email: userEmail
    }, { status: 401 });
  }

  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json({ 
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch projects' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Check for authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Check for admin access
  const adminAccess = request.cookies.get('adminAccess')?.value;
  if (!adminAccess || adminAccess !== 'true') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const data = await request.json();
    
    // Create new project in database
    const project = await Project.create(data);
    
    return NextResponse.json({ 
      success: true,
      message: "Project created successfully",
      project: project
    });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create project' 
    }, { status: 500 });
  }
} 