"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { formatDistanceToNow } from "date-fns";
import { Agent } from "../types";


interface SidebarProps {
  isLoading: boolean;
  displayedAgents: Agent[];
  selectedAgentId: string | null;
  handleSelectAgent: (agent: Agent) => void;
  handleDeleteAgent: (agent: Agent) => void;
  deletingAgentId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsTemplateModalOpen: (open: boolean) => void;
}



function Sidebar({isLoading, displayedAgents, selectedAgentId, handleSelectAgent, handleDeleteAgent, deletingAgentId, searchQuery, setSearchQuery, setIsTemplateModalOpen}:SidebarProps) {
  return (
    <aside className="sticky top-[40px] self-start h-[calc(100vh-40px)] backdrop-blur-xl bg-[#1A1D25]/70 border-r border-white/10">
    <div className="p-4 grid grid-rows-[auto_auto_1fr] h-full">
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search assistants..."
          className="w-full bg-[#1A1D25]/70 border-white/10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button 
        className="w-full mb-4 bg-gradient-to-r from-orange-500 to-red-500"
        onClick={() => setIsTemplateModalOpen(true)}
      >
        + Create Assistant
      </Button>

      <div className="pr-4 overflow-y-auto sidebar-scroll">
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
            padding-right: 8px;
          }
        `}</style>
        <div className="space-y-2">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-2">
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
              {displayedAgents?.map((agent: Agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className={`p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors ${
                    selectedAgentId === agent.id ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div className="grid grid-cols-[auto_1fr] gap-3 items-center" onClick={() => handleSelectAgent(agent)}>
                      <BotIcon className="w-6 h-6 text-orange-500" />
                      <div>
                        <p className="text-sm text-white">{agent.name}</p>
                        <p className="text-xs text-gray-400">
                          {agent.updated_at ? `Last updated ${formatDistanceToNow(new Date(agent.updated_at))} ago` : 'Recently updated'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAgent(agent);
                      }}
                      disabled={deletingAgentId === agent.id}
                    >
                      {deletingAgentId === agent.id ? (
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
    </div>
  </aside>
  )
}

export default Sidebar;