'use client';

import React from 'react';
import { Users, FileText, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '@/lib/store';

export function DashboardStats() {
  const { clients } = useStore();

  const totalDocs = clients.reduce((acc, c) => {
    const memberDocs = c.familyMembers.reduce((a, m) => a + m.documents.length, 0);
    return acc + c.documents.length + memberDocs;
  }, 0);

  const totalMembers = clients.reduce((acc, c) => acc + c.familyMembers.length, 0);

  const stats = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'bg-blue-50 text-blue-600', delay: 0 },
    { label: 'Family Members', value: totalMembers, icon: UserPlus, color: 'bg-indigo-50 text-indigo-600', delay: 0.1 },
    { label: 'Total Documents', value: totalDocs, icon: FileText, color: 'bg-orange-50 text-orange-600', delay: 0.2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6"
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
            <stat.icon size={28} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
