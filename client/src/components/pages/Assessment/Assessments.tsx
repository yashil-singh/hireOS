import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { assessmentSchema } from "@/lib/schemas/assessmentSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import DynamicDialog from "@/components/dialogs/DynamicDialog";
import { Button } from "@/components/ui/button";
import AssessmentForm from "@/components/forms/Assessment/AssessmentForm";
import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";
import AssessmentCard from "@/components/shared/AssessmentCard";
import SearchInput from "@/components/shared/SearchInput";
import { useGetAllAssessments } from "@/services/assessments/queries";
import CardLayoutSkeleton from "@/components/skeletons/CardLayoutSkeleton";
import NotFound from "../NotFound";
import NoData from "@/components/shared/NoData";
import { useCreateAssessment } from "@/services/assessments/mutations";

const Assessments = () => {
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );

  const [searchParams] = useSearchParams();
  const createParam = useMemo(() => searchParams.get("create"), [searchParams]);

  const [searchQuery, setSearchQuery] = useState("");

  // Dialog related states
  const [isCreating, setIsCreating] = useState(false);
  const [createCancelDialog, setCreateCancelDialog] = useState(false);

  // Queries
  const { data: assessmentsData, isPending: assessmentsLoading } =
    useGetAllAssessments();

  // Mutations
  const createMutation = useCreateAssessment();

  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: [],
      assessmentType: "",
      format: undefined,
      link: "",
      assessmentFile: undefined,
    },
  });

  const onCreate = async (values: z.infer<typeof assessmentSchema>) => {
    await createMutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        setIsCreating(false);
      },
    });
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (form.formState.isDirty) {
        setCreateCancelDialog(true);
        return;
      }
    }

    setIsCreating(isOpen);
    form.reset();
  };

  useEffect(() => {
    if (createParam === "true") {
      setIsCreating(true);
    }
  }, [createParam]);

  if (assessmentsLoading) return <CardLayoutSkeleton />;

  if (!assessmentsData) return <NotFound />;

  const { data: assessments } = assessmentsData;

  return (
    <>
      <h1 className="page-heading">Assessments</h1>
      <p className="page-description">
        View assessments or create a new one here.
      </p>

      <div className="mt-4 flex flex-col items-end justify-between gap-4 md:flex-row">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          className="max-w-[500px] self-start"
          placeholder="Search for an assessment using title or technology..."
        />

        <DynamicDialog
          title="Create new assessment"
          description="Create and upload assessment materials and assign them to selected candidates. You can include optional notes and set a deadline."
          trigger={
            <Button>
              <Plus /> Create
            </Button>
          }
          open={isCreating}
          onOpenChange={onOpenChange}
        >
          <AssessmentForm form={form} onSubmit={onCreate} />
        </DynamicDialog>
      </div>

      <div
        className={cn(
          "mt-4 grid items-start gap-4",
          isSidebarCollapsed
            ? "lg:grid-cols-3 xl:grid-cols-4"
            : "md:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {assessments.length < 1 ? (
          <NoData item="assessments" className="mt-4 md:col-span-4" />
        ) : (
          assessments.map((assessment) => (
            <AssessmentCard assessment={assessment} key={assessment._id} />
          ))
        )}
      </div>

      <DiscardChangesAlert
        open={createCancelDialog}
        onOpenChange={setCreateCancelDialog}
        onConfirm={() => {
          setIsCreating(false);
          form.reset();
        }}
      />
    </>
  );
};

export default Assessments;
