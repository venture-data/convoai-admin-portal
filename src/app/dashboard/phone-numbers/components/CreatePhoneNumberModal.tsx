"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, Server, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PhoneNumberFormData) => Promise<void>;
}

interface PhoneNumberFormData {
  name: string;
  phone_number: string;
  sip_termination_uri: string;
  username: string;
  password: string;
  trunk_type: 'inbound' | 'outbound';
}

export function CreatePhoneNumberModal({ isOpen, onClose, onSubmit }: CreatePhoneNumberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PhoneNumberFormData>({
    name: "",
    phone_number: "",
    sip_termination_uri: "livekit-integration-test.pstn.twilio.com",
    username: "",
    password: "",
    trunk_type: "inbound"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setIsLoading(true);
      const response = await onSubmit(formData);
      console.log("response", response);
      
      onClose();
    } catch (err) {
      console.error("Failed to create phone number:", err);
      let errorMessage = "Failed to create phone number";
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.detail) {
            if (errorData.detail.includes("Conflicting inbound SIP Trunks")) {
              const phoneNumber = formData.phone_number;
              errorMessage = `Phone number ${phoneNumber} is already in use. Please use a different phone number.`;
            } else {
              errorMessage = errorData.detail;
            }
          }
        } catch {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      name: "",
      phone_number: "",
      sip_termination_uri: "livekit-integration-test.pstn.twilio.com",
      username: "",
      password: "",
      trunk_type: "inbound"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1A1D25] border-white/10 text-white p-0">
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Phone className="h-5 w-5 text-orange-400" />
            Register Phone Number
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Configure your SIP trunk settings to register a new phone number.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Company Main Line"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number (E.164 format)</Label>
              <Input
                placeholder="12185857512"
                value={formData.phone_number}
                maxLength={12}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
                required
                title="Please enter a valid E.164 phone number (e.g. +12185857512)"
              />
            </div>

            <div className="space-y-2">
              <Label>SIP Termination URI</Label>
              <Input
                value={formData.sip_termination_uri}
                onChange={(e) => setFormData({ ...formData, sip_termination_uri: e.target.value })}
                className="bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
                required
              />
              <p className="text-xs text-white/60">The SIP URI where calls will be terminated</p>
            </div>

            <div className="space-y-2">
              <Label>Trunk Type</Label>
              <Select
                value={formData.trunk_type}
                onValueChange={(value: 'inbound' | 'outbound') => 
                  setFormData({ ...formData, trunk_type: value })
                }
              >
                <SelectTrigger className="bg-[#1A1D25]/70 border-white/10 text-white">
                  <SelectValue placeholder="Select trunk type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1D25] border-white/10">
                  <SelectItem value="inbound" className="text-white">Inbound</SelectItem>
                  <SelectItem value="outbound" className="text-white">Outbound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="hover:bg-orange-500/10 hover:text-orange-400 focus:ring-orange-500/20 border-white/10 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:ring-orange-500/20 transition-colors"
            >
              {isLoading ? (
                <>
                  <Server className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Number'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 