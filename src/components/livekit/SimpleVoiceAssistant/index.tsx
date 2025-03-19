import { useEffect } from "react";
import { AgentState, BarVisualizer, useVoiceAssistant } from "@livekit/components-react";


export default function SimpleVoiceAssistant(props: { onStateChange: (state: AgentState) => void }) {
    const { state, audioTrack } = useVoiceAssistant();
  
    useEffect(() => {
      props.onStateChange(state);
    }, [props, state, audioTrack]);
    
    return (
      <div className="h-[300px] max-w-[90vw] mx-auto flex flex-col items-center justify-center rounded-md">
        <div className="w-full h-[200px] flex items-center justify-center rounded-md ">
          <BarVisualizer
            state={state}
            barCount={20}
            trackRef={audioTrack}
            className="w-full h-full rounded-md"
            options={{ 
              minHeight: 5, 
              maxHeight: 90
            }}
          />
      
        </div>
        
        <div className="mt-4 text-sm">
          State: <span className="font-bold">{state}</span>
        </div>
      </div>
    );
  }
  
  