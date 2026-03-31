'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Eye, ToggleLeft, ToggleRight, Search, X, Pencil, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useStore, Client } from '@/lib/store';
import { useToast } from './Toast';

function useEscClose(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);
}

function CopyPhone({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center gap-2 group/phone">
      <span className="text-sm font-medium text-gray-600">{phone}</span>
      <button onClick={copy} className="opacity-0 group-hover/phone:opacity-100 transition-opacity p-1 text-gray-400 hover:text-blue-600">
        {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
      </button>
    </div>
  );
}

function AddClientModal({ onClose }: { onClose: () => void }) {
  const { addClient } = useStore();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', paymentStatus: 'CLEAR' as Client['paymentStatus'], serviceEnabled: true });
  useEscClose(onClose);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    addClient(form);
    toast('Client added successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Add New Client</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoFocus
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="e.g. Prince Sojitra" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              type="email" className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="email@example.com" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Phone *</label>
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="+91 98765 43210" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Status</label>
              <select value={form.paymentStatus} onChange={e => setForm(p => ({ ...p, paymentStatus: e.target.value as Client['paymentStatus'] }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100">
                <option value="CLEAR">Clear</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service</label>
              <select value={form.serviceEnabled ? 'ON' : 'OFF'} onChange={e => setForm(p => ({ ...p, serviceEnabled: e.target.value === 'ON' }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100">
                <option value="ON">Enabled</option>
                <option value="OFF">Disabled</option>
              </select>
            </div>
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

function EditClientModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const { updateClient } = useStore();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: client.name, email: client.email, phone: client.phone, paymentStatus: client.paymentStatus, serviceEnabled: client.serviceEnabled });
  useEscClose(onClose);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    updateClient(client.id, form);
    toast('Client updated successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Edit Client</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoFocus
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              type="email" className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Phone *</label>
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Status</label>
              <select value={form.paymentStatus} onChange={e => setForm(p => ({ ...p, paymentStatus: e.target.value as Client['paymentStatus'] }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100">
                <option value="CLEAR">Clear</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service</label>
              <select value={form.serviceEnabled ? 'ON' : 'OFF'} onChange={e => setForm(p => ({ ...p, serviceEnabled: e.target.value === 'ON' }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100">
                <option value="ON">Enabled</option>
                <option value="OFF">Disabled</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  useEscClose(onCancel);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

export function ClientTable() {
  const { clients, deleteClient, updateClient } = useStore();
  const { toast } = useToast();
  const [payFilter, setPayFilter] = useState<'ALL' | 'CLEAR' | 'PENDING'>('ALL');
  const [svcFilter, setSvcFilter] = useState<'ALL' | 'ON' | 'OFF'>('ALL');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = clients.filter(c => {
    const payOk = payFilter === 'ALL' || c.paymentStatus === payFilter;
    const svcOk = svcFilter === 'ALL' || (svcFilter === 'ON' ? c.serviceEnabled : !c.serviceEnabled);
    const q = search.trim().toLowerCase();
    const searchOk = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q));
    return payOk && svcOk && searchOk;
  });

  const handleTogglePayment = useCallback((client: Client) => {
    const next = client.paymentStatus === 'CLEAR' ? 'PENDING' : 'CLEAR';
    updateClient(client.id, { paymentStatus: next });
    toast(`Payment set to ${next} for ${client.name}`);
  }, [updateClient, toast]);

  const handleToggleService = useCallback((client: Client) => {
    const next = !client.serviceEnabled;
    updateClient(client.id, { serviceEnabled: next });
    toast(`Service ${next ? 'enabled' : 'disabled'} for ${client.name}`);
  }, [updateClient, toast]);

  return (
    <>
      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
      {editClient && <EditClientModal client={editClient} onClose={() => setEditClient(null)} />}
      {deleteId && (
        <ConfirmModal
          message="This will permanently delete the client and all their data."
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            const name = clients.find(c => c.id === deleteId)?.name;
            deleteClient(deleteId);
            setDeleteId(null);
            toast(`${name} deleted`, 'error');
          }}
        />
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone or email..."
              className="w-full bg-gray-50 rounded-2xl py-3 pl-11 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all border border-gray-100"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mr-1">Payment:</span>
                {(['ALL', 'CLEAR', 'PENDING'] as const).map(f => (
                  <button key={f} onClick={() => setPayFilter(f)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs tracking-wider transition-colors ${payFilter === f ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mr-1">Service:</span>
                {(['ALL', 'ON', 'OFF'] as const).map(f => (
                  <button key={f} onClick={() => setSvcFilter(f)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs tracking-wider transition-colors ${svcFilter === f ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-blue-100">
              <Plus size={18} /> Add Client
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-50">
                <th className="px-8 py-6">Client Name</th>
                <th className="px-8 py-6">WhatsApp Phone</th>
                <th className="px-8 py-6 text-center">Family</th>
                <th className="px-8 py-6 text-center">Docs</th>
                <th className="px-8 py-6">Payment</th>
                <th className="px-8 py-6">Service</th>
                <th className="px-8 py-6">Added On</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-8 py-16 text-center">
                    <p className="text-gray-400 text-sm">{search ? `No clients found for "${search}"` : 'No clients found.'}</p>
                    {!search && <button onClick={() => setShowAdd(true)} className="mt-3 text-blue-600 font-bold text-sm hover:underline">+ Add your first client</button>}
                  </td>
                </tr>
              )}
              {filtered.map((client) => {
                const totalDocs = client.documents.length + client.familyMembers.reduce((a, m) => a + m.documents.length, 0);
                return (
                  <tr key={client.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-400">{client.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5"><CopyPhone phone={client.phone} /></td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-900 font-bold text-xs">
                        {client.familyMembers.length}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-blue-600">{totalDocs}</td>
                    <td className="px-8 py-5">
                      <button
                        onClick={() => handleTogglePayment(client)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${client.paymentStatus === 'CLEAR' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${client.paymentStatus === 'CLEAR' ? 'bg-green-600' : 'bg-red-500'}`} />
                        {client.paymentStatus}
                      </button>
                    </td>
                    <td className="px-8 py-5">
                      <button onClick={() => handleToggleService(client)} className="text-gray-400 hover:text-blue-600 transition-colors">
                        {client.serviceEnabled ? <ToggleRight size={28} className="text-blue-600" /> : <ToggleLeft size={28} />}
                      </button>
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-400 font-medium">{client.createdAt}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/clients/${client.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="View">
                          <Eye size={17} />
                        </Link>
                        <button onClick={() => setEditClient(client)} className="p-2 text-gray-400 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteId(client.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Delete">
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">
            Showing <span className="text-gray-900 font-bold">{filtered.length}</span> of <span className="text-gray-900 font-bold">{clients.length}</span> clients
          </p>
          {(payFilter !== 'ALL' || svcFilter !== 'ALL' || search) && (
            <button onClick={() => { setPayFilter('ALL'); setSvcFilter('ALL'); setSearch(''); }}
              className="text-xs text-blue-600 font-bold hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </div>
    </>
  );
}
