'use client';

import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function DashboardPage() {
  const { user } = useDynamicContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-2xl p-8 backdrop-blur-md bg-[#2a2a2833] border border-[#f5efdb1a]">
        <h1 className="text-3xl font-display text-[#f5efdb] mb-4">
          Welcome{user?.email ? `, ${user.email}` : ''}
        </h1>
        <p className="text-[#f5efdb99]">
          Welcome to your dashboard
        </p>
      </div>
    </div>
  );
} 