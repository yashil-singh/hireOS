import AccountAvatar from "@/components/shared/AccountAvatar";
import BackButton from "@/components/shared/BackButton";
import Rating from "@/components/shared/Rating";
import ToTopButton from "@/components/shared/ToTopButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetAssessmentById } from "@/services/assessments/queries";
import { Link, useParams } from "react-router-dom";
import NotFound from "../NotFound";
import AssessmentDetailsSkeleton from "@/components/skeletons/AssessmentDetailsSkeleton";
import { format } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import NoData from "@/components/shared/NoData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  EllipsisVertical,
  ExternalLink,
  Eye,
  Pen,
  Plus,
  Trash2,
} from "lucide-react";
import EvaluateCard from "@/components/shared/EvaluateCard";
import { useForm } from "react-hook-form";
import { AssignAssessmentFormValues } from "@/services/assessments/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignAssessmentSchema } from "@/lib/schemas/assessmentSchemas";
import { useState } from "react";
import { useAssignAssessment } from "@/services/assessments/mutations";
import DynamicDialog from "@/components/dialogs/DynamicDialog";
import AssignAssessmentForm from "@/components/forms/Assessment/AssignAssessmentForm";
import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";

const AssessmentDetails = () => {
  const { id } = useParams();

  // States related to assign dialog
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignCancelDialog, setAssignCancelDialog] = useState(false);

  // Queries
  const { data, isPending, error } = useGetAssessmentById(id!);

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

  if (isPending) return <AssessmentDetailsSkeleton />;

  if (!data || error) return <NotFound label="assessment" />;

  const assessment = data.data;
  const {
    title,
    description,
    createdAt,
    technologies,
    assignments,
    assessmentType,
    fileUrl,
    link,
    format: assessmentFormat,
  } = assessment;

  const pending = assignments.filter((a) => a.status === "pending");
  const evaluated = assignments.filter((a) => a.status === "evaluated");

  const onAssign = async (values: AssignAssessmentFormValues) => {
    await assignMutation.mutateAsync(
      {
        id: id!,
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

  const onAssignDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAssignCancelDialog(true);
      return;
    }

    setIsAssigning(isOpen);
    assignForm.reset();
  };

  return (
    <div className="relative space-y-4">
      <BackButton />

      <div>
        <div className="flex justify-between gap-8 md:justify-start">
          <h1 className="page-heading">
            {title} -{" "}
            <span className="capitalize">{assessmentType} Assessment</span>
          </h1>

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
                <DropdownMenuItem>
                  <Pen /> Edit
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
        <p className="text-lg">
          Assessment Format:{" "}
          <span className="capitalize">{assessmentFormat}</span>
        </p>
        <p className="text-muted-foreground">
          Created on {format(new Date(createdAt), DEFAULT_DATE_FORMAT)}
        </p>

        <div className="my-2 space-x-2">
          {technologies.map((tech) => (
            <Badge key={tech} className="text-sm font-bold capitalize">
              {tech}
            </Badge>
          ))}
        </div>

        <p className="page-description">{description}</p>
      </div>

      {assessmentFormat === "file" && (
        <p>
          Assessment File:{" "}
          <Link
            className="text-primary underline"
            target="_blank"
            to={fileUrl ?? ""}
          >
            {fileUrl}
          </Link>
        </p>
      )}
      {assessmentFormat === "link" && (
        <p>
          Assessment Link:{" "}
          <Link
            className="text-primary underline"
            target="_blank"
            to={link ?? ""}
          >
            {link}
          </Link>
        </p>
      )}

      <div className="flex items-center justify-between gap-4 md:justify-start">
        <h2 className="text-lg font-semibold">
          Assigned Candidates ({assignments.length})
        </h2>

        <DynamicDialog
          title="Assign assessment"
          description="Select one or more candidates to assign this assessment.
You must select at least one candidate before proceeding."
          open={isAssigning}
          onOpenChange={onAssignDialogOpenChange}
          trigger={
            <Button variant="ghost">
              <Plus /> <span className="hidden md:block">Assign</span>
            </Button>
          }
          showScrollTopButton={true}
        >
          <AssignAssessmentForm form={assignForm} onSubmit={onAssign} />
        </DynamicDialog>
      </div>

      {assignments.length > 0 ? (
        <div className="flex min-h-[50vh] flex-col gap-8 overflow-hidden xl:flex-row">
          <div className="h-full w-full space-y-2">
            <h2 className="text-lg font-semibold">
              Remaining Evaluations ({pending.length})
            </h2>
            {pending.length > 0 ? (
              pending.map((assignment) => (
                <EvaluateCard
                  assessment={assessment}
                  key={assignment._id}
                  candidate={assignment.candidate}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center">
                No candidates reamining to evaluate.
              </p>
            )}
          </div>

          <div className="hidden xl:block">
            <Separator orientation="vertical" />
          </div>

          <div className="h-full w-full space-y-2">
            <h2 className="text-lg font-semibold">
              Evaluated ({evaluated.length})
            </h2>

            <div className="space-y-4">
              {evaluated.length > 0 ? (
                evaluated.map((assignment) => {
                  const { _id, candidate, remarks, rating } = assignment;
                  return (
                    <div
                      className="bg-card space-y-4 rounded-xl border p-4"
                      key={`evaluated-${_id}-candidate-${candidate._id}`}
                    >
                      <Link
                        to={`/candidates/${candidate._id}`}
                        className="flex items-center gap-4"
                      >
                        <AccountAvatar avatarUrl={candidate.avatarUrl} />
                        <div className="flex flex-col">
                          <b>
                            {candidate.name} • {candidate.level}
                          </b>
                          <span>{candidate.email}</span>
                        </div>
                      </Link>

                      <div className="flex gap-2">
                        {candidate.technology.map((tech) => (
                          <Badge
                            key={`evaluated-${_id}-candidate-${candidate._id}-${tech}`}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <p>{remarks}</p>

                      <div className="flex items-center justify-between gap-4">
                        <Rating
                          value={rating!}
                          onChange={() => {}}
                          starSize={20}
                          labelClassName="text-3xl"
                          disabled
                        />

                        {assessment.format === "file" && (
                          <Button>
                            <Eye /> View File
                          </Button>
                        )}
                        {assessment.format === "link" && (
                          <Button>
                            <ExternalLink /> Visit
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center">
                  No evaluations made yet.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <NoData item="assigned candidates" className="mt-4" />
      )}

      <ToTopButton />

      <DiscardChangesAlert
        open={assignCancelDialog}
        onOpenChange={setAssignCancelDialog}
        onConfirm={() => {
          setIsAssigning(false);
          assignForm.reset();
        }}
      />
    </div>
  );
};

export default AssessmentDetails;
