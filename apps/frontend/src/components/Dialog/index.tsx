import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function BaseDialog({
  title,
  description,
  children,
  type,
  onSubmit,
  loading = false,
  isOpen = false,
  onOpenChange,
  showSubmitButton = true,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  type?: string;
  onSubmit?: () => void;
  loading?: boolean;
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  showSubmitButton?: boolean;
}) {
  let buttonText;

  switch (type) {
    case "create":
      buttonText = "Create";
      break;
    case "edit":
      buttonText = "Change";
      break;
    default:
      buttonText = "Submit";
      break;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
        <DialogFooter className="px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {showSubmitButton && (
            <Button
              type="submit"
              className="bg-[#F86800] hover:bg-[#d95f00] text-white font-semibold"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                buttonText
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
