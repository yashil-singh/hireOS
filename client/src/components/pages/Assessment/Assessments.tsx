import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { assessmentSchema } from "@/lib/schemas/assessmentSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asssessments as AssessmentsData } from "@/assets/data/Assessments";
import { Plus } from "lucide-react";
import DynamicDialog from "@/components/dialogs/DynamicDialog";
import { Button } from "@/components/ui/button";
import AssessmentForm from "@/components/forms/Assessment/AssessmentForm";
import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";
import AssessmentCard from "@/components/shared/AssessmentCard";
import SearchInput from "@/components/shared/SearchInput";

const Assessments = () => {
  const [searchParams] = useSearchParams();
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );

  const [searchQuery, setSearchQuery] = useState("");

  // Dialog related states
  const [isCreating, setIsCreating] = useState(false);
  const [createCancelDialog, setCreateCancelDialog] = useState(false);

  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      description: "",
      format: undefined,
      type: "",
      assessmentFile: undefined,
      link: "",
    },
  });

  const onCreate = async (values: z.infer<typeof assessmentSchema>) => {
    console.log("🚀 ~ Assessments.tsx:58 ~ values:", values);
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

  const createParam = useMemo(() => searchParams.get("create"), [searchParams]);

  useEffect(() => {
    if (createParam === "true") {
      setIsCreating(true);
    }
  }, [createParam]);

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
        {AssessmentsData.map((assessment) => (
          <AssessmentCard assessment={assessment} key={assessment.id} />
        ))}
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
