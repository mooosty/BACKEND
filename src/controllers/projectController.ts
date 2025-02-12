import { NextRequest } from 'next/server';
import { apiResponse } from '../utils/apiResponse';
import Project, { IProject } from '../models/Project';

export const projectController = {
  // Create a new project
  create: async (req: NextRequest) => {
    try {
      const data = await req.json();
      const project = await Project.create(data);
      return apiResponse.success(project, 'Project created successfully');
    } catch (error) {
      return apiResponse.serverError(error);
    }
  },

  // Get all projects
  getAll: async () => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      return apiResponse.success(projects);
    } catch (error) {
      return apiResponse.serverError(error);
    }
  },

  // Get a single project
  getOne: async (id: string) => {
    try {
      const project = await Project.findById(id);
      if (!project) {
        return apiResponse.error('Project not found', 404);
      }
      return apiResponse.success(project);
    } catch (error) {
      return apiResponse.serverError(error);
    }
  },

  // Update project status
  updateStatus: async (id: string, req: NextRequest) => {
    try {
      const { status } = await req.json();
      const project = await Project.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!project) {
        return apiResponse.error('Project not found', 404);
      }

      return apiResponse.success(project, 'Project status updated successfully');
    } catch (error) {
      return apiResponse.serverError(error);
    }
  },

  // Delete a project
  delete: async (id: string) => {
    try {
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return apiResponse.error('Project not found', 404);
      }
      return apiResponse.success(null, 'Project deleted successfully');
    } catch (error) {
      return apiResponse.serverError(error);
    }
  }
}; 