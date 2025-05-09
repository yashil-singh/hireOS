import BackButton from "@/components/shared/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetAssessmentById } from "@/services/assessments/queries";
import { Link, useParams, useSearchParams } from "react-router-dom";
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
import { EllipsisVertical, Pen, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  AssessmentFormValues,
  AssignAssessmentFormValues,
} from "@/services/assessments/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assessmentSchema,
  assignAssessmentSchema,
} from "@/lib/schemas/assessmentSchemas";
import { useEffect, useMemo, useState } from "react";
import { useAssignAssessment } from "@/services/assessments/mutations";
import DynamicDialog from "@/components/dialogs/DynamicDialog";
import AssignAssessmentForm from "@/components/forms/Assessment/AssignAssessmentForm";
import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";
import EvaluatedCard from "@/components/cards/EvaluatedCard";
import RemainingEvaluationCard from "@/components/cards/RemainingEvaluationCard";
import AssessmentForm from "@/components/forms/Assessment/AssessmentForm";

const AssessmentDetails = () => {
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const assignParam = useMemo(() => searchParams.get("assign"), [searchParams]);

  // Queries
  const { data, isPending, error } = useGetAssessmentById(id!);
  // Mutations
  const assignMutation = useAssignAssessment();

  // Forms
  const editForm = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: [],
      assessmentType: "",
      format: undefined,
      assessmentFile: undefined,
      link: "",
    },
  });
  const assignForm = useForm<AssignAssessmentFormValues>({
    resolver: zodResolver(assignAssessmentSchema),
    defaultValues: {
      candidates: [],
      deadlineDate: undefined,
      deadlineTime: undefined,
    },
  });

  // States related to assign dialog
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignCancelDialog, setAssignCancelDialog] = useState(false);

  // States related to edit dialog
  const [isEditing, setIsEditing] = useState(false);
  const [editCancelDialog, setEditCancelDialog] = useState(false);

  const onAssignDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAssignCancelDialog(true);
      return;
    }

    setIsAssigning(isOpen);
    assignForm.reset();
  };
  const onEditDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (editForm.formState.isDirty) {
        setEditCancelDialog(true);
        return;
      }
    }

    setIsEditing(isOpen);
    editForm.reset();
  };

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
  const onEdit = async (values: AssessmentFormValues) => {
    console.log("🚀 ~ AssessmentCard.tsx:80 ~ values:", values);
  };

  useEffect(() => {
    if (assignParam) {
      setIsAssigning(true);
    }
  }, [assignParam]);

  if (isPending) return <AssessmentDetailsSkeleton />;

  if (error) return <NotFound label="Failed to load assessments." />;

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

  return (
    <div className="space-y-4">
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
                <DropdownMenuItem
                  onClick={() => {
                    setIsEditing(true);
                    editForm.reset({
                      title: assessment.title,
                      description: assessment.description,
                      technologies: assessment.technologies,
                      assessmentType: assessment.assessmentType,
                      format: assessment.format,
                      assessmentFile: assessment.format,
                      link: assessment.link,
                    });
                  }}
                >
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
                <RemainingEvaluationCard
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
                evaluated.map((assignment) => (
                  <EvaluatedCard
                    assessment={assessment}
                    assignment={assignment}
                  />
                ))
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

      <DynamicDialog
        title="Edit assessment"
        description="Create and upload assessment materials and assign them to selected candidates. You can include optional notes and set a deadline."
        open={isEditing}
        onOpenChange={onEditDialogOpenChange}
        trigger={<button className="sr-only">Edit</button>}
      >
        <AssessmentForm form={editForm} onSubmit={onEdit} />
      </DynamicDialog>

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
    </div>
  );
};

export default AssessmentDetails;
