'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, Document, FamilyMember, DOCUMENT_CATEGORIES, ITR_YEARS, Master } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Trash2, FileText, UserPlus, Upload, X, ChevronDown, ChevronUp, Pencil, File, Eye, Edit3, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import PhoneInput from '@/components/PhoneInput';

export default function AddMemberModal({ onClose, onSave }: { onClose: () => void; onSave: (m: Omit<FamilyMember, '_id' | 'documents'>) => Promise<void> }) {
  const { getMasters } = useStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', relation: 'Spouse', phone: '', email: '' });

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const data = await getMasters('relation');
        setMasters(data);
      } catch (error) {
        // Silently fail
      }
    };
    fetchMasters();
  }, [getMasters]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setLoading(true);
    await onSave(form);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add Family Member</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="e.g. Ravi Sojitra" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Relation</label>
            <select value={form.relation} onChange={e => setForm(p => ({ ...p, relation: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100">
              {['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Phone *</label>
            <PhoneInput
              value={form.phone}
              onChange={(value) => setForm(p => ({ ...p, phone: value }))}
              placeholder="Enter 10 digit mobile number"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              type="email" className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="email@example.com" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
