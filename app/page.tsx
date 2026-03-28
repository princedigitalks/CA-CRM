'use client';

import React from 'react';
import { DashboardStats } from '@/components/DashboardStats';
import { motion } from 'motion/react';
import { Users, ArrowRight, FileText, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export default function DashboardPage() {
  const { clients } = useStore();
  const recent = [...clients].reverse().slice(0, 5);
  const clearClients = clients.filter(c => c.paymentStatus === 'CLEAR');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-gray-500 mt-2">Overview of all clients, family members, and documents.</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Clients */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Recent Clients</h3>
            <Link href="/clients" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {recent.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No clients yet.</p>
                <Link href="/clients" className="text-blue-600 font-bold text-sm mt-2 inline-block hover:underline">+ Add your first client</Link>
              </div>
            )}
            {recent.map((client, i) => {
              const totalDocs = client.documents.length + client.familyMembers.reduce((a, m) => a + m.documents.length, 0);
              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/clients/${client.id}`} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-400">{client.phone}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><UserPlus size={13} /> {client.familyMembers.length}</span>
                      <span className="flex items-center gap-1"><FileText size={13} /> {totalDocs}</span>
                      <span className={`px-2 py-1 rounded-full font-bold text-[10px] ${client.paymentStatus === 'CLEAR' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {client.paymentStatus}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <div className="bg-blue-600 rounded-[40px] p-8 text-white">
            <h3 className="text-xl font-bold mb-3">Quick Actions</h3>
            <p className="text-blue-100 text-sm mb-6">Manage your vault efficiently.</p>
            <div className="space-y-3">
              <Link href="/clients" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl px-4 py-3 text-sm font-bold">
                <Users size={18} /> Add New Client
              </Link>
              <Link href="/clients" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl px-4 py-3 text-sm font-bold">
                <FileText size={18} /> Manage Documents
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8">
            <h3 className="font-bold text-gray-900 mb-4">Payment Clear</h3>
            {clearClients.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No clients with clear payment.</p>
            ) : (
              <div className="space-y-3">
                {clearClients.slice(0, 4).map(c => (
                  <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                      <p className="text-[10px] text-gray-400">{c.familyMembers.length} members · {c.documents.length} docs</p>
                    </div>
                  </Link>
                ))}
                {clearClients.length > 4 && (
                  <Link href="/clients" className="text-xs text-blue-600 font-bold hover:underline block text-center pt-1">
                    +{clearClients.length - 4} more
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
