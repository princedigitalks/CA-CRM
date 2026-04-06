'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, Document, FamilyMember, DOCUMENT_CATEGORIES, ITR_YEARS } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Plus, Trash2, FileText, UserPlus, Upload, X, 
  ChevronDown, ChevronUp, Pencil, File, Eye, Edit3, Download, 
  RefreshCw, FileImage, FileSpreadsheet, FileArchive, 
  FileCode, FileCheck, FileSignature, FileBadge, 
  IdCard, FileBox, FolderOpen
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function ConfirmModal({ message, title, onConfirm, onCancel }: { message: string; title?: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
      >
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title || 'Are you sure?'}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// Function to get appropriate icon based on document type and extension
const getDocumentIcon = (doc: Document) => {
  const extension = doc.name.split('.').pop()?.toLowerCase();
  const type = doc.type;
  
  // Image files
  if (type === 'Image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '')) {
    return null; // Return null for images as we'll show preview
  }
  
  // PDF files
  if (type === 'PDF' || extension === 'pdf') {
    return <FileText size={20} className="text-red-500" />;
  }
  
  // Word documents
  if (type === 'Word' || ['doc', 'docx'].includes(extension || '')) {
    return <FileSignature size={20} className="text-blue-500" />;
  }
  
  // Excel spreadsheets
  if (type === 'Excel' || ['xls', 'xlsx', 'csv'].includes(extension || '')) {
    return <FileSpreadsheet size={20} className="text-green-500" />;
  }
  
  // Text files
  if (extension === 'txt') {
    return <FileCode size={20} className="text-gray-500" />;
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
    return <FileArchive size={20} className="text-yellow-500" />;
  }
  
  // Default file icon
  return <File size={20} className="text-gray-400" />;
};

// Function to check if document is an image
const isImageDocument = (doc: Document) => {
  const extension = doc.name.split('.').pop()?.toLowerCase();
  return doc.type === 'Image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '');
};

// Small Document Preview Component for sublist
function SmallDocumentPreview({ doc, onView }: { doc: Document; onView?: (doc: Document) => void }) {
  const [imageError, setImageError] = useState(false);
  
  if (isImageDocument(doc) && !imageError) {
    return (
      <div 
        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0"
        onClick={() => onView?.(doc)}
      >
        <img
          src={process.env.NEXT_PUBLIC_IMAGE_URL + doc.filePath}
          alt={doc.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }
  
  // Show icon for non-image documents
  return (
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
      {getDocumentIcon(doc)}
    </div>
  );
}

// Document Preview Component for main list
function DocumentPreview({ doc, onView }: { doc: Document; onView?: (doc: Document) => void }) {
  const [imageError, setImageError] = useState(false);
  
  if (isImageDocument(doc) && !imageError) {
    return (
      <div 
        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => onView?.(doc)}
      >
        <img
          src={process.env.NEXT_PUBLIC_IMAGE_URL + doc.filePath}
          alt={doc.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }
  
  // Show icon for non-image documents
  return (
    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
      {getDocumentIcon(doc)}
    </div>
  );
}

// Enhanced Document List Component
export default function DocumentList({
  docs,
  onDelete,
  onAdd,
  onEdit,
  onView
}: {
  docs: Document[];
  onDelete: (id: string) => Promise<void>;
  onAdd: () => void;
  onEdit?: (doc: Document) => void;
  onView?: (doc: Document) => void;
}) {
  const [confirmDocId, setConfirmDocId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Group Aadhaar Card documents
  const groupedDocs = React.useMemo(() => {
    const aadharDocs = docs.filter(doc => doc.category === 'Aadhaar Card');
    const otherDocs = docs.filter(doc => doc.category !== 'Aadhaar Card');

    const aadharGroups: { [key: string]: Document[] } = {};

    aadharDocs.forEach(doc => {
      const baseName = doc.name.replace(/ - (Front|Back)$/, '');
      if (!aadharGroups[baseName]) {
        aadharGroups[baseName] = [];
      }
      aadharGroups[baseName].push(doc);
    });

    const groupedAadhar = Object.values(aadharGroups).map(group => ({
      isGroup: true,
      baseName: group[0].name.replace(/ - (Front|Back)$/, ''),
      docs: group,
      id: group[0]._id // Use first doc's ID for group
    }));

    return [...groupedAadhar, ...otherDocs.map(doc => ({ isGroup: false, doc }))];
  }, [docs]);

  const handleDelete = async () => {
    if (!confirmDocId) return;
    setDeleting(true);
    try {
      // Check if this is an Aadhar group
      const group = groupedDocs.find(item => item.isGroup && item.id === confirmDocId) as any;
      if (group) {
        // Delete all documents in the group
        await Promise.all(group.docs.map((doc: Document) => onDelete(doc._id)));
      } else {
        await onDelete(confirmDocId);
      }
      setConfirmDocId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {confirmDocId && (
        <ConfirmModal
          title={
            groupedDocs.find(item => item.isGroup && item.id === confirmDocId)
              ? 'Delete Aadhaar Card Documents?'
              : 'Delete Document?'
          }
          message={
            groupedDocs.find(item => item.isGroup && item.id === confirmDocId)
              ? 'This will delete both front and back side documents. This action cannot be undone.'
              : 'This action cannot be undone.'
          }
          onConfirm={handleDelete}
          onCancel={() => setConfirmDocId(null)}
        />
      )}
      
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-500">{docs.length} document{docs.length !== 1 ? 's' : ''}</p>
        <button 
          onClick={onAdd} 
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-xl transition-colors"
        >
          <Upload size={14} /> Upload
        </button>
      </div>
      
      {docs.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl">
          <FileText size={32} className="mx-auto mb-2 text-gray-300" />
          No documents yet. Click Upload to add.
        </div>
      ) : (
        <div className="space-y-2">
          {groupedDocs.map((item) => {
            if (item.isGroup) {
              // Render Aadhaar Card group with image previews
              const { baseName, docs: groupDocs } = item as any;
              return (
                <div key={item.id} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{baseName}</p>
                      <p className="text-[10px] text-gray-400">
                        Aadhaar Card · {groupDocs.length} files
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setConfirmDocId(item.id)}
                        disabled={deleting && confirmDocId === item.id}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                        title="Delete all"
                      >
                        {deleting && confirmDocId === item.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 ml-0">
                    {groupDocs.map((doc: Document) => (
                      <div key={doc._id} className="flex items-center gap-2 text-xs">
                        <SmallDocumentPreview doc={doc} onView={onView} />
                        <span className="text-gray-500 w-12">{doc.name.includes('Front') ? 'Front' : 'Back'}</span>
                        <span className="text-gray-400">· {doc.size} · {doc.uploadedAt}</span>
                        <div className="flex items-center gap-1 ml-auto">
                          {onView && (
                            <button
                              onClick={() => onView(doc)}
                              className="p-1 text-gray-400 hover:text-blue-500 transition-all"
                              title="View"
                            >
                              <Eye size={12} />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(doc)}
                              className="p-1 text-gray-400 hover:text-indigo-500 transition-all"
                              title="Edit"
                            >
                              <Edit3 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else {
              // Render regular document
              const doc = (item as any).doc;
              return (
                <div key={doc._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                  <DocumentPreview doc={doc} onView={onView} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {doc.category}{doc.itrYear ? ` · ITR ${doc.itrYear}` : ''} · {doc.type} · {doc.size} · {doc.uploadedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {onView && (
                      <button
                        onClick={() => onView(doc)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-500 transition-all"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(doc)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-indigo-500 transition-all"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDocId(doc._id)}
                      disabled={deleting && confirmDocId === doc._id}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting && confirmDocId === doc._id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}