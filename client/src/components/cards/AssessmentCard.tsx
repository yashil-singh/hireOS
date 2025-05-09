import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AccountAvatar from "../shared/AccountAvatar";
import { Button } from "../ui/button";
import { format } from "date-fns";
import {
  Check,
  Download,
  EllipsisVertical,
  Info,
  LinkIcon,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { assignAssessmentSchema } from "@/lib/schemas/assessmentSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import DiscardChangesAlert from "../dialogs/DiscardChangesAlert";
import DynamicDialog from "../dialogs/DynamicDialog";
import { Link } from "react-router-dom";
import AssignAssessmentForm from "../forms/Assessment/AssignAssessmentForm";
import { Badge } from "../ui/badge";
import {
  Assessment,
  AssignAssessmentFormValues,
} from "@/services/assessments/types";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { useAssignAssessment } from "@/services/assessments/mutations";

const AssessmentCard = ({ assessment }: { assessment: Assessment }) => {
  const { _id, title, description, createdAt, assignments } = assessment;

  // Related to assigned candidate avatars
  const maxAvatars = 3;
  const totalNumber = assignments.length;
  const remaining = totalNumber - maxAvatars;

  // States related to assign dialog
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignCancelDialog, setAssignCancelDialog] = useState(false);

  // Mutations
  const assignMutation = useAssignAssessment();

  const assignForm = useForm<AssignAssessmentFormValues>({
    resolver: zodResolver(assignAssessmentSchema),
    defaultValues: {
      candidates: [],
      deadlineDate: undefined,
      deadlineTime: undefined,
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

  const onAssign = async (values: AssignAssessmentFormValues) => {
    await assignMutation.mutateAsync(
      {
        id: _id,
        data: values,
      },
      {
        onSuccess: () => {
          assignForm.reset();
          setIsAssigning(false);
        },
      },
    );
  };

  return (
    <>
      <Card className="gap-1">
        <CardHeader>
          <div className="flex justify-between">
            <span>
              <CardTitle className="text-primary text-lg">{title}</CardTitle>
              <CardDescription className="text-foreground">
                Created on {format(createdAt, DEFAULT_DATE_FORMAT)}
              </CardDescription>
            </span>

            <DropdownMenu>
              <Tooltip>
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
          {assessment.technologies.map((tech) => (
            <Badge key={assessment._id + tech} className="capitalize">
              {tech}
            </Badge>
          ))}

          <p className="text-muted-foreground line-clamp-3 text-sm md:h-16">
            {description}
          </p>

          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5">
              <div className="flex items-center -space-x-2.5">
                {assignments.slice(0, maxAvatars).map((assigment, index) => (
                  <AccountAvatar
                    key={assigment.candidate._id || index}
                    className="size-5"
                    avatarUrl=""
                  />
                ))}
              </div>
              {remaining > 0 && <p>+{remaining} more</p>}
            </div>
            <p>
              {assignments.length > 0
                ? `Assigned to ${assignments
                    .slice(0, maxAvatars)
                    .map((assignment) => assignment.candidate.name)
                    .join(
                      ", ",
                    )} ${assignments.length > 1 ? `and ${remaining} more` : ""}`
                : "Not assigned yet."}
            </p>
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-2 pt-2">
          <DynamicDialog
            title="Assign assessment"
            description="Select one or more candidates to assign this assessment.
You must select at least one candidate before proceeding."
            open={isAssigning}
            onOpenChange={onAssignDialogOpenChange}
            trigger={
              <Button>
                <Check /> Assign
              </Button>
            }
            showScrollTopButton={true}
          >
            <AssignAssessmentForm form={assignForm} onSubmit={onAssign} />
          </DynamicDialog>

          <Button variant="outline" asChild>
            <Link to={`/assessments/${assessment._id}`}>
              <Info /> Details
            </Link>
          </Button>
        </CardFooter>
      </Card>

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
