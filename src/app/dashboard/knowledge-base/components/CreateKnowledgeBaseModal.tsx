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
import { Textarea } from "@/components/ui/textarea";
import { Brain, AlertCircle, BookOpen, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateKnowledgeBaseData } from "../types";

interface CreateKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateKnowledgeBaseData) => Promise<void>;
}

export function CreateKnowledgeBaseModal({ isOpen, onClose, onSubmit }: CreateKnowledgeBaseModalProps) {
  const [formData, setFormData] = useState<CreateKnowledgeBaseData>({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: "", description: "" });
      setError(null);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Only include description if it's not empty
      const submitData: CreateKnowledgeBaseData = {
        name: formData.name.trim(),
        ...(formData.description?.trim() && { description: formData.description.trim() })
      };
      await onSubmit(submitData);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create knowledge base");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1A1D25] border-white/10 text-white p-0">
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-orange-400" />
            Create Knowledge Base
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Create a new knowledge base to organize your documents and information.
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
              <Label htmlFor="name" className="text-white/90">
                Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="e.g. Product Documentation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20 pl-9"
                  required
                  maxLength={100}
                />
                <BookOpen className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-white/50">
                Choose a descriptive name for your knowledge base
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/90">
                Description
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="e.g. Knowledge base for product documentation and FAQs"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20 pl-9 min-h-[80px] resize-none"
                  maxLength={500}
                />
                <FileText className="h-4 w-4 text-white/40 absolute left-3 top-3" />
              </div>
              <p className="text-xs text-white/50">
                Provide a brief description of what this knowledge base contains (optional)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Create Knowledge Base
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 