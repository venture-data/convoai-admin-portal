"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Search, Trash2, Loader2, Plus, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/app/hooks/use-toast";
import { KnowledgeBase } from "../types";

interface KnowledgeBaseSidebarProps {
  isLoading: boolean;
  knowledgeBases: KnowledgeBase[];
  selectedKnowledgeBaseId: string | null;
  onSelectKnowledgeBase: (kb: KnowledgeBase) => void;
  onDeleteKnowledgeBase: (kb: KnowledgeBase) => void;
  onCreateKnowledgeBase: () => void;
  deletingKnowledgeBaseId: string | null;
}

export default function KnowledgeBaseSidebar({
  isLoading,
  knowledgeBases,
  selectedKnowledgeBaseId,
  onSelectKnowledgeBase,
  onDeleteKnowledgeBase,
  onCreateKnowledgeBase,
  deletingKnowledgeBaseId
}: KnowledgeBaseSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredKnowledgeBases = knowledgeBases?.filter((kb) =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (kb.description && kb.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleDelete = async (kb: KnowledgeBase) => {
    try {
      await onDeleteKnowledgeBase(kb);
      toast({
        title: "Success",
        description: "Knowledge base deleted successfully",
      });
    } catch {
      toast({
        title: "Error", 
        description: "Failed to delete knowledge base",
        variant: "destructive"
      });
    }
  };



  return (
    <aside className="sticky top-0 h-[100vh] w-[320px] flex-shrink-0 bg-[#1A1D25] border-r border-white/10">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-orange-400" />
            <h3 className="text-xl font-bold text-white">Knowledge Base</h3>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search knowledge bases..."
              className="w-full bg-[#1A1D25]/70 border-white/10 text-white pl-9 rounded-md text-sm placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
            onClick={onCreateKnowledgeBase}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Knowledge Base
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={`kb-skeleton-${i}`} className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredKnowledgeBases.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <Brain className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                {searchQuery ? 'No knowledge bases match your search' : 'No knowledge bases created yet'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredKnowledgeBases.map((kb) => (
                <motion.div
                  key={kb.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-lg transition-all cursor-pointer
                    ${selectedKnowledgeBaseId === kb.id 
                      ? 'bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]' 
                      : 'bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10 hover:border-white/20'
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div 
                      className="flex-1 min-w-0" 
                      onClick={() => onSelectKnowledgeBase(kb)}
                    >
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white/90 truncate">
                            {kb.name}
                          </h4>
                          <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">
                            {kb.description || 'No description provided'}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{kb.document_count || 0} docs</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              <span>{kb.qdrant_collection ? 'Indexed' : 'Not indexed'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(kb);
                      }}
                      disabled={deletingKnowledgeBaseId === kb.id}
                    >
                      {deletingKnowledgeBaseId === kb.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </aside>
  );
} 