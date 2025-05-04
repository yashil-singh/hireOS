import { Interviewer } from "@/services/interviewer/types";
import { useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Mail, Pen, Phone, Trash2 } from "lucide-react";
import DynamicDialog from "../dialogs/DynamicDialog";
import InterviewerForm from "../forms/Interviewer/InterviewerForm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { interviwerSchema } from "@/lib/schemas/calendarSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import DiscardChangesAlert from "../dialogs/DiscardChangesAlert";
import AccountAvatar from "./AccountAvatar";
import DeleteAlert from "../dialogs/DeleteAlert";

type InterviewerCardProps = {
  interviewer: Interviewer;
};

const InterviewerCard = ({ interviewer }: InterviewerCardProps) => {
  const { name, phone, email, avatarUrl } = interviewer;

  const [isEditing, setIsEditing] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const form = useForm<z.infer<typeof interviwerSchema>>({
    defaultValues: {
      name: interviewer.name,
      email: interviewer.email,
      phone: interviewer.phone,
    },
    resolver: zodResolver(interviwerSchema),
  });

  const { isDirty } = form.formState;

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (isDirty) {
        setIsDiscarding(true);
        return;
      }
    }

    setIsEditing(isOpen);
    form.reset();
  };

  const onEdit = async (values: z.infer<typeof interviwerSchema>) => {
    console.log("🚀 ~ InterviewerCard.tsx:60 ~ values:", values);
  };

  return (
    <>
      <Card className="gap-1">
        <CardHeader>
          <div className="flex items-center gap-4">
            <AccountAvatar avatarUrl={avatarUrl} />
            <span>
              <CardTitle className="text-primary text-lg">{name}</CardTitle>
              <CardDescription className="text-foreground space-y-2">
                <span className="flex items-center gap-1">
                  <Mail className="size-5" /> {email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="size-5" /> {phone}
                </span>
              </CardDescription>
            </span>
          </div>
        </CardHeader>

        <CardFooter className="justify-end gap-2 pt-2">
          <DeleteAlert
            itemName="interviewer"
            trigger={
              <Button variant="destructive">
                <Trash2 /> Delete
              </Button>
            }
          >
            <div className="flex items-center gap-2">
              <AccountAvatar avatarUrl={avatarUrl} className="size-6" />
              <span className="text-muted-foreground text-sm">
                {name} • {email}
              </span>
            </div>
          </DeleteAlert>
          <DynamicDialog
            title="Edit assessment"
            description="Create and upload assessment materials and assign them to selected candidates. You can include optional notes and set a deadline."
            open={isEditing}
            onOpenChange={onOpenChange}
            trigger={
              <Button>
                <Pen /> Edit
              </Button>
            }
          >
            <InterviewerForm form={form} onSubmit={onEdit} />
          </DynamicDialog>
        </CardFooter>
      </Card>

      <DiscardChangesAlert
        open={isDiscarding}
        onOpenChange={setIsDiscarding}
        onConfirm={() => {
          setIsEditing(false);
          form.reset();
        }}
      />
    </>
  );
};

export default InterviewerCard;
