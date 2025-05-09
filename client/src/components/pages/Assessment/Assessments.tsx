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
import AssessmentCard from "@/components/cards/AssessmentCard";
import SearchInput from "@/components/shared/SearchInput";
import { useGetAllAssessments } from "@/services/assessments/queries";
import GridViewSkeleton from "@/components/skeletons/GridViewLayout";
import NotFound from "../NotFound";
import NoData from "@/components/shared/NoData";
import { useCreateAssessment } from "@/services/assessments/mutations";
import RetryButton from "@/components/shared/RetryButton";
import { useDebounce } from "use-debounce";
import DataViewToggle from "@/components/shared/DataViewToggle";
import { DataTable } from "@/components/tables/DataTable";
import { AssessmentColumns } from "@/components/tables/Columns/AssessmentColumns";
import ListViewSkeleton from "@/components/skeletons/ListViewSkeleton";
import GridViewLayout from "@/components/layouts/GridViewLayout";

const Assessments = () => {
  const view = useSelector((state: RootState) => state.dataView.assessments);
  const isGridView = view === "grid";

  const [searchParams] = useSearchParams();
  const createParam = useMemo(() => searchParams.get("create"), [searchParams]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  // Dialog related states
  const [isCreating, setIsCreating] = useState(false);
  const [createCancelDialog, setCreateCancelDialog] = useState(false);

  // Queries
  const {
    data: assessmentsData,
    isPending: assessmentsLoading,
    error: assessmentsError,
    refetch: refetchAssessments,
  } = useGetAllAssessments(isGridView ? { search: debouncedQuery } : undefined);

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
    if (isGridView) {
      refetchAssessments();
    }
  }, [debouncedQuery, refetchAssessments, isGridView]);

  useEffect(() => {
    if (createParam === "true") {
      setIsCreating(true);
    }
  }, [createParam]);

  if (assessmentsError)
    return (
      <NotFound
        label="Failed to load assessments."
        actionButton={
          <RetryButton
            retrying={assessmentsLoading}
            onClick={() => refetchAssessments()}
          />
        }
      />
    );

  return (
    <>
      <h1 className="page-heading">Assessments</h1>
      <p className="page-description">
        View created assessments or create a new one and assign them to
        candidates here.
      </p>

      <DataViewToggle view={view} section="assessments" />

      <div className="mb-4 flex flex-col items-end justify-between gap-4 md:flex-row">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          className="max-w-[500px] self-start"
          placeholder="Search for an assessment using title, technology, or format..."
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

      {isGridView ? (
        assessmentsLoading ? (
          <GridViewSkeleton />
        ) : assessmentsData && assessmentsData.data.length > 0 ? (
          <GridViewLayout>
            {assessmentsData?.data.map((assessment) => (
              <AssessmentCard assessment={assessment} key={assessment._id} />
            ))}
          </GridViewLayout>
        ) : (
          <NoData label="No assessments found." />
        )
      ) : assessmentsLoading ? (
        <ListViewSkeleton />
      ) : (
        <DataTable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={assessmentsLoading}
          columns={AssessmentColumns}
          data={assessmentsData.data}
          searchableColumns={[
            "_id",
            "title",
            "technologies",
            "format",
            "assessmentType",
          ]}
          addDataTitle="Generate Letter"
          addDataDescription=""
          searchPlaceholder="Filter assessments by title, technology, type, or format..."
        />
      )}

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
