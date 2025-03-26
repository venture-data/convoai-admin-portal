import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UnsavedChangesDialogProps {
  isOpen: boolean
  onClose: () => void
  onDiscard: () => void
  onSave: () => void
}

export function UnsavedChangesDialog({
  isOpen,
  onClose,
  onDiscard,
  onSave,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 sm:max-w-[425px] bg-[#0F1117] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">Unsaved Changes</DialogTitle>
          <DialogDescription className="text-white/60 text-[13px]">
            You have unsaved changes. What would you like to do?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onDiscard}
            className="flex-1 bg-white hover:bg-gray-100 text-black border-0"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 