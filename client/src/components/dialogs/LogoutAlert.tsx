import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { clearUser } from "@/lib/slices/session/sessionSlice";
import { AppDispatch } from "@/lib/slices/store";
import { logout } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LogoutAlert = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: ({ message }) => {
      toast.success(message);
      dispatch(clearUser());
    },
    onError: ({ message }) => toast.error(message),
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Logout</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to log out? You’ll need to sign in again to
          access your account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default LogoutAlert;
