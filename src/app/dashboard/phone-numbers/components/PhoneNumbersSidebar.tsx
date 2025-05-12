"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { formatDistanceToNow } from "date-fns";
import { SipTrunkItem } from "../types";

interface SipTrunkResponse {
  items: SipTrunkItem[];
}

interface SidebarProps {
  isLoading: boolean;
  displayedPhoneNumbers: SipTrunkResponse;
  selectedPhoneNumberId: string | null;
  handleSelectPhoneNumber: (phoneNumber: SipTrunkItem) => void;
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
  handleDeletePhoneNumber,
  deletingPhoneNumberId,
  searchQuery,
  setSearchQuery,
  setIsTemplateModalOpen
}: SidebarProps) {

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
              {displayedPhoneNumbers?.items?.map((phoneNumber: SipTrunkItem) => (
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
                    <div className="grid grid-cols-[auto_1fr] gap-3 items-center" onClick={() => handleSelectPhoneNumber(phoneNumber)}>
                      <PhoneIcon className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-sm text-white/90">{phoneNumber.phone_number}</p>
                        <p className="text-xs text-white/60">
                          {phoneNumber.updated_at ? `Last updated ${formatDistanceToNow(new Date(phoneNumber.updated_at))} ago` : 'Recently updated'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 relative h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoneNumber(phoneNumber);
                      }}
                      disabled={deletingPhoneNumberId === phoneNumber.id}
                    >
                      {deletingPhoneNumberId === phoneNumber.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <motion.svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </motion.svg>
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