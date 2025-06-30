'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Sidebar from './Sidebar';
import LoadingSpinner from './LoadingSpinner';
import AuthForm from './AuthForm';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, currentUser } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !currentUser) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 lg:hidden">
          <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/50 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}