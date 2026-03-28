'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export function TopNav() {
  const { clients } = useStore();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pendingCount = clients.filter(c => c.paymentStatus === 'PENDING').length;

  const results = query.trim().length > 0
    ? clients.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query) ||
        (c.email && c.email.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl" ref={ref}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search clients, phone, email..."
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-10 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={16} />
            </button>
          )}

          {open && results.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {results.map(c => (
                <Link
                  key={c.id}
                  href={`/clients/${c.id}`}
                  onClick={() => { setQuery(''); setOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400 truncate">{c.phone}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.paymentStatus === 'CLEAR' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {c.paymentStatus}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {open && query.trim().length > 0 && results.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-6 text-center text-sm text-gray-400 z-50">
              No clients found for "{query}"
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/clients" className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <Bell size={22} />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold px-0.5">
              {pendingCount}
            </span>
          )}
        </Link>

        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm select-none">
          A
        </div>
      </div>
    </header>
  );
}
