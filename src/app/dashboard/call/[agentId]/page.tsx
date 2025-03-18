"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CallPage() {
  const params = useParams();
  const agentId = params.agentId;
  const router = useRouter();

  const [isCallActive, setIsCallActive] = useState(false);

  const handleGoBack = () => {
    router.push("/dashboard/agents");
  };

  const handleToggleCall = () => {
    setIsCallActive(!isCallActive);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        onClick={handleGoBack} 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Agents
      </Button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Call with Agent</h1>
        <div className="text-lg mb-6">
          <span className="font-semibold">Agent ID:</span> {agentId}
        </div>

        <Button 
          onClick={handleToggleCall}
          variant={isCallActive ? "destructive" : "default"}
          className="w-full md:w-auto"
        >
          {isCallActive ? "End Call" : "Start Call"}
        </Button>

        {isCallActive && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <p className="text-center text-gray-700">
              Call is active with Agent ID: {agentId}
            </p>
            {/* You can add call controls, transcript, etc. here */}
          </div>
        )}
      </div>
    </div>
  );
} 