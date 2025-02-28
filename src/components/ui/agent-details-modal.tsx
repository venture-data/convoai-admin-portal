"use client"

import Link from "next/link";

interface VoiceDetails {
  id: string;
  name: string;
  details: {
    id: string;
    name: string;
    labels: string[];
    preview_url: string;
    high_quality_base_model_ids: string[];
  };
  provider: string;
}

interface AgentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    id: string | number;
    name: string;
    type: string;
    provider: string;
    language: string;
    llm_model: string;
    temperature: number;
    voice_details: VoiceDetails;
    first_message: string;
    system_prompt: string;
    knowledge_bases: Array<{ name: string; type: string; location: string }>;
  };
}

export function AgentDetailsModal({ isOpen, onClose, agent }: AgentDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Agent Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Name:</span>
              <span>{agent.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Type:</span>
              <span>{agent.type}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Provider:</span>
              <span>{agent.provider}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Language:</span>
              <span>{agent.language}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Model:</span>
              <span>{agent.llm_model}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Temperature:</span>
              <span>{agent.temperature}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">First Message:</span>
              <span>{agent.first_message}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">System Prompt:</span>
              <span>{agent.system_prompt}</span>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Voice Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Voice Name:</span>
                    <span>{agent.voice_details.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Labels:</span>
                    <span>{agent.voice_details.details.labels.join(", ")}</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium block mb-2">Voice Preview:</span>
                    <audio controls className="w-full">
                      <source src={agent.voice_details.details.preview_url} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              </div>
            </div>

            {agent.knowledge_bases && agent.knowledge_bases.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Knowledge Bases</h3>
                <div className="space-y-4">
                  {agent.knowledge_bases.map((kb, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Name:</span>
                          <span>{kb.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Type:</span>
                          <span>{kb.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Document:</span>
                          <Link 
                            href={kb.location}
                            target="_blank"
                            className="text-blue-500 hover:text-blue-600 underline"
                          >
                            View Document
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 