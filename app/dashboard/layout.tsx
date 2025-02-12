'use client';

import { useEffect, useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useDynamicContext();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || !user)) {
      router.push('/');
    }
  }, [isAuthenticated, user, router, mounted]);

  if (!mounted || !isAuthenticated || !user) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-[#2a2a28]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-[#f5efdb1a] backdrop-blur-md bg-[#2a2a2833]">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-[#f5efdb] text-xl font-display">Dashboard</h1>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/dashboard" 
                    className={`flex items-center px-4 py-2 text-[#f5efdb] rounded-lg transition-all ${
                      isActive('/dashboard') 
                        ? 'bg-[#f5efdb1a]' 
                        : 'hover:bg-[#f5efdb1a]'
                    }`}
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard/projects" 
                    className={`flex items-center px-4 py-2 text-[#f5efdb] rounded-lg transition-all ${
                      isActive('/dashboard/projects') 
                        ? 'bg-[#f5efdb1a]' 
                        : 'hover:bg-[#f5efdb1a]'
                    }`}
                  >
                    Projects
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 