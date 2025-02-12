'use client';

import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingPopup from './components/OnboardingPopup';

interface DynamicUser {
  id?: string;
  email?: string;
}

interface DynamicContext {
  user: DynamicUser | null;
  isAuthenticated: boolean;
  handleLogOut: () => void;
}

export default function Home() {
  const { user, handleLogOut, isAuthenticated } = useDynamicContext() as DynamicContext;
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (mounted && isAuthenticated && user?.email) {
        try {
          const response = await fetch(`/api/user?email=${user.email}`);
          const userData = await response.json();
          
          if (!response.ok || !userData || !userData.onboarding_completed) {
            setOnboardingCompleted(false);
            setShowOnboarding(true);
          } else {
            setOnboardingCompleted(true);
            setShowOnboarding(false);
            // Redirect to dashboard if user exists and onboarding is completed
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking user status:', error);
          setOnboardingCompleted(false);
          setShowOnboarding(true);
        }
      } else {
        setShowOnboarding(false);
      }
    };

    checkUserStatus();
  }, [isAuthenticated, user, mounted, router]);

  // Don't render anything until mounted to prevent hydration errors
  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#2a2a28]">
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="p-8 rounded-2xl backdrop-blur-md bg-[#2a2a2833] border border-[#f5efdb1a]">
          <h1 className="text-3xl font-display text-[#f5efdb] mb-6 text-center">Welcome to SaveKat</h1>
          <DynamicWidget />
          {isAuthenticated && mounted && (
            <button 
              onClick={handleLogOut}
              className="mt-4 w-full px-4 py-2 rounded-lg border border-[#f5efdb33] text-[#f5efdb] font-medium hover:bg-[#f5efdb1a] transition-all"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
      {showOnboarding && mounted && !onboardingCompleted && (
        <OnboardingPopup 
          onClose={() => setShowOnboarding(false)} 
        />
      )}
    </div>
  );
}
