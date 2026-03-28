'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: string;
};

export type FamilyMember = {
  id: string;
  clientId: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  documents: Document[];
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  documents: Document[];
  familyMembers: FamilyMember[];
};

type Store = {
  clients: Client[];
  addClient: (c: Omit<Client, 'id' | 'createdAt' | 'documents' | 'familyMembers'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addFamilyMember: (clientId: string, m: Omit<FamilyMember, 'id' | 'clientId' | 'documents'>) => void;
  deleteFamilyMember: (clientId: string, memberId: string) => void;
  addDocument: (clientId: string, doc: Omit<Document, 'id' | 'uploadedAt'>, memberId?: string) => void;
  deleteDocument: (clientId: string, docId: string, memberId?: string) => void;
};

const StoreContext = createContext<Store | null>(null);

const SEED: Client[] = [
  {
    id: '1',
    name: 'Prince Sojitra',
    email: 'prince@example.com',
    phone: '+91 98765 43210',
    status: 'ACTIVE',
    createdAt: '2024-01-15',
    documents: [
      { id: 'd1', name: 'Aadhar_Card.pdf', type: 'PDF', size: '1.2 MB', uploadedAt: '2024-03-01', category: 'Identity' },
      { id: 'd2', name: 'PAN_Card.pdf', type: 'PDF', size: '0.8 MB', uploadedAt: '2024-03-05', category: 'Identity' },
    ],
    familyMembers: [
      {
        id: 'fm1',
        clientId: '1',
        name: 'Ravi Sojitra',
        relation: 'Father',
        phone: '+91 98765 11111',
        email: 'ravi@example.com',
        documents: [
          { id: 'fd1', name: 'Ravi_Aadhar.pdf', type: 'PDF', size: '1.1 MB', uploadedAt: '2024-03-10', category: 'Identity' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Anjali Mehta',
    email: 'anjali@example.com',
    phone: '+91 91234 56789',
    status: 'ACTIVE',
    createdAt: '2024-02-10',
    documents: [],
    familyMembers: [],
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vault_clients');
    setClients(saved ? JSON.parse(saved) : SEED);
  }, []);

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('vault_clients', JSON.stringify(clients));
  }, [clients]);

  const addClient: Store['addClient'] = (c) => {
    setClients(prev => [...prev, { ...c, id: uid(), createdAt: new Date().toISOString().slice(0, 10), documents: [], familyMembers: [] }]);
  };

  const updateClient: Store['updateClient'] = (id, data) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteClient: Store['deleteClient'] = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addFamilyMember: Store['addFamilyMember'] = (clientId, m) => {
    setClients(prev => prev.map(c => c.id === clientId
      ? { ...c, familyMembers: [...c.familyMembers, { ...m, id: uid(), clientId, documents: [] }] }
      : c
    ));
  };

  const deleteFamilyMember: Store['deleteFamilyMember'] = (clientId, memberId) => {
    setClients(prev => prev.map(c => c.id === clientId
      ? { ...c, familyMembers: c.familyMembers.filter(m => m.id !== memberId) }
      : c
    ));
  };

  const addDocument: Store['addDocument'] = (clientId, doc, memberId) => {
    const newDoc: Document = { ...doc, id: uid(), uploadedAt: new Date().toISOString().slice(0, 10) };
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      if (memberId) {
        return { ...c, familyMembers: c.familyMembers.map(m => m.id === memberId ? { ...m, documents: [...m.documents, newDoc] } : m) };
      }
      return { ...c, documents: [...c.documents, newDoc] };
    }));
  };

  const deleteDocument: Store['deleteDocument'] = (clientId, docId, memberId) => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      if (memberId) {
        return { ...c, familyMembers: c.familyMembers.map(m => m.id === memberId ? { ...m, documents: m.documents.filter(d => d.id !== docId) } : m) };
      }
      return { ...c, documents: c.documents.filter(d => d.id !== docId) };
    }));
  };

  return (
    <StoreContext.Provider value={{ clients, addClient, updateClient, deleteClient, addFamilyMember, deleteFamilyMember, addDocument, deleteDocument }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
