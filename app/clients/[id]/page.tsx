'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Document, FamilyMember, DOCUMENT_CATEGORIES, ITR_YEARS } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Trash2, FileText, UserPlus, Upload, X, ChevronDown, ChevronUp, Pencil, File, Eye, Edit3, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { UploadDocModal } from '@/components/fileupload/UploadDocModal';
import ViewDocumentModal from '@/components/fileupload/ViewDocumentModal';
import AddMemberModal from '@/components/fileupload/AddMemberModal';
import EditMemberModal from '@/components/fileupload/EditMemberModal';
import DocumentList from '@/components/fileupload/DocumentList';

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
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

type Client = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  paymentStatus: 'CLEAR' | 'PENDING';
  serviceEnabled: boolean;
  createdAt: string;
  documents: Document[];
  familyMembers: FamilyMember[];
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/clients/${id}`);
        setClient(data);
      } catch (error) {
        toast('Failed to load client', 'error');
        router.push('/clients');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClient();
  }, [id, toast, router]);

  const totalDocs = client ? client.documents.length + client.familyMembers.reduce((a, m) => a + m.documents.length, 0) : 0;
  const [tab, setTab] = useState<'documents' | 'family'>('documents');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showUploadClient, setShowUploadClient] = useState(false);
  const [uploadMemberId, setUploadMemberId] = useState<string | null>(null);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [editMember, setEditMember] = useState<FamilyMember | null>(null);
  const [confirmMemberId, setConfirmMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const [editDoc, setEditDoc] = useState<Document | null>(null);

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto text-center py-20">
        <p className="text-gray-400 text-lg">Client not found.</p>
        <Link href="/clients" className="text-blue-600 font-bold mt-4 inline-block">← Back to Clients</Link>
      </div>
    );
  }

  const refreshClient = async () => {
    try {
      const data = await api.get(`/clients/${id}`);
      setClient(data);
    } catch (error) {
      toast('Failed to refresh client data', 'error');
    }
  };

  const handlePaymentToggle = async () => {
    setLoading(true);
    try {
      await api.put(`/clients/${client._id}`, { paymentStatus: client.paymentStatus === 'CLEAR' ? 'PENDING' : 'CLEAR' });
      toast('Payment status updated successfully', 'success');
      await refreshClient();
    } catch (err) {
      toast('Failed to update payment status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = async () => {
    setLoading(true);
    try {
      await api.put(`/clients/${client._id}`, { serviceEnabled: !client.serviceEnabled });
      toast('Service status updated successfully', 'success');
      await refreshClient();
    } catch (err) {
      toast('Failed to update service status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!confirmMemberId) return;
    setLoading(true);
    try {
      await api.delete(`/clients/${client._id}/family/${confirmMemberId}`);
      toast('Family member deleted successfully', 'success');
      setConfirmMemberId(null);
      await refreshClient();
    } catch (err) {
      toast('Failed to delete family member', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showUploadClient && (
        <UploadDocModal
          onClose={() => setShowUploadClient(false)}
          onSave={async (doc) => {
            try {
              if ('file' in doc && doc.file) {
                const formData = new FormData();
                formData.append('file', doc.file);
                formData.append('name', doc.name);
                formData.append('category', doc.category);
                if (doc.itrYear) formData.append('itrYear', doc.itrYear);
                await api.post(`/clients/${client._id}/documents/upload`, formData, true);
              } else {
                await api.post(`/clients/${client._id}/documents`, doc);
              }
              await refreshClient();
            } catch (error) {
              throw error;
            }
          }}
          isFileUpload={true}
        />
      )}

      {uploadMemberId && (
        <UploadDocModal
          onClose={() => setUploadMemberId(null)}
          onSave={async (doc) => {
            try {
              if ('file' in doc && doc.file) {
                const formData = new FormData();
                formData.append('file', doc.file);
                formData.append('name', doc.name);
                formData.append('category', doc.category);
                if (doc.itrYear) formData.append('itrYear', doc.itrYear);
                formData.append('memberId', uploadMemberId);
                await api.post(`/clients/${client._id}/documents/upload`, formData, true);
              } else {
                await api.post(`/clients/${client._id}/documents`, { ...doc, memberId: uploadMemberId });
              }
              await refreshClient();
            } catch (error) {
              throw error;
            }
          }}
          isFileUpload={true}
        />
      )}
      
      {viewDoc && (
        <ViewDocumentModal 
          doc={viewDoc}
          onClose={() => setViewDoc(null)}
        />
      )}
      
      {editDoc && (
        <UploadDocModal
          onClose={() => setEditDoc(null)}
          onSave={async (doc) => {
            try {
              // Check if we need to replace the file
              if (doc.replaceFile && doc.file) {
                // Update with new file
                const formData = new FormData();
                formData.append('file', doc.file);
                if (doc.name) formData.append('name', doc.name);
                if (doc.category) formData.append('category', doc.category);
                if (doc.itrYear) formData.append('itrYear', doc.itrYear);
                await api.put(`/clients/${client._id}/documents/${editDoc._id}`, formData, true);
              } else {
                // Update metadata only
                await api.put(`/clients/${client._id}/documents/${editDoc._id}`, {
                  name: doc.name,
                  category: doc.category,
                  itrYear: doc.itrYear,
                  type: doc.type,
                  size: doc.size
                });
              }
              await refreshClient();
              setEditDoc(null);
            } catch (error) {
              throw error;
            }
          }}
          isFileUpload={true}
          initialData={editDoc}
          isEdit={true}
        />
      )}
      
      {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} onSave={async (m) => {
        await api.post(`/clients/${client._id}/family`, m);
        await refreshClient();
      }} />}

      {editMember && (
        <EditMemberModal
          member={editMember}
          onClose={() => setEditMember(null)}
          onSave={async (data) => {
            // For simplicity, we'll update the local state since member edit doesn't have a direct API
            setClient(prev => prev ? {
              ...prev,
              familyMembers: prev.familyMembers.map(m =>
                m._id === editMember._id ? { ...m, ...data } : m
              )
            } : null);
          }}
        />
      )}
      
      {confirmMemberId && (
        <ConfirmModal
          message="This will permanently delete the family member and all their documents."
          onCancel={() => setConfirmMemberId(null)}
          onConfirm={handleDeleteMember}
        />
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
                  onClick={handlePaymentToggle}
                  disabled={loading}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${client.paymentStatus === 'CLEAR' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'} disabled:opacity-50`}>
                  Payment: {client.paymentStatus}
                </button>
                <button
                  onClick={handleServiceToggle}
                  disabled={loading}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${client.serviceEnabled ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} disabled:opacity-50`}>
                  Service: {client.serviceEnabled ? 'ON' : 'OFF'}
                </button>
                <span className="text-[10px] text-gray-400">Since {client.createdAt}</span>
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
              {/* <button onClick={() => setShowUploadClient(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-colors shadow-lg shadow-blue-100">
                <Plus size={16} /> Upload Document
              </button> */}
            </div>
            <DocumentList
              docs={client.documents}
              onDelete={async (docId) => {
                await api.delete(`/clients/${client._id}/documents/${docId}`);
                await refreshClient();
              }}
              onAdd={() => setShowUploadClient(true)}
              onView={(doc) => setViewDoc(doc)}
              onEdit={(doc) => setEditDoc(doc)}
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
              <motion.div key={member._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
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
                    <button onClick={() => setExpandedMember(expandedMember === member._id ? null : member._id)}
                      className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                      {expandedMember === member._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <button onClick={() => setEditMember(member)} className="p-2 text-gray-400 hover:text-indigo-500 transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setConfirmMemberId(member._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {expandedMember === member._id && (
                  <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                    <DocumentList
                      docs={member.documents}
                      onDelete={async (docId) => {
                        await api.delete(`/clients/${client._id}/documents/${docId}/${member._id}`);
                        await refreshClient();
                      }}
                      onAdd={() => setUploadMemberId(member._id)}
                      onView={(doc) => setViewDoc(doc)}
                      onEdit={(doc) => setEditDoc(doc)}
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