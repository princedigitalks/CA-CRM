'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, Document, FamilyMember, DOCUMENT_CATEGORIES, ITR_YEARS } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Plus, Trash2, UserPlus, Upload, X, 
  ChevronDown, ChevronUp, Pencil, File, Eye, Edit3, Download, 
  RefreshCw, FileImage, FileSpreadsheet, FileArchive, 
  FileCode, FileCheck, FileSignature, FileBadge
} from 'lucide-react';
import Link from 'next/link';
import { UploadDocModal } from '@/components/fileupload/UploadDocModal';
import Image from 'next/image';

// PDF Icon Component
const PdfIcon = ({ size = 48, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M19 11C19 10.1825 19 9.4306 18.8478 9.06306C18.6955 8.69552 18.4065 8.40649 17.8284 7.82843L13.0919 3.09188C12.593 2.593 12.3436 2.34355 12.0345 2.19575C11.9702 2.165 11.9044 2.13772 11.8372 2.11401C11.5141 2 11.1614 2 10.4558 2C7.21082 2 5.58831 2 4.48933 2.88607C4.26731 3.06508 4.06508 3.26731 3.88607 3.48933C3 4.58831 3 6.21082 3 9.45584V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H19M12 2.5V3C12 5.82843 12 7.24264 12.8787 8.12132C13.7574 9 15.1716 9 18 9H18.5" />
    <path d="M21 14H19C18.4477 14 18 14.4477 18 15V16.5M18 16.5V19M18 16.5H20.5M7 19V17M7 17V14H8.5C9.32843 14 10 14.6716 10 15.5C10 16.3284 9.32843 17 8.5 17H7ZM12.5 14H13.7857C14.7325 14 15.5 14.7462 15.5 15.6667V17.3333C15.5 18.2538 14.7325 19 13.7857 19H12.5V14Z" />
  </svg>
);

// Function to get appropriate icon based on document type and extension
const getDocumentIcon = (doc: Document, size: number = 48) => {
  const extension = doc.name.split('.').pop()?.toLowerCase();
  const type = doc.type;
  
  // PDF files - using custom SVG icon
  if (type === 'PDF' || extension === 'pdf') {
    return <PdfIcon size={size} className="text-red-500" />;
  }
  
  // Image files
  if (type === 'Image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '')) {
    return <FileImage size={size} className="text-purple-500" />;
  }
  
  // Word documents
  if (type === 'Word' || ['doc', 'docx'].includes(extension || '')) {
    return <FileSignature size={size} className="text-blue-500" />;
  }
  
  // Excel spreadsheets
  if (type === 'Excel' || ['xls', 'xlsx', 'csv'].includes(extension || '')) {
    return <FileSpreadsheet size={size} className="text-green-500" />;
  }
  
  // Text files
  if (extension === 'txt') {
    return <FileCode size={size} className="text-gray-500" />;
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
    return <FileArchive size={size} className="text-yellow-500" />;
  }
  
  // Default file icon
  return <File size={size} className="text-gray-400" />;
};

// Function to check if document is an image
const isImageDocument = (doc: Document) => {
  const extension = doc.name.split('.').pop()?.toLowerCase();
  return doc.type === 'Image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '');
};

// Enhanced Document View Modal
export default function ViewDocumentModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!doc.filePath) {
      toast('No file available for download', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000'}${doc.filePath}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast('Download started', 'success');
    } catch (error) {
      toast('Failed to download file', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Get full image URL
  const getImageUrl = () => {
    return `${process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000'}${doc.filePath}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Document Details</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Document Preview Section */}
          <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-8 min-h-[300px]">
            {isImageDocument(doc) && !imageError ? (
              <div className="relative w-full max-h-[400px] flex items-center justify-center">
                <img
                  src={getImageUrl()}
                  alt={doc.name}
                  className="max-w-full max-h-[400px] object-contain rounded-lg"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-2xl bg-blue-50 flex items-center justify-center">
                  {getDocumentIcon(doc, 64)}
                </div>
                <p className="text-sm text-gray-500">
                  {imageError ? 'Unable to load image preview' : 'Preview not available'}
                </p>
              </div>
            )}
          </div>

          {/* Document Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Document Name
                </p>
                <p className="text-base font-bold text-gray-900 break-words">
                  {doc.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Category
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {doc.category}{doc.itrYear ? ` · ITR ${doc.itrYear}` : ''}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Type
                </p>
                <p className="text-sm font-medium text-gray-900">{doc.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Size
                </p>
                <p className="text-sm font-medium text-gray-900">{doc.size}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Uploaded At
                </p>
                <p className="text-sm font-medium text-gray-900">{doc.uploadedAt}</p>
              </div>
            </div>

            {doc.itrYear && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  ITR Year
                </p>
                <p className="text-sm font-medium text-gray-900">{doc.itrYear}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            {doc.filePath && (
              <>
                {isImageDocument(doc) && !imageError ? (
                  <a
                    href={getImageUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={16} /> View Full Size
                  </a>
                ) : (
                  <a
                    href={`${process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000'}${doc.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={16} /> View File
                  </a>
                )}
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700" />
                  ) : (
                    <>
                      <Download size={16} /> Download
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}