"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneIncoming, PhoneOutgoing, Save, Phone, Settings2, UserSquare2 } from "lucide-react";
import { useSip } from "@/app/hooks/use-sip";
import { useAgent } from "@/app/hooks/use-agent";
import { useToast } from "@/app/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SipTrunkItem } from "../types";

interface AgentMapping {
  sip_trunk_id: string;
  agent_id: string;
  id: string;
}

interface PhoneNumberConfigProps {
  phoneNumber: SipTrunkItem;
  onUpdate: () => void;
}

export default function PhoneNumberConfig({ phoneNumber, onUpdate }: PhoneNumberConfigProps) {
  const { updateSipTrunk, isUpdating, agentMappings, isLoadingMapping } = useSip();
  const { agents, isLoading: isLoadingAgents } = useAgent();
  const { toast } = useToast();

  const handleSave = () => {
    if (phoneNumber.id) {
      updateSipTrunk({
        id: phoneNumber.id,
        agent_id: selectedAgentId
      });
      onUpdate();
    }
  };

  const currentMapping = (agentMappings as AgentMapping[])?.find(
    mapping => mapping.sip_trunk_id === phoneNumber.id
  );

  const selectedAgentId = currentMapping?.agent_id || '';
  const selectedAgent = agents?.items?.find(agent => agent.id.toString() === selectedAgentId);

  const handleAgentChange = async (value: string) => {
    try {
      await updateSipTrunk({
        id: phoneNumber.id,
        agent_id: value
      });
      
      toast({
        title: "Success",
        description: "Assistant assigned successfully",
        variant: "default",
      });
    } catch (error: unknown) {
      let errorMessage = 'Failed to assign assistant';
      
      try {
        const errorStr = error instanceof Error ? error.message : String(error);
        if (errorStr.includes('message:')) {
          const parsedError = JSON.parse(errorStr.split('message: ')[1]);
          if (parsedError.detail) {
            const match = parsedError.detail.match(/Conflicting inbound SIP Trunks: "[^"]+" and "[^"]+", using the same number\(s\) \["([^"]+)"\]/);
            if (match) {
              const phoneNumber = match[1];
              errorMessage = `Phone number ${phoneNumber} is already in use by another trunk. Please use a different number.`;
            } else {
              errorMessage = parsedError.detail;
            }
          }
        } else if (errorStr.includes('already has an agent mapping')) {
          errorMessage = "This phone number already has an assistant. The assignment will be updated.";
          toast({
            title: "Updating Assistant",
            description: errorMessage,
            variant: "default",
          });
          return;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        errorMessage = 'An unexpected error occurred while assigning the assistant';
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error assigning assistant:", error);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh)] p-8 pl-12 space-y-8 text-white/90 backdrop-blur-xl bg-[#1A1D25]/70">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {phoneNumber.trunk_type === 'inbound' ? (
            <PhoneIncoming className="h-5 w-5 text-orange-400" />
          ) : (
            <PhoneOutgoing className="h-5 w-5 text-orange-400" />
          )}
          <h3 className="text-xl font-bold text-white">
            {phoneNumber.trunk_type === 'inbound' ? 'Inbound' : 'Outbound'} Phone Number Configuration
          </h3>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-8">
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
          <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Basic Information
          </h4>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Input
                  value={phoneNumber.phone_number}
                  disabled
                  className="bg-[#1A1D25]/70 border-white/10 text-white/60 pl-9"
                />
                <Phone className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              <div className="relative">
                <Input
                  value={phoneNumber.name}
                  disabled
                  className="bg-[#1A1D25]/70 border-white/10 text-white/60 pl-9"
                />
                <Settings2 className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>SIP Termination URI</Label>
              <div className="relative">
                <Input
                  value={phoneNumber.sip_termination_uri}
                  disabled
                  className="bg-[#1A1D25]/70 border-white/10 text-white/60 pl-9"
                />
                <Settings2 className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Section for Outbound */}
        {phoneNumber.trunk_type === 'outbound' && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
            <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Authentication Settings
            </h4>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Username</Label>
                <div className="relative">
                  <Input
                    value={phoneNumber.username || ''}
                    disabled
                    className="bg-[#1A1D25]/70 border-white/10 text-white/60 pl-9"
                  />
                  <UserSquare2 className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type="password"
                    value={phoneNumber.password || ''}
                    disabled
                    className="bg-[#1A1D25]/70 border-white/10 text-white/60 pl-9"
                  />
                  <UserSquare2 className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
          <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
            <UserSquare2 className="h-4 w-4" />
            Assistant Assignment
          </h4>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Assistant</Label>
              {currentMapping && (
                <p className="text-sm text-orange-400 mb-2">
                  This phone number is already assigned to an assistant. Contact support to modify the assignment.
                </p>
              )}
              <Select 
                value={selectedAgentId} 
                onValueChange={handleAgentChange}
                disabled={isUpdating || !!currentMapping}
              >
                <SelectTrigger className="w-full bg-[#1A1D25]/70 border-white/10 hover:bg-[#1A1D25] focus:ring-orange-500/20 focus:border-orange-500/50 transition-colors">
                  <SelectValue>
                    {isLoadingMapping ? (
                      "Loading assigned assistant..."
                    ) : selectedAgent ? (
                      selectedAgent.name
                    ) : (
                      "Select Assistant..."
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#1A1D25] border-white/10">
                  {isLoadingAgents ? (
                    <SelectItem value="loading" disabled className="text-white/60">Loading assistants...</SelectItem>
                  ) : !agents?.items?.length ? (
                    <SelectItem value="none" disabled className="text-white/60">No assistants available</SelectItem>
                  ) : (
                    agents.items.map((agent) => (
                      <SelectItem 
                        key={agent.id} 
                        value={agent.id.toString()}
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
    </div>
  );
}