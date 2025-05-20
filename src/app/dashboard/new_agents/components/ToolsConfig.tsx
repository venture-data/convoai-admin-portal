"use client"

import React, { useEffect, useState } from 'react';
import { useFunctions } from '@/app/hooks/use-functions';
import { useAgentFunctions } from '@/app/hooks/use-agent-functions';
import { MultiSelect } from './MultiSelect';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolsConfigProps {
  agentId: string;
}

export function ToolsConfig({ agentId }: ToolsConfigProps) {
  const { functions, isLoading: functionsLoading } = useFunctions();
  const { agentFunctions, isLoading: agentFunctionsLoading, updateAgentFunctions } = useAgentFunctions(agentId);
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (agentFunctions && agentFunctions.items) {
      const functionIds = agentFunctions.items.map(func => func.id || '').filter(Boolean);
      setSelectedFunctionIds(functionIds);
    }
  }, [agentFunctions]);

  const functionOptions = functions?.items
    ? functions.items.map(func => ({
        id: func.id || '',
        label: func.name,
        description: func.description
      })).filter(option => option.id)
    : [];

  const handleSave = async () => {
    if (!agentId) return;
    
    try {
      setIsSaving(true);
      await updateAgentFunctions.mutateAsync(selectedFunctionIds);
    } catch (error) {
      console.error('Error updating agent functions:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (functionsLoading || agentFunctionsLoading) {
    return (
      <div className="w-full p-6 grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-white/60">Loading functions...</p>
        </div>
      </div>
    );
  }

  // Additional info about already associated functions
  const associatedFunctions = agentFunctions?.items || [];

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-white mb-2">Tools Configuration</h2>
          <p className="text-white/60 text-sm mb-6">
            Associate functions with this agent to enable tool use capabilities.
            The agent will be able to call these functions during conversations.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Available Functions
              </label>
              
              {functionOptions.length === 0 ? (
                <div className="p-4 border border-white/10 rounded-md bg-[#1A1D25]/50 text-center">
                  <p className="text-white/60">No functions available. Create functions in the Tools section first.</p>
                </div>
              ) : (
                <MultiSelect
                  options={functionOptions}
                  selectedValues={selectedFunctionIds}
                  onChange={setSelectedFunctionIds}
                  placeholder="Select functions to associate with this agent"
                />
              )}
            </div>

            {associatedFunctions.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-white/80 mb-2">Currently Associated Functions</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto rounded-md border border-white/10 p-3 bg-[#1A1D25]/50">
                  {associatedFunctions.map(func => (
                    <div key={func.id} className="p-2 border-b border-white/5 last:border-0">
                      <div className="text-sm text-white font-medium">{func.name}</div>
                      <div className="text-xs text-white/60 mt-0.5">{func.description}</div>
                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500/20 text-white/80">
                          {func.http_method}
                        </span>
                        <span className="text-xs text-white/50 truncate">
                          {func.base_url}/{func.endpoint_path}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Tools Configuration'
          )}
        </Button>
      </div>
    </div>
  );
} 