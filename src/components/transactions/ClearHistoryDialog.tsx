
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ClearHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ClearHistoryDialog = ({ isOpen, onOpenChange, onConfirm }: ClearHistoryDialogProps) => {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      setIsClearing(true);
      await onConfirm();
      toast({
        title: "History cleared",
        description: "All transaction records have been deleted successfully.",
      });
    } catch (error) {
      console.error("Error clearing history:", error);
      toast({
        title: "Failed to clear history",
        description: "An error occurred while clearing transaction history.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Clear all transaction history?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your transaction records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1"
            disabled={isClearing}
          >
            {isClearing ? (
              <>Clearing...</>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Clear All
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearHistoryDialog;
