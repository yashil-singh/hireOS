import { scheduleInterviewSchema } from "@/lib/schemas/interviewSchemas";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { DatePicker } from "../../shared/DatePicker";
import { TimePicker } from "../../shared/TimePicker";
import { MultiSelect } from "../../ui/multi-select";
import { Combobox } from "../../ui/combo-box";
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";
import { useGetAllInterviewers } from "@/services/interviewer/queries";
import { CircleAlert, Loader2 } from "lucide-react";
import { useGetEligibleCandidates } from "@/services/candidates/queries";
import { useEffect } from "react";
import { toast } from "sonner";
import FormSubmitButton from "@/components/shared/FormSubmitButton";

type ScheduleInterviewFormProps = {
  form: UseFormReturn<z.infer<typeof scheduleInterviewSchema>>;
  onSubmit: (data: z.infer<typeof scheduleInterviewSchema>) => void;
  className?: string;
};

const ScheduleInterviewForm = ({
  form,
  onSubmit,
  className,
}: ScheduleInterviewFormProps) => {
  const {
    data: interviewersData,
    isLoading: interviewersLoading,
    isError: interviewersError,
  } = useGetAllInterviewers();

  const {
    data: candidatesData,
    isLoading: candidatesLoading,
    isError: candiatesError,
  } = useGetEligibleCandidates("interviewing");

  useEffect(() => {
    if (candidatesData) {
      const candidates = candidatesData.data;
      if (candidates.length < 1)
        toast.info("No candidates are currently in the interview stage.");
    }
  }, [candidatesData]);

  if (interviewersLoading || candidatesLoading)
    return <Loader2 className="mx-auto size-5 animate-spin" />;

  if (
    interviewersError ||
    candiatesError ||
    !interviewersData ||
    !candidatesData
  )
    return (
      <p className="text-destructive flex items-center justify-center gap-1 text-center text-sm">
        <CircleAlert className="size-5" /> Failed to load form.
      </p>
    );

  const getCandidateOptions = (): { label: string; value: string }[] => {
    const options: { label: string; value: string }[] = [];
    for (const candidate of candidatesData.data) {
      options.push({
        label: `${candidate.name} - ${candidate.email}`,
        value: candidate._id,
      });
    }
    return options;
  };

  const getInterviewerOptions = (): { label: string; value: string }[] => {
    const options: { label: string; value: string }[] = [];
    for (const interviewer of interviewersData.data) {
      options.push({
        label: `${interviewer.name} - ${interviewer.email}`,
        value: interviewer._id,
      });
    }
    return options;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter interview title" {...field} />
              </FormControl>
              <span>
                <FormMessage />
              </span>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  error={!!form.formState.errors.date}
                />
              </FormControl>
              <span>
                <FormMessage />
              </span>
            </FormItem>
          )}
        />

        <div className="grid w-full gap-2 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <TimePicker
                    time={field.value}
                    setTime={field.onChange}
                    error={!!form.formState.errors.startTime}
                  />
                </FormControl>
                <span>
                  <FormMessage />
                </span>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <TimePicker
                    time={field.value}
                    setTime={field.onChange}
                    error={!!form.formState.errors.endTime}
                  />
                </FormControl>
                <span>
                  <FormMessage />
                </span>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="candidate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Candidate</FormLabel>
              <FormControl>
                <Combobox
                  placeholder="Select Candidate"
                  options={getCandidateOptions()}
                  value={field.value}
                  setValue={field.onChange}
                  error={!!form.formState.errors.candidate}
                />
              </FormControl>
              <span>
                <FormMessage />
              </span>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interviewers"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Interviewers</FormLabel>
              <FormControl>
                <MultiSelect
                  options={getInterviewerOptions()}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select Interviewers"
                  variant="inverted"
                  maxCount={1}
                  error={!!form.formState.errors.interviewers}
                />
              </FormControl>
              <span>
                <FormMessage />
              </span>
            </FormItem>
          )}
        />

        <FormSubmitButton isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};

export default ScheduleInterviewForm;
