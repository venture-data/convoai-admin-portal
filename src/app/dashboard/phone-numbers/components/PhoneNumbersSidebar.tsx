"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneIcon, PhoneIncoming, PhoneOutgoing, Trash2, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useSip } from "@/app/hooks/use-sip";
import { toast } from "@/app/hooks/use-toast";
import { SipTrunkItem } from "../types";

interface SipTrunkResponse {
  items: SipTrunkItem[];
}

interface SidebarProps {
  isLoading: boolean;
  displayedPhoneNumbers: SipTrunkResponse;
  selectedPhoneNumberId: string | null;
  handleSelectPhoneNumber: (phoneNumber: SipTrunkItem | null) => void;
  handleDeletePhoneNumber: (phoneNumber: SipTrunkItem) => void;
  deletingPhoneNumberId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsTemplateModalOpen: (open: boolean) => void;
}

function Sidebar({
  isLoading,
  displayedPhoneNumbers,
  selectedPhoneNumberId,
  handleSelectPhoneNumber,
  searchQuery,
  setSearchQuery,
  setIsTemplateModalOpen
}: SidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { deleteSipTrunk } = useSip();

  const filteredPhoneNumbers = displayedPhoneNumbers?.items?.filter(phoneNumber => 
    phoneNumber.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    phoneNumber.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = async (phoneNumber: SipTrunkItem) => {
    try {
      setDeletingId(phoneNumber.id);
      await deleteSipTrunk(phoneNumber.id);
      toast({
        title: "Success",
        description: "Phone number deleted successfully",
        variant: "default",
      });
      if (selectedPhoneNumberId === phoneNumber.id) {
        handleSelectPhoneNumber(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete phone number",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <aside className="sticky top-0 h-[100vh] w-[280px] flex-shrink-0 bg-[#1A1D25] border-r border-white/10">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <PhoneIcon className="h-5 w-5 text-orange-400" />
            <h3 className="text-xl font-bold text-white">Phone Numbers</h3>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search phone numbers..."
              className="w-full bg-[#1A1D25]/70 border-white/10 text-white pl-9 rounded-md text-sm placeholder:text-white/60 focus:border-orange-500/50 focus:ring-orange-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <PhoneIcon className="h-4 w-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
            onClick={() => setIsTemplateModalOpen(true)}
          >
            + Create Phone Number
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto sidebar-scroll p-4 space-y-2">
          <style jsx global>{`
            .sidebar-scroll::-webkit-scrollbar {
              width: 4px;
              margin-left: 8px;
            }
            
            .sidebar-scroll::-webkit-scrollbar-track {
              background: transparent;
              margin: 4px;
            }
            
            .sidebar-scroll::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              border: 4px solid transparent;
              background-clip: padding-box;
            }

            .sidebar-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
              border: 4px solid transparent;
              background-clip: padding-box;
            }

            /* For Firefox */
            .sidebar-scroll {
              scrollbar-width: thin;
              scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
            }
          `}</style>
          
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={`phone-number-skeleton-${i}`} className="p-3 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <Skeleton className="h-6 w-6 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPhoneNumbers.map((phoneNumber: SipTrunkItem) => (
                <motion.div
                  key={phoneNumber.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 rounded-lg transition-all cursor-pointer
                    ${selectedPhoneNumberId === phoneNumber.id 
                      ? 'bg-gradient-to-br from-[#1A1D25]/80 via-[#1A1D25]/60 to-orange-950/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]' 
                      : 'bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10 hover:border-white/20'
                    }`}
                >
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div 
                      className="grid grid-cols-[auto_1fr] gap-3 items-center" 
                      onClick={() => handleSelectPhoneNumber(phoneNumber)}
                    >
                      {phoneNumber.trunk_type === 'inbound' ? (
                        <PhoneIncoming className="w-5 h-5 text-orange-400" />
                      ) : (
                        <PhoneOutgoing className="w-5 h-5 text-orange-400" />
                      )}
                      <div>
                        <p className="text-sm text-white/90">{phoneNumber.phone_number}</p>
                        <p className="text-xs text-white/60">
                          {phoneNumber.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 relative h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(phoneNumber);
                      }}
                      disabled={deletingId === phoneNumber.id}
                    >
                      {deletingId === phoneNumber.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;