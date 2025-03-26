import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileIcon } from "./icons/FileIcon";
import { ImageIcon, TrashIcon, VideoIcon, MusicIcon } from "lucide-react";
import { Button } from "./button";


export default function UploadFile({files, setFiles}: {files: File[], setFiles: (files: File[]) => void}) {
  return (
    <Card className="bg-inherit text-white">
      <CardContent className="p-6 space-y-4 bg-inherit">
        <div className="border-2  bg-inherit border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center relative">
          {files.length > 0 ? (
            <>
               {
                files[0].type.startsWith("image/") ? (
                    <ImageIcon className="w-12 h-12" />  
                ) : files[0].type.startsWith("video/") ? (
                    <VideoIcon className="w-12 h-12" />
                ) : files[0].type.startsWith("audio/") ? (
                    <MusicIcon className="w-12 h-12" />
                ) : (
                    <FileIcon className="w-12 h-12" />
                )   
               }
              <span className="text-sm font-medium text-white">
                {files[0].name}
              </span>
              <Button className="absolute top-2 right-2" variant="outline" size="icon" onClick={() => setFiles([])}>
                <TrashIcon className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <FileIcon className="w-12 h-12" />
              <span className="text-sm font-medium text-white">
                Drag and drop a file or click to browse
              </span>
              <span className="text-xs text-white">
                PDF, image, video, or audio
              </span>
              <Input
            id="file"
            type="file"
            className="w-full h-full cursor-pointer absolute inset-0 opacity-0"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFiles([...files, file]);
              }
            }}
            accept="image/*,video/*,audio/*,.pdf"
          />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
