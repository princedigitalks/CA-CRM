'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './api';

export const DOCUMENT_CATEGORIES = ['PAN Card', 'Aadhaar Card', 'GST Certificate', 'Udyam Certificate', 'ITR', 'Other'] as const;
export type DocumentCategory = string; // Now allows custom categories from masters

export const ITR_YEARS = ['2024-25', '2023-24', '2022-23', '2021-22'] as const;
export type ItrYear = string; // Now dynamic - fetched from backend

export type Document = {
  _id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: DocumentCategory;
  itrYear?: ItrYear;
  filePath?: string;
};

export type FamilyMember = {
  _id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  documents: Document[];
};

export type Master = {
  _id: string;
  name: string;
  type: 'relation' | 'category' | 'status' | 'other';
  isActive: boolean;
  createdAt: string;
};

export type Client = {
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

type Store = {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (c: Omit<Client, '_id' | 'createdAt' | 'documents' | 'familyMembers'>) => Promise<void>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addFamilyMember: (clientId: string, m: Omit<FamilyMember, '_id' | 'documents'>) => Promise<void>;
  deleteFamilyMember: (clientId: string, memberId: string) => Promise<void>;
  addDocument: (clientId: string, doc: Omit<Document, '_id' | 'uploadedAt'>, memberId?: string) => Promise<void>;
  uploadDocument: (clientId: string, file: File, data: { name: string; category: DocumentCategory; itrYear?: ItrYear }, memberId?: string) => Promise<void>;
  updateDocument: (clientId: string, docId: string, data: { name?: string; category?: DocumentCategory; itrYear?: ItrYear; type?: string; size?: string }, memberId?: string) => Promise<void>;
  updateDocumentWithFile: (clientId: string, docId: string, file: File, data: { name?: string; category?: DocumentCategory; itrYear?: ItrYear; type?: string; size?: string }, memberId?: string) => Promise<void>;
  deleteDocument: (clientId: string, docId: string, memberId?: string) => Promise<void>;
  findByPhone: (phone: string) => Client | undefined;

  // Master functions
  getMasters: (type?: string) => Promise<Master[]>;
  createMaster: (master: Omit<Master, '_id' | 'createdAt' | 'isActive'>) => Promise<Master>;
  updateMaster: (id: string, master: Partial<Master>) => Promise<Master>;
  deleteMaster: (id: string) => Promise<void>;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/clients?limit=9999');
      setClients(data.clients || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = async (c: Omit<Client, '_id' | 'createdAt' | 'documents' | 'familyMembers'>) => {
    try {
      const newClient = await api.post('/clients', c);
      setClients(prev => [newClient, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add client');
      throw err;
    }
  };

  const updateClient = async (id: string, data: Partial<Client>) => {
    try {
      const updated = await api.put(`/clients/${id}`, data);
      setClients(prev => prev.map(c => c._id === id ? updated : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client');
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await api.delete(`/clients/${id}`);
      setClients(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client');
      throw err;
    }
  };

  const addFamilyMember = async (clientId: string, m: Omit<FamilyMember, '_id' | 'documents'>) => {
    try {
      const updated = await api.post(`/clients/${clientId}/family`, m);
      setClients(prev => prev.map(c => c._id === clientId ? updated : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add family member');
      throw err;
    }
  };

  const deleteFamilyMember = async (clientId: string, memberId: string) => {
    try {
      const updated = await api.delete(`/clients/${clientId}/family/${memberId}`);
      setClients(prev => prev.map(c => c._id === clientId ? updated : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete family member');
      throw err;
    }
  };

  const addDocument = async (clientId: string, doc: Omit<Document, '_id' | 'uploadedAt'>, memberId?: string) => {
    try {
      const body = memberId ? { ...doc, memberId } : doc;
      const updated = await api.post(`/clients/${clientId}/documents`, body);
      setClients(prev => prev.map(c => c._id === clientId ? updated : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add document');
      throw err;
    }
  };

  const uploadDocument = async (clientId: string, file: File, data: { name: string; category: DocumentCategory; itrYear?: ItrYear }, memberId?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', data.name);
      formData.append('category', data.category);
      if (data.itrYear) formData.append('itrYear', data.itrYear);
      if (memberId) formData.append('memberId', memberId);
      
      const updated = await api.post(`/clients/${clientId}/documents/upload`, formData, true);
      setClients(prev => prev.map(c => c._id === clientId ? updated : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      throw err;
    }
  };

  const updateDocument = async (clientId: string, docId: string, data: { name?: string; category?: DocumentCategory; itrYear?: ItrYear }, memberId?: string) => {
    try {
      const endpoint = memberId 
        ? `/clients/${clientId}/documents/${docId}/${memberId}` 
        : `/clients/${clientId}/documents/${docId}`;
      const updated = await api.put(endpoint, data);
      setClients(prev => prev.map(c => c._id === clientId ? updated : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
      throw err;
    }
  };

  const updateDocumentWithFile = async (clientId: string, docId: string, file: File, data: { name?: string; category?: DocumentCategory; itrYear?: ItrYear; type?: string; size?: string }, memberId?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (data.name) formData.append('name', data.name);
      if (data.category) formData.append('category', data.category);
      if (data.itrYear) formData.append('itrYear', data.itrYear);
      
      const endpoint = memberId 
        ? `/clients/${clientId}/documents/${docId}/${memberId}` 
        : `/clients/${clientId}/documents/${docId}`;
      const updated = await api.put(endpoint, formData, true);
      setClients(prev => prev.map(c => c._id === clientId ? updated : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
      throw err;
    }
  };

  const deleteDocument = async (clientId: string, docId: string, memberId?: string) => {
    try {
      const endpoint = memberId 
        ? `/clients/${clientId}/documents/${docId}/${memberId}` 
        : `/clients/${clientId}/documents/${docId}`;
      const updated = await api.delete(endpoint);
      setClients(prev => prev.map(c => c._id === clientId ? updated : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      throw err;
    }
  };

  const findByPhone = (phone: string) => {
    const normalized = phone.replace(/\s+/g, '');
    return clients.find(c => c.phone.replace(/\s+/g, '') === normalized);
  };

  // Master functions
  const getMasters = async (type?: string) => {
    const params = type ? `?type=${type}` : '';
    return await api.get(`/masters${params}`);
  };

  const createMaster = async (master: Omit<Master, '_id' | 'createdAt' | 'isActive'>) => {
    return await api.post('/masters', master);
  };

  const updateMaster = async (id: string, master: Partial<Master>) => {
    return await api.put(`/masters/${id}`, master);
  };

  const deleteMaster = async (id: string) => {
    return await api.delete(`/masters/${id}`);
  };

  return (
    <StoreContext.Provider value={{
      clients,
      loading,
      error,
      fetchClients,
      addClient,
      updateClient,
      deleteClient,
      addFamilyMember,
      deleteFamilyMember,
      addDocument,
      uploadDocument,
      updateDocument,
      updateDocumentWithFile,
      deleteDocument,
      findByPhone,
      getMasters,
      createMaster,
      updateMaster,
      deleteMaster
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}