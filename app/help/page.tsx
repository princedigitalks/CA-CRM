'use client';

import React, { useState } from 'react';
import { HelpCircle, Book, MessageSquare, Shield, FileText, Search, ChevronRight, X } from 'lucide-react';
import { motion } from 'motion/react';

const categories = [
  {
    icon: Shield,
    title: 'Security & Encryption',
    description: 'Learn about how client data and documents are protected in The Vault.',
    details: 'All documents are stored securely. Access is restricted to registered WhatsApp numbers only. Payment status controls document access via the chatbot.',
  },
  {
    icon: FileText,
    title: 'Document Management',
    description: 'How to upload, classify, and manage client documents.',
    details: 'Supported categories: PAN Card, Aadhaar Card, GST Certificate, Udyam Certificate, ITR (year-wise), and Other. Upload PDFs or images per client or family member.',
  },
  {
    icon: Book,
    title: 'User Guides',
    description: 'Step-by-step tutorials for all admin panel features.',
    details: 'Use the Clients page to add clients, manage family members, upload documents, and toggle payment/service status. The dashboard gives a quick overview of all activity.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Chatbot',
    description: 'How the WhatsApp chatbot works for your clients.',
    details: 'When a client sends "Hi", the bot asks for language preference, verifies their number, checks payment status, then shows family members and their documents. ITR documents are shown year-wise.',
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = categories.filter(c =>
    query.trim() === '' ||
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase()) ||
    c.details.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
          <HelpCircle size={32} />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">How can we help you?</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Search our knowledge base or browse categories below to find answers about The Vault.
        </p>

        <div className="mt-10 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for articles, guides, and more..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-10 text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 text-sm mb-16">No results found for "{query}"</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filtered.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            onClick={() => setExpanded(expanded === cat.title ? null : cat.title)}
          >
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors mb-6">
              <cat.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{cat.description}</p>

            {expanded === cat.title && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-700 bg-blue-50 rounded-xl p-4 mb-4 leading-relaxed"
              >
                {cat.details}
              </motion.p>
            )}

            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              {expanded === cat.title ? 'Show Less' : 'Read More'}
              <ChevronRight size={14} className={`transition-transform ${expanded === cat.title ? 'rotate-90' : ''}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-[40px] p-10 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Still need assistance?</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Our dedicated support team is available during business hours. Reach out directly for priority support.
        </p>
        <a
          href="mailto:support@thevault.in"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20"
        >
          Contact Support Team
        </a>
      </div>
    </div>
  );
}
