// 'use client';

// import React, { useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useStore, Document, FamilyMember, DOCUMENT_CATEGORIES, ITR_YEARS } from '@/lib/store';
// import { useToast } from '@/components/Toast';
// import { motion } from 'motion/react';
// import { ArrowLeft, Plus, Trash2, FileText, UserPlus, Upload, X, ChevronDown, ChevronUp, Pencil, File, Eye, Edit3, Download, RefreshCw } from 'lucide-react';
// import Link from 'next/link';

// export function UploadDocModal({ 
//   onClose, 
//   onSave, 
//   isFileUpload = true, 
//   initialData,
//   isEdit = false 
// }: { 
//   onClose: () => void; 
//   onSave: (doc: any) => Promise<void>; 
//   isFileUpload?: boolean; 
//   initialData?: Document;
//   isEdit?: boolean;
// }) {
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [replaceFile, setReplaceFile] = useState(false);
//   const [form, setForm] = useState<{ 
//     name: string; 
//     type: string; 
//     size: string; 
//     category: Document['category']; 
//     itrYear?: Document['itrYear'] 
//   }>({
//     name: initialData?.name || '', 
//     type: initialData?.type || 'PDF', 
//     size: initialData?.size || '', 
//     category: initialData?.category || 'PAN Card', 
//     itrYear: initialData?.itrYear,
//   });
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       // Validate file size (max 10MB)
//       if (selectedFile.size > 10 * 1024 * 1024) {
//         toast('File size should be less than 10MB', 'error');
//         return;
//       }

//       setFile(selectedFile);
//       const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
//       const fileExtension = selectedFile.name.split('.').pop()?.toUpperCase() || 'Unknown';
//       const fileType = getFileType(selectedFile.type, fileExtension);

//       setForm(p => ({ 
//         ...p, 
//         name: selectedFile.name,
//         size: fileSizeMB + ' MB',
//         type: fileType
//       }));

//       // Create preview for images
//       if (selectedFile.type.startsWith('image/')) {
//         const url = URL.createObjectURL(selectedFile);
//         setPreviewUrl(url);
//       } else {
//         setPreviewUrl(null);
//       }
//     }
//   };

