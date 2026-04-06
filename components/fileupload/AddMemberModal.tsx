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
  const [masters, setMasters] = useState<Master[]>([]);
  const [form, setForm] = useState({ name: '' });

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
    if (!form.name.trim()) return;
    setLoading(true);
    await onSave({ ...form, relation: '', phone: '', email: '' });
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
