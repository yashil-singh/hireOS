import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { sendLetter } from ".";

export const useSendLetter = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: sendLetter,
    onSuccess: ({ message, data }) => {
      toast.success(message, {
        action: {
          label: "View",
          onClick: () => navigate(`/letters/${data._id}`),
        },
      });
    },
    onError: ({ message }) => toast.error(message),
  });
};
