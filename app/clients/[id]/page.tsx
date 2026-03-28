'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, Document, FamilyMember, DOCUMENT_CATEGORIES, ITR_YEARS } from '@/lib/store';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Trash2, FileText, UserPlus, Upload, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

function UploadDocModal({ onClose, onSave }: { onClose: () => void; onSave: (doc: Omit<Document, 'id' | 'uploadedAt'>) => void }) {
  const [form, setForm] = useState<{ name: string; type: string; size: string; category: Document['category']; itrYear?: Document['itrYear'] }>({
    name: '', type: 'PDF', size: '', category: 'PAN Card',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (form.category === 'ITR' && !form.itrYear) return;
    onSave({ ...form, size: form.size || 'N/A' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="e.g. Aadhar_Card.pdf" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100">
                {['PDF', 'Image', 'Word', 'Excel', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Document['category'], itrYear: undefined }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100">
                {DOCUMENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {form.category === 'ITR' && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ITR Year *</label>
              <select value={form.itrYear ?? ''} onChange={e => setForm(p => ({ ...p, itrYear: e.target.value as Document['itrYear'] }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" required>
                <option value="">Select Year</option>
                {ITR_YEARS.map(y => <option key={y} value={y}>ITR {y}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">File Size</label>
            <input value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="e.g. 1.2 MB" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddMemberModal({ onClose, onSave }: { onClose: () => void; onSave: (m: Omit<FamilyMember, 'id' | 'clientId' | 'documents'>) => void }) {
  const [form, setForm] = useState({ name: '', relation: 'Spouse', phone: '', email: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    onSave(form);
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
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="+91 98765 43210" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              type="email" className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="email@example.com" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700">Add Member</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DocumentList({ docs, onDelete, onAdd }: { docs: Document[]; onDelete: (id: string) => void; onAdd: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-500">{docs.length} document{docs.length !== 1 ? 's' : ''}</p>
        <button onClick={onAdd} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-xl transition-colors">
          <Upload size={14} /> Upload
        </button>
      </div>
      {docs.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl">
          No documents yet. Click Upload to add.
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{doc.name}</p>
                <p className="text-[10px] text-gray-400">
                  {doc.category}{doc.itrYear ? ` · ${doc.itrYear}` : ''} · {doc.type} · {doc.size} · {doc.uploadedAt}
                </p>
              </div>
              <button onClick={() => onDelete(doc.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { clients, updateClient, addFamilyMember, deleteFamilyMember, addDocument, deleteDocument } = useStore();
  const client = clients.find(c => c.id === id);

  const totalDocs = client ? client.documents.length + client.familyMembers.reduce((a, m) => a + m.documents.length, 0) : 0;
  const [tab, setTab] = useState<'documents' | 'family'>('documents');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showUploadClient, setShowUploadClient] = useState(false);
  const [uploadMemberId, setUploadMemberId] = useState<string | null>(null);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto text-center py-20">
        <p className="text-gray-400 text-lg">Client not found.</p>
        <Link href="/clients" className="text-blue-600 font-bold mt-4 inline-block">← Back to Clients</Link>
      </div>
    );
  }

  return (
    <>
      {showUploadClient && (
        <UploadDocModal onClose={() => setShowUploadClient(false)} onSave={doc => addDocument(client.id, doc)} />
      )}
      {uploadMemberId && (
        <UploadDocModal onClose={() => setUploadMemberId(null)} onSave={doc => addDocument(client.id, doc, uploadMemberId)} />
      )}
      {showAddMember && (
        <AddMemberModal onClose={() => setShowAddMember(false)} onSave={m => addFamilyMember(client.id, m)} />
      )}

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 text-sm font-bold mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Clients
          </button>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white font-bold text-3xl">
              {client.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">{client.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                {client.email && <span>{client.email}</span>}
                <span>{client.phone}</span>
                <button
                  onClick={() => updateClient(client.id, { paymentStatus: client.paymentStatus === 'CLEAR' ? 'PENDING' : 'CLEAR' })}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${client.paymentStatus === 'CLEAR' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                  Payment: {client.paymentStatus}
                </button>
                <button
                  onClick={() => updateClient(client.id, { serviceEnabled: !client.serviceEnabled })}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${client.serviceEnabled ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  Service: {client.serviceEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{client.familyMembers.length}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalDocs}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Docs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setTab('documents')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-colors ${tab === 'documents' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-500 border border-gray-100 hover:text-gray-900'}`}>
            <span className="flex items-center gap-2"><FileText size={16} /> Documents ({client.documents.length})</span>
          </button>
          <button onClick={() => setTab('family')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-colors ${tab === 'family' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-500 border border-gray-100 hover:text-gray-900'}`}>
            <span className="flex items-center gap-2"><UserPlus size={16} /> Family Members ({client.familyMembers.length})</span>
          </button>
        </div>

        {tab === 'documents' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{client.name}'s Documents</h3>
              <button onClick={() => setShowUploadClient(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-colors shadow-lg shadow-blue-100">
                <Plus size={16} /> Upload Document
              </button>
            </div>
            <DocumentList
              docs={client.documents}
              onDelete={docId => deleteDocument(client.id, docId)}
              onAdd={() => setShowUploadClient(true)}
            />
          </motion.div>
        )}

        {tab === 'family' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowAddMember(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-colors shadow-lg shadow-blue-100">
                <Plus size={16} /> Add Family Member
              </button>
            </div>

            {client.familyMembers.length === 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                  <UserPlus size={32} />
                </div>
                <p className="text-gray-400 font-medium">No family members added yet.</p>
                <button onClick={() => setShowAddMember(true)} className="mt-4 text-blue-600 font-bold text-sm hover:underline">
                  + Add First Member
                </button>
              </div>
            )}

            {client.familyMembers.map((member, i) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">{member.relation}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span>{member.phone}</span>
                      {member.email && <span>{member.email}</span>}
                      <span className="text-blue-600 font-bold">{member.documents.length} docs</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                      className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                      {expandedMember === member.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <button onClick={() => deleteFamilyMember(client.id, member.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {expandedMember === member.id && (
                  <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                    <DocumentList
                      docs={member.documents}
                      onDelete={docId => deleteDocument(client.id, docId, member.id)}
                      onAdd={() => setUploadMemberId(member.id)}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
