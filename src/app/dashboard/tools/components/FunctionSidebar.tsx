import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Wrench, Trash2, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Function {
  id: string;
  name: string;
  method: string;
  url: string;
}

interface FunctionSidebarProps {
  functions: Function[];
  selectedFunction: string | null;
  onSelectFunction: (id: string) => void;
  onDeleteFunction?: (id: string) => void;
  onCreateFunction?: () => void;
  isCreating?: boolean;
  isLoading?: boolean;
}

export default function FunctionSidebar({ 
  functions, 
  selectedFunction, 
  onSelectFunction,
  onDeleteFunction,
  onCreateFunction,
  isCreating,
  isLoading
}: FunctionSidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await onDeleteFunction?.(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="sticky top-0 h-[100vh]  flex-shrink-0 bg-[#1A1D25] border-r border-white/10">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Wrench className="h-5 w-5 text-orange-400" />
          <h3 className="text-xl font-bold text-white">Tools</h3>
        </div>
      </div>
      

      <div className="p-4 top-0 z-10 backdrop-blur-sm bg-[#1A1D25]/80 border-b border-white/10">
        <Button 
          className="w-full flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 border-none"
          onClick={onCreateFunction}
          disabled={isCreating}
        >
          {isCreating ? (
            <>Creating...</>
          ) : (
            <>
              <PlusIcon className="h-4 w-4" />
              Create New Function
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-white/60">
          Loading functions...
        </div>
      ) : functions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
          <Wrench className="w-8 h-8 text-[#FF5D0A]/50 mb-4" />
          <p className="text-[#6B7280] mb-2">No functions found</p>
          <p className="text-sm text-[#6B7280]">
            Click the &quot;Create New Function&quot; button above to add a function
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="p-4 space-y-2">
            {functions.map((func) => (
              <div 
                key={func.id}
                className={cn(
                  "p-4 rounded-lg cursor-pointer bg-[#1E2028] border border-[#2B2E38] hover:border-[#FF5D0A]/20 hover:bg-[#1E2028]/80",
                  selectedFunction === func.id && "border-[#FF5D0A]/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]"
                )}
                onClick={() => onSelectFunction(func.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-[#FF5D0A]/10">
                    <Wrench className="h-4 w-4 text-[#FF5D0A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white truncate">{func.name}</p>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#FF5D0A]/20 text-[#FF5D0A] ml-2 flex-shrink-0">
                        {func.method}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] truncate mt-0.5">
                      {func.url}
                    </p>
                  </div>
                  {onDeleteFunction && (
                    <Button
                      onClick={(e) => handleDelete(e, func.id)}
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === func.id}
                      className="text-red-500 hover:text-red-600 group-hover:opacity-100 hover:bg-red-500/10 h-6 w-6 ml-2"
                    >
                      {deletingId === func.id ? (
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 