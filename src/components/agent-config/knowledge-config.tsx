"use client";
import UploadFile from "../ui/uploadfile";
import { KnowledgeConfig as KnowledgeConfigType } from "@/app/dashboard/new_agents/types";
import { useState } from "react";

export function KnowledgeConfig({agentConfig, setAgentConfig}: {agentConfig: KnowledgeConfigType, setAgentConfig: (config: KnowledgeConfigType) => void}) {
  const [errors] = useState<{ [key: string]: boolean }>({});

  return (
    <div className="space-y-6 text-white/90">
      <h3 className="text-xl font-bold mb-4 text-white">Knowledge Base Configuration</h3>
      <div className="space-y-4">
        <div className="space-y-2 bg-[#1A1D25]/70 border border-white/10 rounded-md p-4">
          <p className="text-xs text-white/90 mb-2 flex items-center">
            Upload files for your assistant&apos;s knowledge base
            <span
              className="ml-1 text-white/60 hover:cursor-help"
              title="Files that your assistant can use to answer questions"
            >
              ⓘ
            </span>
          </p>
          <UploadFile files={agentConfig.files || []} setFiles={(files: File[]) => setAgentConfig({ ...agentConfig, files: files })} />
          {errors.files && <p className="text-red-500 text-sm">Please upload at least one file.</p>}
        </div>
      </div>
    </div>
  );
}
