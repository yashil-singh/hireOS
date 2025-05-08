import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";
import DynamicDialog from "@/components/dialogs/DynamicDialog";
import SearchInput from "@/components/shared/SearchInput";
import CardLayoutSkeleton from "@/components/skeletons/CardLayoutSkeleton";
import { Button } from "@/components/ui/button";
import { interviwerSchema } from "@/lib/schemas/calendarSchemas";
import { RootState } from "@/lib/slices/store";
import { cn } from "@/lib/utils";
import { useCreateInteriviewer } from "@/services/interviewer/mutations";
import { useGetAllInterviewers } from "@/services/interviewer/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import InterviewerCard from "@/components/shared/InterviewerCard";
import InterviewerForm from "@/components/forms/Interviewer/InterviewerForm";
import NotFound from "../NotFound";
import NoData from "@/components/shared/NoData";

const Interviewers = () => {
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const { mutateAsync } = useCreateInteriviewer();

  const {
    data: interviewerData,
    isLoading: interviewerDataLoading,
    error: interviewerDataError,
  } = useGetAllInterviewers();

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

  if (interviewerDataLoading) return <CardLayoutSkeleton />;

  if (!interviewerData || interviewerDataError) return <NotFound />;

  const interviewers = interviewerData.data;

  return (
    <>
      <h1 className="page-heading">Interviewers</h1>
      <p className="page-description">
        Manage interviewer, and assign them to interviews, ensuring smooth
        coordination throughout the interview process.
      </p>

      <div className="my-4 flex flex-col items-end justify-between gap-4 md:flex-row">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          className="max-w-[500px] self-start"
          placeholder="Search for an assessment using title or technology..."
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

      {interviewers.length > 0 ? (
        <>
          <div
            className={cn(
              "mt-4 grid items-start gap-4",
              isSidebarCollapsed
                ? "lg:grid-cols-3 xl:grid-cols-4"
                : "md:grid-cols-2 xl:grid-cols-3",
            )}
          >
            {interviewerData?.data.map((interviewer) => (
              <InterviewerCard
                interviewer={interviewer}
                key={interviewer._id}
              />
            ))}
          </div>
        </>
      ) : (
        <NoData item="interviewers" />
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
