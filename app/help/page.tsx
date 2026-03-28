'use client';

import React from 'react';
import { 
  HelpCircle, 
  Book, 
  MessageSquare, 
  Shield, 
  FileText, 
  Search,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

const categories = [
  { icon: Shield, title: 'Security & Encryption', description: 'Learn about our military-grade archival protocols.' },
  { icon: FileText, title: 'Document Management', description: 'How to classify, tag, and archive your records.' },
  { icon: Book, title: 'User Guides', description: 'Step-by-step tutorials for all system features.' },
  { icon: MessageSquare, title: 'Support Tickets', description: 'Get direct assistance from our archival experts.' },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
          <HelpCircle size={32} />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">How can we help you?</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Search our knowledge base or browse categories below to find answers to your questions about The Vault.
        </p>
        
        <div className="mt-10 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for articles, guides, and more..." 
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors mb-6">
              <cat.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{cat.description}</p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              Explore Articles
              <ChevronRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-[40px] p-10 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Still need assistance?</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Our dedicated support team is available 24/7 for enterprise clients. Reach out directly for priority support.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
          Contact Support Team
        </button>
      </div>
    </div>
  );
}
