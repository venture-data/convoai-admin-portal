"use client";
import UploadFile from "../ui/uploadfile";
import { KnowledgeConfig as KnowledgeConfigType } from "@/app/dashboard/new_agents/types";
import { useState } from "react";
import { BookOpen, FileText, Database } from "lucide-react";

interface FileType {
  name?: string;
  path?: string;
  size?: number;
  type?: string;
}

export function KnowledgeConfig({agentConfig, setAgentConfig}: {agentConfig: KnowledgeConfigType, setAgentConfig: (config: KnowledgeConfigType) => void}) {
  const [errors] = useState<{ [key: string]: boolean }>({});

  return (
    <div className="space-y-8 text-white/90">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Database className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-bold text-white">Knowledge Base</h3>
      </div>
      
      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Document Upload
        </h4>
        
        <div className="space-y-3">
          <p className="text-sm text-white/90 flex items-center">
            Upload files for your assistant&apos;s knowledge base
            <span
              className="ml-1 text-white/60 hover:cursor-help"
              title="Files that your assistant can use to answer questions"
            >
              ⓘ
            </span>
          </p>
          
          <UploadFile 
            files={agentConfig.files || []} 
            setFiles={(files: File[]) => setAgentConfig({ ...agentConfig, files: files })} 
          />
          
          {errors.files && (
            <p className="text-red-500 text-sm flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Please upload at least one file.
            </p>
          )}
          
          {agentConfig.files && agentConfig.files.length > 0 && (
            <div className="mt-4">
              <h5 className="text-xs font-medium text-white/70 mb-2 flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Knowledge Files ({agentConfig.files.length})
              </h5>
              <ul className="space-y-1">
                {agentConfig.files.map((file: FileType, index: number) => (
                  <li key={index} className="text-xs text-white/60 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    </span>
                    {file.name || file.path || `File ${index + 1}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-2 text-xs text-white/50 italic">
            Supported file types: PDF, TXT, DOCX, CSV
          </div>
        </div>
      </div>
    </div>
  );
}
