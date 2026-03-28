'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Upload, HelpCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Clients', href: '/clients' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900 leading-tight">The Vault</h1>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Client Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-900"
              )} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-6 bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-200">
          <Upload size={18} />
          <span className="font-semibold text-sm">Upload Document</span>
        </button>

        <Link
          href="/help"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <HelpCircle size={20} className="text-gray-400" />
          <span className="font-medium text-sm">Help Center</span>
        </Link>
      </div>
    </aside>
  );
}
