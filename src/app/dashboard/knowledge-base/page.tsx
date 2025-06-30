"use client";

import { useState } from "react";
import { useKnowledgeBase } from "@/app/hooks/use-knowledge-base";
import { useToast } from "@/app/hooks/use-toast";
import KnowledgeBaseSidebar from "./components/KnowledgeBaseSidebar";
import KnowledgeBaseConfig from "./components/KnowledgeBaseConfig";
import { CreateKnowledgeBaseModal } from "./components/CreateKnowledgeBaseModal";
import { KnowledgeBase, CreateKnowledgeBaseData } from "./types";
import { Brain } from "lucide-react";

export default function KnowledgeBasePage() {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingKnowledgeBaseId, setDeletingKnowledgeBaseId] = useState<string | null>(null);
  
  const { 
    knowledgeBases, 
    isLoading, 
    createKnowledgeBase, 
    deleteKnowledgeBase
  } = useKnowledgeBase();
  
  const { toast } = useToast();

  const handleCreateKnowledgeBase = async (formData: CreateKnowledgeBaseData) => {
    try {
      const newKB = await createKnowledgeBase.mutateAsync(formData);
      setSelectedKnowledgeBase(newKB);
      toast({
        title: "Success",
        description: "Knowledge base created successfully",
      });
    } catch (error) {
      console.error("Failed to create knowledge base:", error);
      throw error;
    }
  };

  const handleDeleteKnowledgeBase = async (knowledgeBase: KnowledgeBase) => {
    setDeletingKnowledgeBaseId(knowledgeBase.id);
    try {
      await deleteKnowledgeBase.mutateAsync(knowledgeBase.id);
      if (selectedKnowledgeBase?.id === knowledgeBase.id) {
        setSelectedKnowledgeBase(null);
      }
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
    } finally {
      setDeletingKnowledgeBaseId(null);
    }
  };

  const handleSelectKnowledgeBase = (knowledgeBase: KnowledgeBase) => {
    setSelectedKnowledgeBase(knowledgeBase);
  };

  return (
    <div className="flex min-h-[calc(100vh-40px)]">
      <KnowledgeBaseSidebar 
        isLoading={isLoading}
        knowledgeBases={knowledgeBases?.items || []}
        selectedKnowledgeBaseId={selectedKnowledgeBase?.id || null}
        onSelectKnowledgeBase={handleSelectKnowledgeBase}
        onDeleteKnowledgeBase={handleDeleteKnowledgeBase}
        onCreateKnowledgeBase={() => setIsModalOpen(true)}
        deletingKnowledgeBaseId={deletingKnowledgeBaseId}
      />
      
      <div className="flex-1">
        {selectedKnowledgeBase ? (
          <KnowledgeBaseConfig knowledgeBase={selectedKnowledgeBase} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Knowledge Base Selected</p>
              <p className="text-sm text-gray-500">
                {!knowledgeBases?.items?.length 
                  ? "Create your first knowledge base to get started" 
                  : "Select a knowledge base from the sidebar to view and manage documents"
                }
              </p>
            </div>
          </div>
        )}
      </div>
      
      <CreateKnowledgeBaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateKnowledgeBase}
      />
    </div>
  );
} 