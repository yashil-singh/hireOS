import { Assessment } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AccountAvatar from "./AccountAvatar";
import { Button } from "../ui/button";
import { format } from "date-fns";
import {
  Check,
  Download,
  EllipsisVertical,
  Eye,
  LinkIcon,
  Pen,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  assessmentSchema,
  assignAssessmentSchema,
} from "@/lib/schemas/assessmentSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import AssessmentForm from "../forms/Assessment/AssessmentForm";
import DiscardChangesAlert from "../dialogs/DiscardChangesAlert";
import DynamicDialog from "../dialogs/DynamicDialog";
import { Link } from "react-router-dom";
import AssignAssessmentForm from "../forms/Assessment/AssignAssessmentForm";
import { Badge } from "../ui/badge";

type EditFromValues = z.infer<typeof assessmentSchema>;
type AssignFormValues = z.infer<typeof assignAssessmentSchema>;

const AssessmentCard = ({ assessment }: { assessment: Assessment }) => {
  const { title, description, date, candidates } = assessment;

  // Related to assigned candidate avatars
  const maxAvatars = 3;
  const totalNumber = candidates.length;
  const remaining = totalNumber - maxAvatars;

  // States related to edit dialog
  const [isEditing, setIsEditing] = useState(false);
  const [editCancelDialog, setEditCancelDialog] = useState(false);

  // States related to assign dialog
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignCancelDialog, setAssignCancelDialog] = useState(false);

  const editForm = useForm<EditFromValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: assessment.title,
      description: assessment.description,
      format: assessment.format,
      type: assessment.type,
      assessmentFile: undefined,
      link: assessment.link,
    },
  });

  function onEditDialogOpenChange(isOpen: boolean) {
    if (!isOpen) {
      if (editForm.formState.isDirty) {
        setEditCancelDialog(true);
        return;
      }
    }

    setIsEditing(isOpen);
    editForm.reset();
  }

  const onEdit = async (values: EditFromValues) => {
    console.log("🚀 ~ AssessmentCard.tsx:80 ~ values:", values);
  };

  const assignForm = useForm<AssignFormValues>({
    resolver: zodResolver(assignAssessmentSchema),
    defaultValues: {
      assessmentId: assessment.id,
      candidates: [],
    },
  });

  const onAssignDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAssignCancelDialog(true);
      return;
    }

    setIsAssigning(isOpen);
    assignForm.reset();
  };

  const onAssign = async (values: AssignFormValues) => {
    console.log("🚀 ~ AssessmentCard.tsx:116 ~ values:", values);
  };

  return (
    <>
      <Card className="gap-1">
        <CardHeader>
          <div className="flex justify-between">
            <span>
              <CardTitle className="text-primary text-lg">{title}</CardTitle>
              <CardDescription className="text-foreground">
                Created on {format(date, "do MMMM yyyy")}
              </CardDescription>
            </span>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip delayDuration={1000}>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">More</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {assessment.format === "file" ? (
                    <DropdownMenuItem>
                      <Download /> Download
                    </DropdownMenuItem>
                  ) : (
                    <Link to={assessment.link!} target="_blank">
                      <DropdownMenuItem>
                        <LinkIcon /> Visit
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <DropdownMenuItem>
                    <RotateCcw /> Resend
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-destructive hover:text-destructive!">
                    <Trash2 className="text-destructive" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-1">
          <Badge className="capitalize">{assessment.format}</Badge>

          <p className="text-muted-foreground line-clamp-3 text-sm md:h-16">
            {description}
          </p>

          {candidates.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <p>Assigned to</p>
              <div className="flex items-center gap-0.5">
                <div className="flex items-center -space-x-2.5">
                  {candidates.slice(0, maxAvatars).map((candidate, index) => (
                    <AccountAvatar
                      key={candidate.id || index}
                      className="size-5"
                      avatarUrl=""
                    />
                  ))}
                </div>
                {remaining > 0 && <p>+{remaining} more</p>}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-end gap-2 pt-2">
          <DynamicDialog
            title="Assign assessment"
            description="Select one or more candidates to assign this assessment.
You must select at least one candidate before proceeding."
            open={isAssigning}
            onOpenChange={onAssignDialogOpenChange}
            trigger={
              <Button variant="ghost">
                <Check /> Assign
              </Button>
            }
            showScrollTopButton={true}
            className="max-w-[700px]!"
          >
            <AssignAssessmentForm form={assignForm} onSubmit={onAssign} />
          </DynamicDialog>

          <DynamicDialog
            title="Edit assessment"
            description="Create and upload assessment materials and assign them to selected candidates. You can include optional notes and set a deadline."
            open={isEditing}
            onOpenChange={onEditDialogOpenChange}
            trigger={
              <Button variant="ghost">
                <Pen /> Edit
              </Button>
            }
          >
            <AssessmentForm form={editForm} onSubmit={onEdit} />
          </DynamicDialog>

          <Button variant="ghost" asChild>
            <Link to={`/assessments/${assessment.id}`}>
              <Eye /> View
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <DiscardChangesAlert
        open={editCancelDialog}
        onOpenChange={setEditCancelDialog}
        onConfirm={() => {
          setIsEditing(false);
          editForm.reset();
        }}
      />

      <DiscardChangesAlert
        open={assignCancelDialog}
        onOpenChange={setAssignCancelDialog}
        onConfirm={() => {
          setIsAssigning(false);
          assignForm.reset();
        }}
      />
    </>
  );
};

export default AssessmentCard;
