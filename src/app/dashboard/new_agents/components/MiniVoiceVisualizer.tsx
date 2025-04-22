import { useState, useEffect } from "react";
import { AgentState } from "@livekit/components-react";

function MiniVoiceVisualizer({ agentState }: { agentState: AgentState }) {
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    setIsPulsing(agentState === 'speaking' || agentState === 'listening');
  }, [agentState]);
  
  return (
    <div className="flex justify-center items-center h-40">
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="absolute w-20 h-20 bg-orange-500/5 rounded-full"></div>
        
        <div 
          className={`absolute w-28 h-28 bg-orange-500/5 rounded-full transition-all duration-200 ease-out ${
            isPulsing ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''
          }`}
        ></div>
        
        <div 
          className={`absolute w-36 h-36 bg-orange-500/5 rounded-full transition-all duration-300 ease-out ${
            isPulsing ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''
          }`}
        ></div>

        <div 
          className={`
            relative w-14 h-14 rounded-full flex items-center justify-center border-2
            transition-all duration-300 ease-out backdrop-blur-sm
            ${agentState === 'speaking' 
              ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/30 border-orange-500/60' 
              : agentState === 'listening' 
                ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/30 border-blue-500/60'
                : 'bg-gradient-to-br from-slate-500/10 to-slate-600/20 border-white/20'
            }
            ${isPulsing ? 'shadow-[0_0_10px_rgba(249,115,22,0.2)]' : ''}
          `}
        >
          <div className="text-white/90 text-[10px] font-medium">
            {agentState === "speaking" ? "Speaking" : 
             agentState === "listening" ? "Listening" : 
             agentState === "connecting" ? "Connecting" :
             agentState === "thinking" ? "Thinking" : "Ready"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniVoiceVisualizer; 