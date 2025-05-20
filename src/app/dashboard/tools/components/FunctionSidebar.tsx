import React from "react";
import { cn } from "@/lib/utils";
import { Wrench, Trash2 } from "lucide-react";
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
}

export default function FunctionSidebar({ 
  functions, 
  selectedFunction, 
  onSelectFunction,
  onDeleteFunction
}: FunctionSidebarProps) {
  if (functions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <Wrench className="w-8 h-8 text-orange-500/50 mb-4" />
        <p className="text-white/60 mb-2">No functions found</p>
        <p className="text-sm text-white/40">
          Click the &quot;Create New Function&quot; button above to add a function
        </p>
      </div>
    );
  }
  
  return (
    <div className="sticky top-0 max-h-[calc(100vh-240px)] overflow-auto sidebar-scroll">
      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
          margin-left: 8px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
          margin: 4px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          border: 4px solid transparent;
          background-clip: padding-box;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
          border: 4px solid transparent;
          background-clip: padding-box;
        }

        /* For Firefox */
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
          padding-right: 8px;
        }
      `}</style>

      {functions.map((func) => (
        <div 
          key={func.id}
          className={cn(
            "p-4 cursor-pointer border-b border-white/10 hover:bg-white/5 transition-colors",
            selectedFunction === func.id && "bg-white/10"
          )}
          onClick={() => onSelectFunction(func.id)}
        >
          <div className="grid grid-cols-[auto_1fr_auto] gap-3 w-full overflow-hidden">
            <Wrench className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
            <div className="space-y-1 min-w-0 w-full">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm text-white truncate max-w-[70%]">{func.name}</span>
                <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-md flex-shrink-0">
                  {func.method}
                </span>
              </div>
              <div className="text-xs text-white/40 truncate">
                {func.url}
              </div>
            </div>
            {onDeleteFunction && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to delete "${func.name}"?`)) {
                    onDeleteFunction(func.id);
                  }
                }}
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-500 hover:bg-red-500/10 h-6 w-6"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 