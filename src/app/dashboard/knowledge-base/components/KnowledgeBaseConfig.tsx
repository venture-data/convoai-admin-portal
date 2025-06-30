"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

import { 
  Brain, 
  Upload, 
  FileText, 
  Trash2, 
  Loader2, 
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/app/hooks/use-toast";
import { useDocuments } from "@/app/hooks/use-knowledge-base";
import { KnowledgeBase, Document } from "../types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KnowledgeBaseConfigProps {
  knowledgeBase: KnowledgeBase;
}

export default function KnowledgeBaseConfig({ knowledgeBase }: KnowledgeBaseConfigProps) {
  const { documents, isLoading, uploadDocument, deleteDocument, isUploading, isDeleting } = useDocuments(knowledgeBase.id);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileTypeIcon = (contentType: string) => {
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('doc')) return '📝';
    if (contentType.includes('text')) return '📋';
    if (contentType.includes('csv')) return '📊';
    return '📄';
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, TXT, DOC, DOCX, or CSV files only",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 50MB",
        variant: "destructive"
      });
      return;
    }

    try {
      await uploadDocument.mutateAsync({ knowledgeBaseId: knowledgeBase.id, file });
      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive"
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDeleteDocument = async (doc: Document) => {
    setDeletingDocId(doc.id);
    try {
      await deleteDocument.mutateAsync({ 
        knowledgeBaseId: knowledgeBase.id, 
        documentId: doc.id 
      });
      toast({
        title: "Success",
        description: "Document deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete document",
        variant: "destructive"
      });
    } finally {
      setDeletingDocId(null);
      setDocToDelete(null);
    }
  };

  const confirmDeleteDocument = () => {
    if (docToDelete) {
      handleDeleteDocument(docToDelete);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh)] p-8 pl-12 space-y-8 text-white/90 backdrop-blur-xl bg-[#1A1D25]/70">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Brain className="h-5 w-5 text-orange-400" />
        <div>
          <h3 className="text-xl font-bold text-white">{knowledgeBase.name}</h3>
          <p className="text-sm text-white/60">{knowledgeBase.description || 'No description provided'}</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="p-6 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Documents
        </h4>
        
        <div className="space-y-4">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all
              ${dragActive 
                ? 'border-orange-500 bg-orange-500/10' 
                : 'border-white/20 hover:border-orange-500/50 hover:bg-orange-500/5'
              }
              ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.txt,.doc,.docx,.csv"
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-orange-500 animate-spin mb-3" />
                <p className="text-white/90 font-medium">Uploading document...</p>
                <p className="text-white/60 text-sm">This may take a few moments</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-orange-400 mb-3" />
                <p className="text-white/90 font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-white/60 text-sm">
                  PDF, TXT, DOC, DOCX, CSV files (up to 50MB)
                </p>
              </div>
            )}
          </div>
          
          <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-300">
              Documents are automatically processed and indexed for search. This process may take a few minutes for large files.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Documents List */}
      <div className="p-6 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-orange-400 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents ({documents?.items?.length || 0})
          </h4>
        </div>
        

        
        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={`doc-skeleton-${i}`} className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))
          ) : !documents?.items?.length ? (
            <div className="text-center py-12 text-white/60">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No documents uploaded yet</p>
              <p className="text-sm">Upload your first document to get started</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {documents.items.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10 hover:border-white/20 transition-all ${
                    deletingDocId === doc.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0">
                        {getFileTypeIcon(doc.content_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-sm font-medium text-white/90 truncate">
                            {doc.filename}
                          </h5>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-white/60">
                              {doc.chunk_count} chunks
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <span className="px-2 py-1 bg-white/10 rounded text-xs">
                            {getFileExtension(doc.filename)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(doc.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8"
                        onClick={() => setDocToDelete(doc)}
                        disabled={deletingDocId === doc.id || isDeleting}
                        title="Delete document"
                      >
                        {deletingDocId === doc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!docToDelete} onOpenChange={() => setDocToDelete(null)}>
        <DialogContent className="bg-[#1A1D25] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Document
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to delete &quot;{docToDelete?.filename}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDocToDelete(null)}
              className="border-white/20 text-white/90 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteDocument}
              disabled={deletingDocId === docToDelete?.id}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingDocId === docToDelete?.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 