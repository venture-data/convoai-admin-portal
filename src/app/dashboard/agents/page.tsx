"use client"

import { useState } from "react"
import { useAgent } from "@/app/hooks/use-agent"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AgentDetailsModal } from "@/components/ui/agent-details-modal"

// interface VoiceDetails {
//   id: string;
//   name: string;
//   details: {
//     id: string;
//     name: string;
//     labels: string[];
//     preview_url: string;
//     high_quality_base_model_ids: string[];
//   };
//   provider: "elevenlabs" | "openai";
// }

interface Agent {
  id: number;
  name: string;
  description: string;
  system_prompt: string;
  greeting: string;
  voice: string;
  llm_model: string;
  stt_model: string;
  stt_model_telephony: string;
  allow_interruptions: boolean;
  interrupt_speech_duration: number;
  interrupt_min_words: number;
  min_endpointing_delay: number;
  max_endpointing_delay: number;
  active: boolean;
  is_default: boolean;
  max_nested_function_calls: number;
  owner_id: number;
}

export default function AgentsPage() {
  const { agents, isLoading, error, updateAgent } = useAgent()
  const router = useRouter()
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">Failed to load agents</p>
        <Button onClick={() => router.refresh()}>Retry</Button>
      </div>
    )
  }

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleUpdate = async (formData: FormData) => {
    try {
      await updateAgent.mutateAsync(formData)
      setIsModalOpen(false)
      setSelectedAgent(null)
      router.refresh()
    } catch (error) {
      console.error('Failed to update agent:', error)
    }
  }

  const handleCallAgent = (agentId: number) => {
    console.log(`Initiating call with agent ID: ${agentId}`);
    router.push(`/dashboard/call/${agentId}`);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Agents</h1>

      {agents?.length === 0 || agents?.detail ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No agents found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Voice</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Is Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents?.items?.map((agent: Agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.description || 'None'}</TableCell>
                  <TableCell>{agent.voice}</TableCell>
                  <TableCell>{agent.llm_model}</TableCell>
                  <TableCell>{agent.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{agent.is_default ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(agent)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAgent(agent)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleCallAgent(agent.id)}
                    >
                      Call
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* {selectedAgent && (
        <AgentDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedAgent(null)
            setIsEditMode(false)
          }}
          agent={selectedAgent as Agent}
          readonly={!isEditMode}
          onUpdate={handleUpdate}
        />
      )} */}
    </div>
  )
}

