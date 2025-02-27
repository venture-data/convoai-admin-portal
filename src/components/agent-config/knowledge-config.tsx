"use client";
import UploadFile from "../ui/uploadfile";
import { KnowledgeConfig as KnowledgeConfigType } from "@/app/dashboard/new_agents/types";
import { useState } from "react";

export function KnowledgeConfig({agentConfig, setAgentConfig}: {agentConfig: KnowledgeConfigType, setAgentConfig: (config: KnowledgeConfigType) => void}) {
  const [errors] = useState<{ [key: string]: boolean }>({});

  return (
    <div className="space-y-6">
      <h3 className={`text-lg ${errors.files ? 'text-red-500' : ''}`}>Knowledge Base Configuration</h3>
      <UploadFile files={agentConfig.files} setFiles={(files: File[]) => setAgentConfig({ ...agentConfig, files: files })} />
      {errors.files && <p className="text-red-500">Please upload at least one file.</p>}
    </div>
  );
}
