import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Image from "next/image";

interface GoogleButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
  mode: "signin" | "signup";
}

export function GoogleButton({ onClick, isLoading, mode }: GoogleButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-full border border-gray-200 rounded-lg py-2.5 mb-6"
      variant="outline"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <>
          <Image
            src="/google.png"
            alt="Google"
            className="h-5 w-5 mr-2"
            width={20}
            height={20}
          />
          Sign {mode === "signin" ? "in" : "up"} with Google
        </>
      )}
    </Button>
  );
} 