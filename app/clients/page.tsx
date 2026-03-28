'use client';

import React from 'react';
import { ClientTable } from '@/components/ClientTable';
import { motion } from 'motion/react';

export default function ClientsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Client Management</h2>
        <p className="text-gray-500 mt-2">Add clients, manage their family members and documents.</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ClientTable />
      </motion.div>
    </div>
  );
}
