"use client";

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
import { Switch } from "@/components/ui/switch";

export function ModelConfig() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="first-message" className="flex items-center">
          First Message
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="The initial message your assistant will send"
          >
            ⓘ
          </span>
        </Label>
        <Input
          id="first-message"
          defaultValue="Hello, this is Mary from Mary's Dental. How can I assist you today?"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="system-prompt" className="flex items-center">
          System Prompt
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Instructions for the AI assistant"
          >
            ⓘ
          </span>
        </Label>
        <textarea
          id="system-prompt"
          className="w-full min-h-[150px] p-3 rounded-md border"
          defaultValue={`You are a voice assistant for Mary's Dental, a dental office located at 123 North Face Place, Anaheim, California. The hours are 8 AM to 5PM daily, but they are closed on Sundays.

Mary's dental provides dental services to the local Anaheim community. The practicing dentist is Dr. Mary Smith.

You are tasked with answering questions about the business, and booking appointments. If they wish to book an appointment, your goal is to gather necessary information from callers in a friendly and efficient manner like follows:

1. Ask for their full name.
2. Ask for the purpose of their appointment.
3. Request their preferred date and time for the appointment.
4. Confirm all details with the caller, including the date and time of the appointment.

- Be sure to be kind of funny and witty!
- Keep all your responses short and simple. Use casual language, phrases like "Umm...", "Well...", and "I mean" are preferred.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`}
        />
      </div>

      {/* Provider Selection */}
      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <Select defaultValue="openai">
          <SelectTrigger id="provider">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label htmlFor="model" className="flex items-center">
          Model
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Select the AI model to power your assistant"
          >
            ⓘ
          </span>
        </Label>
        <Select defaultValue="gpt-4o-mini">
          <SelectTrigger id="model">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language" className="flex items-center">
          Language
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Select the language of the assistant"
          >
            ⓘ
          </span>
        </Label>
        <Select defaultValue="en">
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="temperature" className="flex items-center">
          Temperature
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Controls randomness in the model's responses"
          >
            ⓘ
          </span>
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            id="temperature"
            defaultValue={[1]}
            max={2}
            step={0.1}
            className="flex-1"
          />
          <span className="w-12 text-center">1</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-tokens" className="flex items-center">
          Max Tokens
          <span
            className="ml-1 text-muted-foreground hover:cursor-help"
            title="Maximum length of the model's response"
          >
            ⓘ
          </span>
        </Label>
        <Input
          id="max-tokens"
          type="number"
          defaultValue="250"
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center">
            Detect Emotion
            <span
              className="ml-1 text-muted-foreground hover:cursor-help"
              title="Enable emotion detection in responses"
            >
              ⓘ
            </span>
          </Label>
          <p className="text-sm text-muted-foreground">
            Detect emotions in customer responses
          </p>
        </div>
        <Switch />
      </div>
    </div>
  );
}
