"use client";

import { AgentConfig } from "@/app/dashboard/new_agents/types";
import { assistantTemplates } from "@/constants/templates";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock, HeadphonesIcon, ClipboardList, PlusCircle, LucideIcon } from "lucide-react";

interface TemplateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

const TemplateCard = ({ icon: Icon, title, description, onClick }: TemplateCardProps) => (
  <div className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all">
    <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
            <Icon className="w-8 h-8 text-orange-500 flex-shrink-0" />
            <h3 className="text-white font-medium">{title}</h3>
        </div>
      <div className="flex flex-col items-start">
        <p className="text-sm text-white/60 mt-2">{description}</p>
        <Button 
          variant="ghost" 
          className="text-orange-500 hover:text-orange-600 hover:bg-transparent p-0 mt-3"
          onClick={onClick}
        >
          Use Template →
        </Button>
      </div>
    </div>
  </div>
);

const templates = [
  {
    icon: CalendarClock,
    title: "Appointment Bot",
    description: "Schedule meetings and manage appointments with natural conversation flow.",
    templateKey: "sales-assistant"
  },
  {
    icon: HeadphonesIcon,
    title: "Support Bot",
    description: "Handle customer support inquiries and troubleshooting assistance.",
    templateKey: "support-bot"
  },
  {
    icon: ClipboardList,
    title: "Survey Agent",
    description: "Conduct surveys and collect feedback through natural conversations.",
    templateKey: "survey-agent"
  },
  {
    icon: PlusCircle,
    title: "Blank Template",
    description: "Start from scratch and create a custom assistant.",
    templateKey: "blank"
  }
];

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AgentConfig) => void;
}

export function TemplateSelectorModal({ isOpen, onClose, onSelectTemplate }: TemplateSelectorModalProps) {
  const handleTemplateSelection = (templateKey: string) => {
    if (templateKey === "blank") {
      onSelectTemplate({
        model: {
          agentName: "",
          firstMessage: "",
          type: "inbound",
          systemPrompt: "",
          provider: "elevenlabs",
          model: "gpt-4",
          language: "en",
          temperature: 0.7,
          description: "",
          stt_model: "nova-3-general",
          stt_model_telephony: "nova-2-phonecall",
          allow_interruptions: true,
          interrupt_speech_duration: 0.5,
          interrupt_min_words: 0,
          min_endpointing_delay: 0.5,
          max_endpointing_delay: 6,
          active: true,
          is_default: false,
          max_nested_function_calls: 1,
        },
        voice: {
          id: "",
          name: "alloy",
          provider: "elevenlabs",
          details: {
            name: "",
            high_quality_base_model_ids: [],
            preview_url: "",
            labels: [],
          }
        },
        knowledge: {
          files: []
        }
      });
    } else {
      onSelectTemplate(assistantTemplates[templateKey as keyof typeof assistantTemplates]);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1A1D25] border-white/10">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-white">Create New Assistant</DialogTitle>
          <DialogDescription className="text-white/60">
            Choose a template to get started quickly or start from scratch
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.templateKey}
              icon={template.icon}
              title={template.title}
              description={template.description}
              onClick={() => handleTemplateSelection(template.templateKey)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 