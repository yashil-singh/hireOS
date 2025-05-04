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
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

type DeleteAlertProps = {
  trigger?: React.ReactNode;
  itemName?: string;
  onConfirm?: () => void;
  children?: React.ReactNode;
};

const DeleteAlert = ({
  children,
  trigger,
  itemName,
  onConfirm,
}: DeleteAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="destructive">
            <Trash2 /> <span className="hidden md:block">Delete</span>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {itemName ? itemName : "item"}?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlert;
