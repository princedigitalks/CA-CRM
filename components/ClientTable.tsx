'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Plus, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useStore, Client } from '@/lib/store';

function AddClientModal({ onClose }: { onClose: () => void }) {
  const { addClient } = useStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'ACTIVE' as Client['status'] });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    addClient(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Client</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="e.g. Prince Sojitra" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              type="email" className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="email@example.com" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone *</label>
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="+91 98765 43210" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Client['status'] }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">Add Client</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ClientTable() {
  const { clients, deleteClient } = useStore();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = clients.filter(c => filter === 'ALL' || c.status === filter);

  return (
    <>
      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wider transition-colors ${filter === f ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>
                {f}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-blue-100">
            <Plus size={18} /> Add Client
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-50">
                <th className="px-8 py-6">Client Name</th>
                <th className="px-8 py-6">Phone</th>
                <th className="px-8 py-6 text-center">Family Members</th>
                <th className="px-8 py-6 text-center">Documents</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-8 py-16 text-center text-gray-400 text-sm">No clients found.</td></tr>
              )}
              {filtered.map((client) => {
                const totalDocs = client.documents.length + client.familyMembers.reduce((a, m) => a + m.documents.length, 0);
                return (
                  <tr key={client.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-400">{client.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-gray-600">{client.phone}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-900 font-bold text-xs">
                        {client.familyMembers.length}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center font-bold text-blue-600">{totalDocs}</td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${client.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'ACTIVE' ? 'bg-blue-600' : 'bg-gray-400'}`} />
                        {client.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/clients/${client.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye size={18} />
                        </Link>
                        <button onClick={() => deleteClient(client.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-50">
          <p className="text-xs text-gray-400 font-medium">Showing <span className="text-gray-900 font-bold">{filtered.length}</span> of <span className="text-gray-900 font-bold">{clients.length}</span> clients</p>
        </div>
      </div>
    </>
  );
}
