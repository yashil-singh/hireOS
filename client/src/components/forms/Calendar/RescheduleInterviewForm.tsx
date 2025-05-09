import { rescheduleInterviewSchema } from "@/lib/schemas/interviewSchemas";
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
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/shared/DatePicker";
import { TimePicker } from "@/components/shared/TimePicker";
import FormSubmitButton from "@/components/shared/FormSubmitButton";

export type RescheduleInterviewFormValues = z.infer<
  typeof rescheduleInterviewSchema
>;

type RescheduleInterviewFormProps = {
  form: UseFormReturn<RescheduleInterviewFormValues>;
  onSubmit: (data: RescheduleInterviewFormValues) => void;
  className?: string;
};

const RescheduleInterviewForm = ({
  form,
  onSubmit,
  className,
}: RescheduleInterviewFormProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date<span className="text-destructive">*</span>
              </FormLabel>
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
                <FormLabel>
                  Start Time<span className="text-destructive">*</span>
                </FormLabel>
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
                <FormLabel>
                  End Time<span className="text-destructive">*</span>
                </FormLabel>
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

        <FormSubmitButton isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};

export default RescheduleInterviewForm;
