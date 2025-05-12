"use client"

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneNumber, InboundSettings, OutboundSettings } from "../types";
import { Phone, PhoneCall, PhoneIncoming } from "lucide-react";
import { useAgent } from "@/app/hooks/use-agent";

interface PhoneNumberConfigProps {
  phoneNumber: PhoneNumber;
  onUpdate: (settings: { inbound?: InboundSettings; outbound?: OutboundSettings }) => void;
}

export default function PhoneNumberConfig({ phoneNumber, onUpdate }: PhoneNumberConfigProps) {
  const { agents, isLoading } = useAgent();
  const [outboundSettings, setOutboundSettings] = useState<OutboundSettings>(
    phoneNumber.outboundSettings || {
      callOneNumber: true,
      phoneNumber: "",  
      assistantId: "",
      squadId: "",
      workflowId: "",
    }
  );
  const [inboundSettings, setInboundSettings] = useState<InboundSettings>(
    phoneNumber.inboundSettings || {
      assistantId: "",
      squadId: "",
      workflowId: "",
      enabled: true
    }
  );

  return (
    <div className="flex-1 min-h-[calc(100vh-40px)] p-8 pl-12 space-y-8 text-white/90">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Phone className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-bold text-white">Phone Number Configuration</h3>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <PhoneIncoming className="h-4 w-4" />
          Inbound Settings
        </h4>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Assistant</Label>
            <Select value={inboundSettings.assistantId} onValueChange={(value) => {
              setInboundSettings({ ...inboundSettings, assistantId: value });
              onUpdate({ inbound: { ...inboundSettings, assistantId: value } });
            }}>
              <SelectTrigger className="w-full bg-[#1A1D25]/70 border-white/10 hover:bg-[#1A1D25] focus:ring-orange-500/20 focus:border-orange-500/50 transition-colors">
                <SelectValue placeholder="Select Assistant..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1D25] border-white/10">
                {isLoading ? (
                  <SelectItem value="loading" disabled className="text-white/60">Loading assistants...</SelectItem>
                ) : agents?.items?.length === 0 ? (
                  <SelectItem value="none" disabled className="text-white/60">No assistants available</SelectItem>
                ) : (
                  agents?.items?.map((agent) => (
                    <SelectItem 
                      key={agent.id} 
                      value={agent.id}
                      className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white"
                    >
                      {agent.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>


      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
        <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
          <PhoneCall className="h-4 w-4" />
          Outbound Settings
        </h4>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={outboundSettings.phoneNumber}
              onChange={(e) => {
                setOutboundSettings({ ...outboundSettings, phoneNumber: e.target.value });
                onUpdate({ outbound: { ...outboundSettings, phoneNumber: e.target.value } });
              }}
              className="bg-[#1A1D25]/70 border-white/10 hover:bg-[#1A1D25] focus:ring-orange-500/20 focus:border-orange-500/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label>Assistant</Label>
            <Select value={outboundSettings.assistantId} onValueChange={(value) => {
              setOutboundSettings({ ...outboundSettings, assistantId: value });
              onUpdate({ outbound: { ...outboundSettings, assistantId: value } });
            }}>
              <SelectTrigger className="w-full bg-[#1A1D25]/70 border-white/10 hover:bg-[#1A1D25] focus:ring-orange-500/20 focus:border-orange-500/50 transition-colors">
                <SelectValue placeholder="Select Assistant..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1D25] border-white/10">
                {isLoading ? (
                  <SelectItem value="loading" disabled className="text-white/60">Loading assistants...</SelectItem>
                ) : agents?.items?.length === 0 ? (
                  <SelectItem value="none" disabled className="text-white/60">No assistants available</SelectItem>
                ) : (
                  agents?.items?.map((agent) => (
                    <SelectItem 
                      key={agent.id} 
                      value={agent.id}
                      className="text-white/90 focus:bg-orange-500 focus:text-white data-[highlighted]:bg-orange-500 data-[highlighted]:text-white"
                    >
                      {agent.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
    </div>
  );
} 