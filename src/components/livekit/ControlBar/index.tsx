import {
    AgentState,
    DisconnectButton,
    VoiceAssistantControlBar,
  } from "@livekit/components-react";
  import { AnimatePresence, motion } from "framer-motion";

  import { CloseIcon } from "@/components/CloseIcon";

export default function ControlBar(props: { onConnectButtonClicked: () => void; agentState: AgentState }) {
    return (
      <div className="relative h-[100px]">
        <AnimatePresence>
          {props.agentState === "disconnected" && (
            <motion.button
              initial={{ opacity: 0, top: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, top: "-10px" }}
              transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
              className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
              onClick={() => props.onConnectButtonClicked()}
            >
              Start a conversation
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {props.agentState !== "disconnected" && props.agentState !== "connecting" && (
            <motion.div
              initial={{ opacity: 0, top: "10px" }}
              animate={{ opacity: 1, top: 0 }}
              exit={{ opacity: 0, top: "-10px" }}
              transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
              className="flex h-8 absolute left-1/2 -translate-x-1/2  justify-center items-center"
            >
              <VoiceAssistantControlBar controls={{ leave: false }} />
              <DisconnectButton>
                <CloseIcon />
              </DisconnectButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  } 