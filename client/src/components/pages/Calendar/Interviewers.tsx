import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";
import DynamicDialog from "@/components/dialogs/DynamicDialog";
import SearchInput from "@/components/shared/SearchInput";
import GridViewSkeleton from "@/components/skeletons/GridViewLayout";
import { Button } from "@/components/ui/button";
import { interviwerSchema } from "@/lib/schemas/calendarSchemas";
import { RootState } from "@/lib/slices/store";
import { useCreateInteriviewer } from "@/services/interviewer/mutations";
import { useGetAllInterviewers } from "@/services/interviewer/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import InterviewerCard from "@/components/cards/InterviewerCard";
import InterviewerForm from "@/components/forms/Interviewer/InterviewerForm";
import NotFound from "../NotFound";
import NoData from "@/components/shared/NoData";
import RetryButton from "@/components/shared/RetryButton";
import { useDebounce } from "use-debounce";
import DataViewToggle from "@/components/shared/DataViewToggle";
import ListViewSkeleton from "@/components/skeletons/ListViewSkeleton";
import GridViewLayout from "@/components/layouts/GridViewLayout";
import { DataTable } from "@/components/tables/DataTable";
import { InterviewerColumns } from "@/components/tables/Columns/InterviewerColumns";

const Interviewers = () => {
  const view = useSelector((state: RootState) => state.dataView.interviewers);
  const isGridView = view === "grid";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const [isAdding, setIsAdding] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const { mutateAsync } = useCreateInteriviewer();

  const {
    data: interviewerData,
    isPending: interviewersLoading,
    error: interviewerDataError,
    refetch: refetchInterviewers,
  } = useGetAllInterviewers(
    isGridView ? { search: debouncedQuery } : undefined,
  );

  const form = useForm<z.infer<typeof interviwerSchema>>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
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

    setIsAdding(isOpen);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof interviwerSchema>) => {
    await mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        setIsAdding(false);
      },
    });
  };

  if (interviewerDataError)
    return (
      <NotFound
        className="h-no-header"
        label="Something went wrong. Failed to load drafts."
        actionButton={
          <RetryButton
            onClick={() => refetchInterviewers()}
            retrying={interviewersLoading}
          />
        }
      />
    );

  return (
    <>
      <h1 className="page-heading">Interviewers</h1>
      <p className="page-description">
        Manage interviewer, and assign them to interviews, ensuring smooth
        coordination throughout the interview process.
      </p>

      <DataViewToggle view={view} section="interviewers" />

      <div className="mb-4 flex flex-col items-end justify-between gap-4 md:flex-row">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          className="max-w-[500px] self-start"
          placeholder="Search for an interviewer using name or email..."
        />

        <DynamicDialog
          open={isAdding}
          onOpenChange={onOpenChange}
          title="Add Interviewer"
          description="Quickly add new interviewers by entering their name, and contact details. This ensures easy management and assignment of interviewers to upcoming candidate interviews."
          trigger={
            <Button>
              <Plus /> Add
            </Button>
          }
        >
          <InterviewerForm form={form} onSubmit={onSubmit} />
        </DynamicDialog>
      </div>

      {isGridView ? (
        interviewersLoading ? (
          <GridViewSkeleton />
        ) : interviewerData && interviewerData.data.length > 0 ? (
          <GridViewLayout>
            {interviewerData.data.map((interviewer) => (
              <InterviewerCard
                interviewer={interviewer}
                key={interviewer._id}
              />
            ))}
          </GridViewLayout>
        ) : (
          <NoData label="No interviewers found." />
        )
      ) : interviewersLoading ? (
        <ListViewSkeleton />
      ) : (
        <DataTable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          columns={InterviewerColumns}
          data={interviewerData.data}
          searchableColumns={["_id", "name", "email", "phone"]}
          addDataTitle="Generate Letter"
          searchPlaceholder="Filter interviews using interview title, status, step, candidate name or email... "
        />
      )}

      <DiscardChangesAlert
        open={isDiscarding}
        onOpenChange={setIsDiscarding}
        onConfirm={() => {
          setIsAdding(false);
        }}
      />
    </>
  );
};

export default Interviewers;
