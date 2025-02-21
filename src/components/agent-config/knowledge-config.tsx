"use client";
import UploadFile from "../ui/uploadfile";
import { KnowledgeConfig as KnowledgeConfigType } from "@/app/dashboard/new_agents/types";
export function KnowledgeConfig({agentConfig, setAgentConfig}: {agentConfig: KnowledgeConfigType, setAgentConfig: (config: KnowledgeConfigType) => void}) {
  return (
    <div className="space-y-6">
      <h3>Knowledge Base Configuration</h3>
      <UploadFile files={agentConfig.files} setFiles={(files: File[]) => setAgentConfig({ ...agentConfig, files: files })} />
    </div>
  );
}
