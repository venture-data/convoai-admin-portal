"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { VoiceConfig } from "@/components/agent-config/voice-config";
import { ChatLanguages, elevenlabsVoiceLanguages } from "@/constants";
import UploadFile from "../ui/uploadfile";
import { VoiceConfig as VoiceConfigTypes } from "@/app/dashboard/new_agents/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AgentDetails {
  elevenlabs?: {
    agent_id: string;
    documents: Array<{
      id: string;
      file_name: string;
    }>;
  };
}

interface Agent {
  id: number;
  name: string;
  type: string;
  provider: string;
  language: string;
  llm_model: string;
  temperature: number;
  voice_details: VoiceConfigTypes;
  first_message: string;
  system_prompt: string;
  details: AgentDetails;
  knowledge_bases: Array<{ name: string; type: string; location: string }>;
}

interface AgentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
  readonly?: boolean;
  onUpdate?: (formData: FormData) => Promise<void>;
}

export function AgentDetailsModal({
  isOpen,
  onClose,
  agent,
  readonly = true,
  onUpdate,
}: AgentDetailsModalProps) {
  const [formState, setFormState] = useState<{
    name: string;
    type: string;
    provider: "elevenlabs" | "openai";
    language: string;
    llm_model: string;
    temperature: number;
    first_message: string;
    system_prompt: string;
    voice_details: VoiceConfigTypes;
  }>({
    ...agent,
    provider: agent.provider as "elevenlabs" | "openai",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingKnowledgeBases, setRemainingKnowledgeBases] = useState(
    agent.knowledge_bases
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readonly || !onUpdate) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("agent_id", agent.id.toString());
    if (formState.name !== agent.name) {
      formData.append("name", formState.name);
    }
    if (formState.type !== agent.type) {
      formData.append("type", formState.type);
    }
    if (formState.language !== agent.language) {
      formData.append("language", formState.language);
    }
    if (formState.llm_model !== agent.llm_model) {
      formData.append("llm_model", formState.llm_model);
    }
    if (formState.first_message !== agent.first_message) {
      formData.append("first_message", formState.first_message);
    }
    if (formState.system_prompt !== agent.system_prompt) {
      formData.append("system_prompt", formState.system_prompt);
    }
    if (formState.temperature !== agent.temperature) {
      formData.append("temperature", formState.temperature.toString());
    }
    if (
      formState.provider !== agent.provider ||
      JSON.stringify(formState.voice_details) !==
        JSON.stringify(agent.voice_details)
    ) {
      formData.append("voice_details", JSON.stringify(formState.voice_details));
    }
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }
    if (filesToDelete.length > 0) {
      filesToDelete.forEach((fileName) => {
        formData.append("files_to_delete[]", fileName);
      });
    }

    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await onUpdate(formData);
      // onClose();
    } catch (error) {
      console.error("Failed to update agent:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = (fileName: string) => {
    setFilesToDelete((prev) => [...prev, fileName]);
    setRemainingKnowledgeBases((prev) =>
      prev.filter((kb) => kb.name !== fileName)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {readonly ? "Agent Details" : "Edit Agent"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="provider">Provider:</Label>
                <div className="col-span-2">
                  <Input
                    id="provider"
                    value={formState.provider}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
              <Separator />

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="name">Name:</Label>
                <div className="col-span-2">
                  {readonly ? (
                    <span>{agent.name}</span>
                  ) : (
                    <Input
                      id="name"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              </div>
              <Separator />

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="type">Type:</Label>
                <div className="col-span-2">
                  {readonly ? (
                    <span>{agent.type}</span>
                  ) : (
                    <Select
                      value={formState.type}
                      onValueChange={(value) =>
                        setFormState((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger id="type" className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outbound">Outbound</SelectItem>
                        <SelectItem value="inbound">Inbound</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="flex justify-between py-2 border-b items-center gap-2">
                <Label htmlFor="language">Language:</Label>
                {readonly ? (
                  <span>{agent?.language}</span>
                ) : (
                  <Select
                    value={formState?.language}
                    onValueChange={(value) =>
                      setFormState((prev) => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {(formState.provider === "elevenlabs"
                        ? elevenlabsVoiceLanguages
                        : ChatLanguages
                      ).map((lang) => (
                        <SelectItem key={lang} value={lang.toLowerCase()}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex justify-between py-2 border-b items-center gap-2">
                <Label htmlFor="model">Model:</Label>
                {readonly ? (
                  <span>{agent.llm_model}</span>
                ) : (
                  <Select
                    value={formState.llm_model}
                    onValueChange={(value) =>
                      setFormState((prev) => ({ ...prev, llm_model: value }))
                    }
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {formState.provider === "elevenlabs" ? (
                        <>
                          <SelectItem value="gemini-1.5-flash">
                            Gemini 1.5 Flash (Fastest)
                          </SelectItem>
                          <SelectItem value="gpt-4o-mini">
                            GPT-4o Mini
                          </SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-4-turbo">
                            GPT-4 Turbo
                          </SelectItem>
                          <SelectItem value="gpt-3.5-turbo">
                            GPT-3.5 Turbo
                          </SelectItem>
                          <SelectItem value="gemini-1.5-pro">
                            Gemini 1.5 Pro
                          </SelectItem>
                          <SelectItem value="gemini-1.0-pro">
                            Gemini 1.0 Pro
                          </SelectItem>
                          <SelectItem value="claude-3-5-sonnet">
                            Claude 3.5 Sonnet
                          </SelectItem>
                          <SelectItem value="claude-3-haiku">
                            Claude 3 Haiku
                          </SelectItem>
                          <SelectItem value="grok-beta">Grok Beta</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="gpt-4o-mini-realtime">
                            GPT-4o Mini Realtime
                          </SelectItem>
                          <SelectItem value="gpt-4o-realtime">
                            GPT-4o Realtime
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex justify-between py-2 border-b items-center gap-2">
                <Label htmlFor="temperature">Temperature:</Label>
                {readonly ? (
                  <span>{agent.temperature}</span>
                ) : (
                  <div className="flex items-center gap-4 w-1/2">
                    <Slider
                      id="temperature"
                      value={[formState.temperature]}
                      max={1}
                      step={0.1}
                      onValueChange={(value) =>
                        setFormState((prev) => ({
                          ...prev,
                          temperature: value[0],
                        }))
                      }
                    />
                    <span>{formState.temperature}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between py-2 border-b">
                <Label htmlFor="first_message">First Message:</Label>
                {readonly ? (
                  <span>{agent.first_message}</span>
                ) : (
                  <Input
                    id="first_message"
                    value={formState.first_message}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        first_message: e.target.value,
                      }))
                    }
                  />
                )}
              </div>

              <div className="flex justify-between py-2 border-b">
                <Label htmlFor="system_prompt">System Prompt:</Label>
                {readonly ? (
                  <span>{agent.system_prompt}</span>
                ) : (
                  <textarea
                    id="system_prompt"
                    className="w-full min-h-[100px] p-3 rounded-md border"
                    value={formState.system_prompt}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        system_prompt: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {readonly ? (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Voice Name:</span>
                    <span className="col-span-2">
                      {agent.voice_details.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Labels:</span>
                    <span className="col-span-2">
                      {agent.voice_details.details.labels.join(", ")}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium block mb-2">
                      Voice Preview:
                    </span>
                    <audio controls className="w-full">
                      <source
                        src={agent.voice_details.details.preview_url}
                        type="audio/mp3"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              ) : (
                <VoiceConfig
                  provider={formState.provider}
                  agentConfig={formState.voice_details}
                  setAgentConfig={(newVoiceDetails) =>
                    setFormState((prev) => ({
                      ...prev,
                      voice_details: newVoiceDetails,
                    }))
                  }
                />
              )}
            </CardContent>
          </Card>

          {remainingKnowledgeBases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Bases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {remainingKnowledgeBases.map((kb, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Name:</span>
                        <span>{kb.name}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Type:</span>
                        <span>{kb.type}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Document:</span>
                        <div className="flex gap-2">
                          <Link
                            href={kb.location}
                            target="_blank"
                            className="text-blue-500 hover:text-blue-600 underline"
                          >
                            View Document
                          </Link>
                          {!readonly && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFile(kb.name)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!readonly && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Files</CardTitle>
              </CardHeader>
              <CardContent>
                <UploadFile files={files} setFiles={setFiles} />
              </CardContent>
            </Card>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {!readonly && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Updating...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