//   const getFileType = (mimeType: string, extension: string): string => {
//     if (mimeType.includes('pdf')) return 'PDF';
//     if (mimeType.includes('image')) return 'Image';
//     if (mimeType.includes('word') || extension === 'DOC' || extension === 'DOCX') return 'Word';
//     if (mimeType.includes('excel') || extension === 'XLS' || extension === 'XLSX') return 'Excel';
//     return 'Other';
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.name.trim()) {
//       toast('Document name is required', 'error');
//       return;
//     }

//     if (form.category === 'ITR' && !form.itrYear) {
//       toast('ITR year is required for ITR documents', 'error');
//       return;
//     }

//     // For edit mode with file replacement
//     if (isEdit && replaceFile && !file) {
//       toast('Please select a new file to replace the current one', 'error');
//       return;
//     }

//     // For new upload mode
//     if (!isEdit && isFileUpload && !file) {
//       toast('Please select a file to upload', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       if (isFileUpload && (file || (isEdit && replaceFile && file))) {
//         // Upload new file (for both new uploads and file replacement in edit)
//         await onSave({ 
//           file, 
//           name: form.name, 
//           category: form.category, 
//           itrYear: form.itrYear,
//           type: form.type,
//           size: form.size,
//           replaceFile: true // Flag to indicate file replacement
//         });
//       } else {
//         // Update metadata only (no file change)
//         await onSave({ 
//           ...form, 
//           size: form.size || 'N/A',
//           name: form.name,
//           category: form.category,
//           itrYear: form.itrYear,
//           replaceFile: false
//         });
//       }
//       toast(isEdit ? 'Document updated successfully' : 'Document uploaded successfully', 'success');
//       onClose();
//     } catch (err: any) {
//       toast(err.message || 'Failed to save document', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cleanup preview URL on unmount
//   React.useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-bold text-gray-900">
//             {isEdit ? 'Edit Document' : (isFileUpload ? 'Upload File' : 'Add Document Details')}
//           </h3>
//           <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
//         </div>

//         <form onSubmit={submit} className="space-y-4">
//           {/* File upload section - shows differently for edit mode */}
//           {(isFileUpload && !isEdit) && (
//             <div>
//               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select File *</label>
//               <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
//                 <input 
//                   type="file" 
//                   onChange={handleFileChange} 
//                   accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" 
//                   className="hidden" 
//                   id="file-input" 
//                 />
//                 <label htmlFor="file-input" className="cursor-pointer block">
//                   {file ? (
//                     <div className="space-y-2">
//                       <File size={32} className="text-blue-600 mx-auto" />
//                       <p className="text-sm font-medium text-gray-900">{file.name}</p>
//                       <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//                       {previewUrl && (
//                         <div className="mt-2">
//                           <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div>
//                       <Upload size={32} className="text-gray-400 mx-auto mb-2" />
//                       <p className="text-sm text-gray-500">Click to select file</p>
//                       <p className="text-xs text-gray-400 mt-1">PDF, Images, Word, Excel (Max 10MB)</p>
//                     </div>
//                   )}
//                 </label>
//               </div>
//             </div>
//           )}

//           {/* Edit mode file replacement option */}
//           {isEdit && isFileUpload && (
//             <div className="space-y-3">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="replace-file"
//                   checked={replaceFile}
//                   onChange={(e) => {
//                     setReplaceFile(e.target.checked);
//                     if (!e.target.checked) {
//                       setFile(null);
//                       setPreviewUrl(null);
//                     }
//                   }}
//                   className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                 />
//                 <label htmlFor="replace-file" className="text-sm font-medium text-gray-700">
//                   Replace current file with a new one
//                 </label>
//               </div>

//               {replaceFile && (
//                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
//                   <input 
//                     type="file" 
//                     onChange={handleFileChange} 
//                     accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" 
//                     className="hidden" 
//                     id="edit-file-input" 
//                   />
//                   <label htmlFor="edit-file-input" className="cursor-pointer block">
//                     {file ? (
//                       <div className="space-y-2">
//                         <File size={32} className="text-blue-600 mx-auto" />
//                         <p className="text-sm font-medium text-gray-900">{file.name}</p>
//                         <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//                         {previewUrl && (
//                           <div className="mt-2">
//                             <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div>
//                         <RefreshCw size={32} className="text-gray-400 mx-auto mb-2" />
//                         <p className="text-sm text-gray-500">Click to select new file</p>
//                         <p className="text-xs text-gray-400 mt-1">PDF, Images, Word, Excel (Max 10MB)</p>
//                       </div>
//                     )}
//                   </label>
//                 </div>
//               )}

//               {!replaceFile && initialData && (
//                 <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
//                   <FileText size={20} className="text-gray-400" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">{initialData.name}</p>
//                     <p className="text-xs text-gray-500">Current file will remain unchanged</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           <div>
//             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Name *</label>
//             <input 
//               value={form.name} 
//               onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
//               className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" 
//               placeholder="e.g. Aadhar_Card.pdf" 
//               required 
//             />
//           </div>

//           {(!isFileUpload || (isEdit && !replaceFile)) && (
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
//                 <select 
//                   value={form.type} 
//                   onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
//                   className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
//                 >
//                   {['PDF', 'Image', 'Word', 'Excel', 'Other'].map(t => <option key={t}>{t}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
//                 <select 
//                   value={form.category} 
//                   onChange={e => setForm(p => ({ ...p, category: e.target.value as Document['category'], itrYear: undefined }))}
//                   className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
//                 >
//                   {DOCUMENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
//                 </select>
//               </div>
//             </div>
//           )}

//           {isFileUpload && !isEdit && (
//             <div>
//               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
//               <select 
//                 value={form.category} 
//                 onChange={e => setForm(p => ({ ...p, category: e.target.value as Document['category'], itrYear: undefined }))}
//                 className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
//               >
//                 {DOCUMENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
//               </select>
//             </div>
//           )}

//           {form.category === 'ITR' && (
//             <div>
//               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ITR Year *</label>
//               <select 
//                 value={form.itrYear ?? ''} 
//                 onChange={e => setForm(p => ({ ...p, itrYear: e.target.value as Document['itrYear'] }))}
//                 className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" 
//                 required
//               >
//                 <option value="">Select Year</option>
//                 {ITR_YEARS.map(y => <option key={y} value={y}>ITR {y}</option>)}
//               </select>
//             </div>
//           )}

//           {(!isFileUpload || (isEdit && !replaceFile)) && (
//             <div>
//               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">File Size</label>
//               <input 
//                 value={form.size} 
//                 onChange={e => setForm(p => ({ ...p, size: e.target.value }))}
//                 className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" 
//                 placeholder="e.g. 1.2 MB" 
//               />
//             </div>
//           )}

//           <div className="flex gap-3 pt-2">
//             <button 
//               type="button" 
//               onClick={onClose} 
//               disabled={loading} 
//               className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               disabled={loading} 
//               className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? (isEdit ? 'Saving...' : 'Uploading...') : (isEdit ? 'Save Changes' : 'Upload')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, Document, FamilyMember, DOCUMENT_CATEGORIES } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Trash2, FileText, UserPlus, Upload, X, ChevronDown, ChevronUp, Pencil, File, Eye, Edit3, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export function UploadDocModal({
    onClose,
    onSave,
    isFileUpload = true,
    initialData,
    isEdit = false
}: {
    onClose: () => void;
    onSave: (doc: any) => Promise<void>;
    isFileUpload?: boolean;
    initialData?: Document;
    isEdit?: boolean;
}) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [itrYears, setItrYears] = useState<{ _id: string; year: string }[]>([]);
    const [itrYearsLoading, setItrYearsLoading] = useState(false);
    const [form, setForm] = useState<{
        name: string;
        type: string;
        size: string;
        category: Document['category'];
        itrYear?: Document['itrYear']
    }>({
        name: initialData?.name || '',
        type: initialData?.type || 'PDF',
        size: initialData?.size || '',
        category: initialData?.category || 'PAN Card',
        itrYear: initialData?.itrYear,
    });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadNewFile, setUploadNewFile] = useState(false);
    const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');
    const [link, setLink] = useState('');
    const [masters, setMasters] = useState<{ _id: string; name: string; type: string; isActive: boolean }[]>([]);

    // Fetch ITR years from backend
    useEffect(() => {
        const fetchItrYears = async () => {
            setItrYearsLoading(true);
            try {
                const data = await api.get('/itr-years?activeOnly=true');
                setItrYears(data);
            } catch {
                // fallback silently
            } finally {
                setItrYearsLoading(false);
            }
        };
        fetchItrYears();
    }, []);

    // Fetch masters from backend
    useEffect(() => {
        const fetchMasters = async () => {
            try {
                const data = await api.get('/masters?type=other');
                setMasters(data);
            } catch {
                // fallback silently
            }
        };
        fetchMasters();
    }, []);

    console.log(form.category,'form.category')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast('File size should be less than 10MB', 'error');
                return;
            }

            setFile(selectedFile);
            const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
            const fileExtension = selectedFile.name.split('.').pop()?.toUpperCase() || 'Unknown';
            const fileType = getFileType(selectedFile.type, fileExtension);

            setForm(p => ({
                ...p,
                name: selectedFile.name,
                size: fileSizeMB + ' MB',
                type: fileType
            }));

            // Create preview for images
            if (selectedFile.type.startsWith('image/')) {
                const url = URL.createObjectURL(selectedFile);
                setPreviewUrl(url);
            } else {
                setPreviewUrl(null);
            }
            setUploadNewFile(true);
        }
    };

    const getFileType = (mimeType: string, extension: string): string => {
        if (mimeType.includes('pdf')) return 'PDF';
        if (mimeType.includes('image')) return 'Image';
        if (mimeType.includes('word') || extension === 'DOC' || extension === 'DOCX') return 'Word';
        if (mimeType.includes('excel') || extension === 'XLS' || extension === 'XLSX') return 'Excel';
        return 'Other';
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast('Document name is required', 'error');
            return;
        }

        if (form.category === 'ITR' && !form.itrYear) {
            toast('ITR year is required for ITR documents', 'error');
            return;
        }

        // For edit mode - if user selected a new file, use it, otherwise keep old file
        if (isEdit && !uploadNewFile && !file && !backFile) {
            // Update metadata only (no file change)
            setLoading(true);
            try {
                await onSave({
                    ...form,
                    size: form.size || 'N/A',
                    name: form.name,
                    category: form.category,
                    itrYear: form.itrYear,
                    replaceFile: false
                });
                toast('Document updated successfully', 'success');
                onClose();
            } catch (err: any) {
                toast(err.message || 'Failed to update document', 'error');
            } finally {
                setLoading(false);
            }
            return;
        }

        // For new upload or file replacement in edit mode
        if (isFileUpload && !isEdit) {
            // New upload validation
            if (uploadMode === 'file' && !file) {
                toast('Please select a file to upload', 'error');
                return;
            }
            if (uploadMode === 'link' && !link.trim()) {
                toast('Please enter a direct link', 'error');
                return;
            }
        } else if (isEdit && uploadNewFile) {
            // Edit mode file replacement validation
            if (uploadMode === 'file' && !file) {
                toast('Please select a file to upload', 'error');
                return;
            }
            if (uploadMode === 'link' && !link.trim()) {
                toast('Please enter a direct link', 'error');
                return;
            }
        }

        setLoading(true);
        try {
            if (uploadMode === 'file' && file) {
                // Upload file (for both new uploads and file replacement in edit)
                await onSave({
                    file,
                    name: form.name,
                    category: form.category,
                    itrYear: form.itrYear,
                    type: form.type,
                    size: form.size,
                    replaceFile: true
                });
            } else if (uploadMode === 'link' && link.trim()) {
                // Add document with direct link
                await onSave({
                    filePath: link.trim(),
                    name: form.name,
                    category: form.category,
                    itrYear: form.itrYear,
                    type: 'Link',
                    size: 'N/A',
                    replaceFile: false
                });
            } else {
                // Update metadata only (no file change)
                await onSave({
                    ...form,
                    size: form.size || 'N/A',
                    name: form.name,
                    category: form.category,
                    itrYear: form.itrYear,
                    replaceFile: false
                });
            }
            toast(isEdit ? 'Document updated successfully' : 'Document uploaded successfully', 'success');
            onClose();
        } catch (err: any) {
            toast(err.message || 'Failed to save document', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Cleanup preview URLs on unmount
    React.useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const getFileIcon = () => {
        if (form.type === 'PDF') return '📄';
        if (form.type === 'Image') return '🖼️';
        if (form.type === 'Word') return '📝';
        if (form.type === 'Excel') return '📊';
        return '📁';
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        {isEdit ? 'Edit Document' : (isFileUpload ? 'Upload File' : 'Add Document Details')}
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Upload mode toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">Upload Type:</span>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">File</span>
                            <button
                                type="button"
                                onClick={() => {
                                    const newMode = uploadMode === 'file' ? 'link' : 'file';
                                    setUploadMode(newMode);
                                    setFile(null);
                                    setPreviewUrl(null);
                                    setLink('');
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${uploadMode === 'file' ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${uploadMode === 'file' ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                            <span className="text-sm text-gray-600">Link</span>
                        </div>
                    </div>

                    {/* File upload section */}
                    {(isFileUpload && uploadMode === 'file') && (
                        <div>
                            {form.category === 'Aadhaar Card' ? (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Select PDF *
                                    </label>
                                    <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf"
                                            className="hidden"
                                            id="file-input"
                                        />
                                        <label htmlFor="file-input" className="cursor-pointer block">
                                            {file ? (
                                                <div className="space-y-2">
                                                    <File size={32} className="text-blue-600 mx-auto" />
                                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">Click to select PDF</p>
                                                    <p className="text-xs text-gray-400 mt-1">PDF only (Max 10MB)</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {isEdit ? 'Upload New File (Optional)' : 'Select File *'}
                                    </label>
                                    <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            id="file-input"
                                        />
                                        <label htmlFor="file-input" className="cursor-pointer block">
                                            {file ? (
                                                <div className="space-y-2">
                                                    <File size={32} className="text-blue-600 mx-auto" />
                                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                    {previewUrl && (
                                                        <div className="mt-2">
                                                            <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">Click to select file</p>
                                                    <p className="text-xs text-gray-400 mt-1">PDF, Images (Max 1.5MB)</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    {isEdit && !file && initialData && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Leave empty to keep the current file
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Show current file for edit mode when no new file is selected */}
                    {isEdit && !file && initialData && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                                Current File
                            </p>

                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="text-2xl">{getFileIcon()}</div>

                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {initialData.name}
                                    </p>

                                    <p className="text-xs text-gray-500 truncate">
                                        {initialData.type} • {initialData.size} • Uploaded: {initialData.uploadedAt}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Name *</label>
                        <input
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="e.g. Aadhar_Card.pdf"
                            required
                        />
                    </div>

                    {/* Direct link input */}
                    {(isFileUpload && uploadMode === 'link') && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Direct Link *</label>
                            <input
                                value={link}
                                onChange={e => setLink(e.target.value)}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="https://example.com/document.pdf"
                                required
                            />
                        </div>
                    )}

                    {(!isFileUpload || (isEdit && !uploadNewFile)) && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
                                <select
                                    value={form.type}
                                    onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                                    disabled={isEdit}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    {['PDF', 'Image', 'Word', 'Excel', 'Other'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(p => ({ ...p, category: e.target.value as Document['category'], itrYear: undefined }))}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-500"
                                >
                                    {DOCUMENT_CATEGORIES.filter(c => c !== 'Other').map(c => <option key={c}>{c}</option>)}
                                    {masters.map(m => <option key={`master-${m._id}`} value={m.name}>{m.name}</option>)}
                                    {masters.length === 0 && <option value="Other">Other</option>}
                                </select>
                            </div>
                        </div>
                    )}

                    {isFileUpload && !isEdit && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                            <select
                                value={form.category}
                                onChange={e => setForm(p => ({ ...p, category: e.target.value as Document['category'], itrYear: undefined }))}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                {DOCUMENT_CATEGORIES.filter(c => c !== 'Other').map(c => <option key={c}>{c}</option>)}
                                {masters.map(m => <option key={`master-${m._id}`} value={m.name}>{m.name}</option>)}
                                {masters.length === 0 && <option value="Other">Other</option>}
                            </select>
                        </div>
                    )}

                    {form.category === 'ITR' && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ITR Year *</label>
                            <select
                                value={form.itrYear ?? ''}
                                onChange={e => setForm(p => ({ ...p, itrYear: e.target.value }))}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                required
                                disabled={itrYearsLoading}
                            >
                                <option value="">{itrYearsLoading ? 'Loading years...' : 'Select Year'}</option>
                                {itrYears.map(y => (
                                    <option key={y._id} value={y.year}>ITR {y.year}</option>
                                ))}
                            </select>
                            {itrYears.length === 0 && !itrYearsLoading && (
                                <p className="text-xs text-amber-600 mt-1">No ITR years configured. <a href="/settings/itr-years" target="_blank" className="underline font-bold">Add years →</a></p>
                            )}
                        </div>
                    )}

                    {(!isFileUpload || (isEdit && !uploadNewFile)) && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">File Size</label>
                            <input
                                value={form.size}
                                disabled
                                onChange={e => setForm(p => ({ ...p, size: e.target.value }))}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="e.g. 1.2 MB"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? (isEdit ? 'Saving...' : 'Uploading...') : (isEdit ? 'Save Changes' : 'Upload')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}