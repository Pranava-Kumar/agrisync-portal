'use client';

import { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { useAppStore } from '@/lib/store';
import { FileText, Search, Filter, Upload, X, Eye, Download, Plus, FolderOpen } from 'lucide-react';

export default function DocumentsPage() {
  const { currentUser, documents, addDocument, deleteDocument } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Competition': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Technical': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Testing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';  
      case 'Safety': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Research': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      const newDocument = {
        title: file.name.split('.')[0],
        category: 'Technical',
        description: `Uploaded document: ${file.name}`,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        uploadedBy: currentUser?.name || 'Unknown',
        uploadedAt: new Date(),
        fileType: file.type || 'application/octet-stream',
      };
      
      addDocument(newDocument, file);
    });
    setShowUploadModal(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const viewDocument = (doc: any) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      console.error("Document URL not found:", doc);
      alert("Document not available.");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto mobile-padding">
        <div className="responsive-m-8">
          <h1 className="responsive-text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3">Documents</h1>
          <p className="text-gray-400 responsive-text-lg">Access and manage project documentation</p>
        </div>

        {/* Search and Filter */}
        <div className="dark-card responsive-p-6 responsive-m-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 responsive-text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 md:px-4 md:py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent responsive-text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center justify-center responsive-btn"
              >
                <Plus className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Upload Documents</span>
                <span className="sm:hidden">Upload</span>
              </button>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="scrollable-container scrollable-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 responsive-gap-6 responsive-m-8">
              {filteredDocuments.map(document => (
                <div key={document.id} className="dark-card hover-lift">
                  <div className="responsive-p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center flex-1 min-w-0">
                        <FileText className="h-8 w-8 md:h-10 md:w-10 text-blue-400 mr-3 md:mr-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-white responsive-text-sm leading-tight text-wrap">
                            {document.title}
                          </h3>
                          <p className="responsive-text-xs text-gray-400 mt-1 text-wrap">{document.fileName}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full responsive-text-xs font-medium border ${getCategoryColor(document.category)} flex-shrink-0 ml-2`}>
                        {document.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 responsive-text-sm mb-4 line-clamp-2 text-wrap">
                      {document.description}
                    </p>

                    <div className="flex items-center justify-between responsive-text-xs text-gray-500 mb-4">
                      <span className="truncate">By {document.uploadedBy}</span>
                      <span className="flex-shrink-0 ml-2">{new Date(document.uploadedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between responsive-text-xs text-gray-500 mb-4">
                      <span>{document.fileSize}</span>
                      <span>{new Date(document.uploadedAt).toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewDocument(document)}
                        className="flex-1 btn-primary responsive-text-sm py-2"
                      >
                        <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        View
                      </button>
                      {currentUser?.isLeader && (
                        <button
                          onClick={() => deleteDocument(document.id)}
                          className="px-2 py-2 md:px-3 md:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/30 transition-colors"
                        >
                          <X className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="h-16 w-16 md:h-24 md:w-24 text-gray-600 mx-auto mb-6" />
            <h3 className="responsive-text-2xl font-semibold text-gray-300 mb-3">No documents found</h3>
            <p className="text-gray-500 mb-6 responsive-text-base">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first document to get started'
              }
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              <Upload className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Upload Documents
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800/95 backdrop-blur-lg rounded-3xl responsive-p-8 responsive-modal-lg border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-y-auto scrollable-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="responsive-text-2xl font-semibold text-white">Upload Documents</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-200 p-2 hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>

              <div
                className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="responsive-text-xl font-semibold text-white mb-2">
                  Drop files here or click to browse
                </h4>
                <p className="text-gray-400 mb-6 responsive-text-sm">
                  Support for multiple files. PDF, DOC, DOCX, TXT, and more.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Select Files
                </button>
              </div>

              <div className="mt-6 responsive-text-sm text-gray-400">
                <p className="mb-2">Supported formats:</p>
                <p>Documents: PDF, DOC, DOCX, TXT</p>
                <p>Images: JPG, JPEG, PNG, GIF</p>
                <p>Archives: ZIP, RAR</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}