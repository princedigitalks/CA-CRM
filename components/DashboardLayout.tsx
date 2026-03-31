'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useAuth } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isLoggedIn && !isLoginPage) {
      router.replace('/login');
    }
    if (isLoggedIn && isLoginPage) {
      router.replace('/');
    }
  }, [isLoggedIn, isLoginPage, router]);

  // Login page — render without shell
  if (isLoginPage) return <>{children}</>;

  // Not logged in yet — blank while redirecting
  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans">
      <Sidebar />
      <div className="pl-64">
        <TopNav />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
