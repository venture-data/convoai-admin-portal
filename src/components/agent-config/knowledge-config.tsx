"use client";

import { KnowledgeConfig as KnowledgeConfigType } from "@/app/dashboard/new_agents/types";
import { useState } from "react";
import { Brain, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKnowledgeBase } from "@/app/hooks/use-knowledge-base";
import { useAgentKnowledge } from "@/app/hooks/use-agent-knowledge";
import { useToast } from "@/app/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface KnowledgeConfigProps {
  agentConfig: KnowledgeConfigType;
  setAgentConfig: (config: KnowledgeConfigType) => void;
  agentId?: string;
}

export function KnowledgeConfig({ agentConfig, setAgentConfig, agentId }: KnowledgeConfigProps) {
  const { toast } = useToast();
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string>("");
  
  // Get all available knowledge bases
  const { knowledgeBases, isLoading: isLoadingKB } = useKnowledgeBase();
  
  // Get agent's current knowledge bases (if editing existing agent)
  const { 
    agentKnowledgeBases, 
    associateKnowledgeBase, 
    dissociateKnowledgeBase,
    isAssociating,
    isDissociating 
  } = useAgentKnowledge(agentId || null);

  // Get the knowledge base IDs from the current config or from the agent's associations
  const currentKnowledgeBaseIds = agentId 
    ? agentKnowledgeBases.map(mapping => mapping.knowledge_base_id)
    : (agentConfig.knowledgeBaseIds || []);

  // Get the knowledge base objects for display
  const selectedKnowledgeBases = knowledgeBases?.items?.filter(kb => 
    currentKnowledgeBaseIds.includes(kb.id)
  ) || [];

  // Get available knowledge bases (not already selected)
  const availableKnowledgeBases = knowledgeBases?.items?.filter(kb => 
    !currentKnowledgeBaseIds.includes(kb.id)
  ) || [];

  const handleAddKnowledgeBase = async () => {
    if (!selectedKnowledgeBaseId) return;

    if (agentId) {
      // If editing existing agent, use API to associate
      try {
        await associateKnowledgeBase.mutateAsync({
          agent_profile_id: agentId,
          knowledge_base_id: selectedKnowledgeBaseId
        });
        toast({
          title: "Success",
          description: "Knowledge base associated successfully"
        });
      } catch (error) {
        toast({
          title: "Association failed",
          description: error instanceof Error ? error.message : "Failed to associate knowledge base",
          variant: "destructive"
        });
      }
    } else {
      // If creating new agent, update local config
      const newKnowledgeBaseIds = [...(agentConfig.knowledgeBaseIds || []), selectedKnowledgeBaseId];
      setAgentConfig({ ...agentConfig, knowledgeBaseIds: newKnowledgeBaseIds });
    }
    
    setSelectedKnowledgeBaseId("");
  };

  const handleRemoveKnowledgeBase = async (knowledgeBaseId: string) => {
    if (agentId) {
      // If editing existing agent, use API to dissociate
      try {
        // Find the association record to get the association ID
        const association = agentKnowledgeBases.find(mapping => mapping.knowledge_base_id === knowledgeBaseId);
        if (!association) {
          throw new Error("Association not found");
        }
        
        await dissociateKnowledgeBase.mutateAsync(association.id);
        toast({
          title: "Success",
          description: "Knowledge base removed successfully"
        });
      } catch (error) {
        toast({
          title: "Removal failed",
          description: error instanceof Error ? error.message : "Failed to remove knowledge base",
          variant: "destructive"
        });
      }
    } else {
      // If creating new agent, update local config
      const newKnowledgeBaseIds = (agentConfig.knowledgeBaseIds || []).filter(id => id !== knowledgeBaseId);
      setAgentConfig({ ...agentConfig, knowledgeBaseIds: newKnowledgeBaseIds });
    }
  };

  return (
    <div className="space-y-8 text-white/90">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Brain className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-bold text-white">Knowledge Base</h3>
      </div>
      
      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Knowledge Base Selection
        </h4>

        {isLoadingKB ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
            <span className="ml-2 text-white/70">Loading knowledge bases...</span>
          </div>
        ) : !knowledgeBases?.items?.length ? (
          <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-400">
            <Brain className="h-4 w-4" />
            <AlertDescription className="text-amber-300">
              No knowledge bases found. 
              <Link 
                href="/dashboard/knowledge-base" 
                className="ml-1 underline hover:text-amber-200 inline-flex items-center gap-1"
              >
                Create one in the Knowledge Base section
                <ExternalLink className="h-3 w-3" />
              </Link>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Add Knowledge Base Section */}
            {availableKnowledgeBases.length > 0 && (
              <div className="flex gap-2">
                <Select value={selectedKnowledgeBaseId} onValueChange={setSelectedKnowledgeBaseId}>
                  <SelectTrigger className="flex-1 bg-[#1A1D25] border-white/20 text-white">
                    <SelectValue placeholder="Link Your Knowledge from the Dropdown..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1D25] border-white/20 text-white">
                    {availableKnowledgeBases.map((kb) => (
                      <SelectItem key={kb.id} value={kb.id} className="hover:bg-white/10">
                        <span className="font-medium">{kb.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={handleAddKnowledgeBase}
                  disabled={!selectedKnowledgeBaseId || isAssociating}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isAssociating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {/* Selected Knowledge Bases */}
            {selectedKnowledgeBases.length > 0 ? (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-white/90">
                  Selected Knowledge Bases ({selectedKnowledgeBases.length})
                </h5>
                
                {selectedKnowledgeBases.map((kb) => (
                  <div
                    key={kb.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#1A1D25] border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <Brain className="h-4 w-4 text-orange-400" />
                      <div>
                        <div className="font-medium text-white/90">{kb.name}</div>
                        {kb.description && (
                          <div className="text-xs text-white/60">{kb.description}</div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveKnowledgeBase(kb.id)}
                      disabled={isDissociating}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8"
                    >
                      {isDissociating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-white/60">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No knowledge bases selected</p>
                <p className="text-xs">Select knowledge bases to enhance your agent&apos;s capabilities</p>
              </div>
            )}

            {availableKnowledgeBases.length === 0 && selectedKnowledgeBases.length > 0 && (
              <div className="text-center py-4 text-white/60">
                <p className="text-sm">All available knowledge bases are already selected</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-xs text-white/50 italic">
          Knowledge bases provide your agent with access to documents and information for more informed responses.
        </div>
      </div>
    </div>
  );
}
