"use client";

import type { AgentProfileResponse } from "@/app/types/agent-profile";
import { CallSessionModal } from "./call-session-modal";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentProfileResponse;
}

export function CallModal({ isOpen, onClose, agent }: CallModalProps) {
  return (
    <CallSessionModal
      isOpen={isOpen}
      onClose={onClose}
      agent={agent}
    />
  );
} 