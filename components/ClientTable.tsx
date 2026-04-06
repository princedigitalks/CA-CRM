'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Eye, ToggleLeft, ToggleRight, Search, X, Pencil, Copy, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import { Client } from '@/lib/store';
import { api } from '@/lib/api';
import { useToast } from './Toast';
import PhoneInput from './PhoneInput';

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

function AddClientModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', paymentStatus: 'PENDING' as Client['paymentStatus'], serviceEnabled: true });
  const [loading, setLoading] = useState(false);
  useEscClose(onClose);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setLoading(true);
    try {
      await api.post('/clients', form);
      toast('Client added successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast('Failed to add client', 'error');
    } finally {
      setLoading(false);
    }
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
            <PhoneInput
              value={form.phone}
              onChange={(value) => setForm(p => ({ ...p, phone: value }))}
              placeholder="Enter 10 digit mobile number"
              required
            />
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
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditClientModal({ client, onClose, onSuccess }: { client: Client; onClose: () => void; onSuccess: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: client.name, email: client.email, phone: client.phone, paymentStatus: client.paymentStatus, serviceEnabled: client.serviceEnabled });
  const [loading, setLoading] = useState(false);
  useEscClose(onClose);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setLoading(true);
    try {
      await api.put(`/clients/${client._id}`, form);
      toast('Client updated successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast('Failed to update client', 'error');
    } finally {
      setLoading(false);
    }
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
            <PhoneInput
              value={form.phone}
              onChange={(value) => setForm(p => ({ ...p, phone: value }))}
              placeholder="Enter 10 digit mobile number"
              required
            />
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
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
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

function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];

  if (currentPage > 3) pages.push('...');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (currentPage < totalPages - 2) pages.push('...');

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export function ClientTable() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const [payFilter, setPayFilter] = useState<'ALL' | 'CLEAR' | 'PENDING'>('ALL');
  const [svcFilter, setSvcFilter] = useState<'ALL' | 'ON' | 'OFF'>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [payFilter, svcFilter]);

  // Fetch clients from API with pagination params
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      if (payFilter !== 'ALL') params.set('paymentStatus', payFilter);
      if (svcFilter !== 'ALL') params.set('serviceEnabled', svcFilter === 'ON' ? 'true' : 'false');

      const data = await api.get(`/clients?${params.toString()}`);
      setClients(data.clients);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast('Failed to fetch clients', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, payFilter, svcFilter, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleTogglePayment = useCallback(async (client: Client) => {
    const next = client.paymentStatus === 'CLEAR' ? 'PENDING' : 'CLEAR';
    try {
      await api.put(`/clients/${client._id}`, { paymentStatus: next });
      toast(`Payment set to ${next} for ${client.name}`);
      fetchClients();
    } catch (err) {
      toast('Failed to update payment status', 'error');
    }
  }, [fetchClients, toast]);

  const handleToggleService = useCallback(async (client: Client) => {
    const next = !client.serviceEnabled;
    try {
      await api.put(`/clients/${client._id}`, { serviceEnabled: next });
      toast(`Service ${next ? 'enabled' : 'disabled'} for ${client.name}`);
      fetchClients();
    } catch (err) {
      toast('Failed to update service status', 'error');
    }
  }, [fetchClients, toast]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <>
      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} onSuccess={fetchClients} />}
      {editClient && <EditClientModal client={editClient} onClose={() => setEditClient(null)} onSuccess={fetchClients} />}
      {deleteId && (
        <ConfirmModal
          message="This will permanently delete the client and all their data."
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            const name = clients.find(c => c._id === deleteId)?.name;
            setDeleting(deleteId);
            try {
              await api.delete(`/clients/${deleteId}`);
              setDeleteId(null);
              toast(`${name} deleted`, 'error');
              fetchClients();
            } catch (err) {
              toast('Failed to delete client', 'error');
            } finally {
              setDeleting(null);
            }
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
              {loading && (
                <tr>
                  <td colSpan={8} className="px-8 py-16 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span className="text-blue-600 text-sm font-medium">Loading clients...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && clients.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-8 py-16 text-center">
                    <p className="text-gray-400 text-sm">{debouncedSearch ? `No clients found for "${debouncedSearch}"` : 'No clients found.'}</p>
                    {!debouncedSearch && <button onClick={() => setShowAdd(true)} className="mt-3 text-blue-600 font-bold text-sm hover:underline">+ Add your first client</button>}
                  </td>
                </tr>
              )}
              {!loading && clients.map((client) => {
                const totalDocs = client.documents.length + client.familyMembers.reduce((a, m) => a + m.documents.length, 0);
                return (
                  <tr key={client._id} className="group hover:bg-gray-50/50 transition-colors">
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
                        <Link href={`/clients/${client._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" title="View">
                          <Eye size={17} />
                        </Link>
                        <button onClick={() => setEditClient(client)} className="p-2 text-gray-400 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteId(client._id)} disabled={deleting === client._id} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50" title="Delete">
                          {deleting === client._id ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">
            {loading ? (
              <span className="text-blue-600">Loading...</span>
            ) : totalItems === 0 ? (
              <span>No clients</span>
            ) : (
              <>
                Showing <span className="text-gray-900 font-bold">{startItem}–{endItem}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> clients
              </>
            )}
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* First page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="First page"
              >
                <ChevronsLeft size={16} />
              </button>
              {/* Previous */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page numbers */}
              {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                page === '...' ? (
                  <span key={`dots-${idx}`} className="px-2 text-gray-300 text-sm select-none">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`min-w-[36px] h-9 rounded-lg text-sm font-bold transition-colors ${currentPage === page
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                      } disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
              {/* Last page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Last page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          )}

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
