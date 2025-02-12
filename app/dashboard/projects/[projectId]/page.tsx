'use client';

import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'COMING_SOON' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  tasks: number;
  applications: number;
  hasApplied: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailsPage({ params }: { params: { projectId: string } }) {
  const { user } = useDynamicContext();
  const [mounted, setMounted] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${params.projectId}`, {
          headers: {
            'Authorization': `Bearer ${user.email}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }

        const data = await response.json();
        console.log('Project details response:', data);
        
        if (data.success) {
          setProject(data.project);
        } else {
          throw new Error(data.error || 'Failed to fetch project details');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchProject();
    }
  }, [user, mounted, params.projectId]);

  if (!mounted) {
    return null;
  }

  const statusColors = {
    'COMING_SOON': 'text-[#f5efdb] bg-[#f5efdb1a]',
    'OPEN': 'text-green-400 bg-green-400/10',
    'IN_PROGRESS': 'text-blue-400 bg-blue-400/10',
    'COMPLETED': 'text-gray-400 bg-gray-400/10'
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center text-[#f5efdb] hover:text-[#f5efdb99] transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/20 text-red-500">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-8">
          <div className="animate-pulse rounded-xl backdrop-blur-md bg-[#2a2a2833] border border-[#f5efdb1a] p-6">
            <div className="h-8 bg-[#f5efdb1a] rounded w-1/3 mb-4" />
            <div className="h-4 bg-[#f5efdb1a] rounded w-1/2" />
          </div>
        </div>
      ) : project ? (
        <div className="space-y-8">
          {/* Project Header */}
          <div className="rounded-xl backdrop-blur-md bg-[#2a2a2833] border border-[#f5efdb1a] p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-display text-[#f5efdb]">{project.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[project.status]}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>

            {/* Project Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Project Description */}
            <p className="text-[#f5efdb99] mb-6">{project.description}</p>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-[#2a2a2855] p-4">
                <div className="text-sm text-[#f5efdb99] mb-1">Tasks</div>
                <div className="text-2xl text-[#f5efdb]">{project.tasks}</div>
              </div>
              <div className="rounded-lg bg-[#2a2a2855] p-4">
                <div className="text-sm text-[#f5efdb99] mb-1">Applications</div>
                <div className="text-2xl text-[#f5efdb]">{project.applications}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              {project.status === 'OPEN' && (
                project.hasApplied ? (
                  <button 
                    disabled
                    className="flex-1 px-6 py-3 rounded-lg bg-[#f5efdb33] text-[#f5efdb99] font-medium cursor-not-allowed"
                  >
                    Application Submitted
                  </button>
                ) : (
                  <button
                    onClick={() => {}} // TODO: Implement apply functionality
                    className="flex-1 px-6 py-3 rounded-lg bg-[#f5efdb] text-[#2a2a28] font-medium hover:opacity-90 transition-all"
                  >
                    Apply Now
                  </button>
                )
              )}
              <button className="flex-1 px-6 py-3 rounded-lg border border-[#f5efdb33] text-[#f5efdb] font-medium hover:bg-[#f5efdb1a] transition-all">
                View Tasks
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#f5efdb99]">Project not found.</p>
        </div>
      )}
    </div>
  );
} 