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
} from "../ui/form";
import { DatePicker } from "../shared/DatePicker";
import { TimePicker } from "../shared/TimePicker";
import { MultiSelect } from "../ui/multi-select";
import { Button } from "../ui/button";
import { Combobox } from "../ui/combo-box";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

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

        <div className="flex w-full items-start gap-2">
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
                  options={[
                    {
                      label: "Peter Parker - peter@gmail.com",
                      value: "candidate-1",
                    },
                    {
                      label: "Marry Jane - marry@gmail.com",
                      value: "candidate-2",
                    },
                  ]}
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
                  options={[
                    {
                      label: "Tony Stark - tony@gmail.com",
                      value: "tony-stark-interviewer",
                    },
                    {
                      label: "Steve Rogers - steve@gmail.com",
                      value: "steve-rogers-interviewer",
                    },
                  ]}
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

        <Button className="w-full">Confirm</Button>
      </form>
    </Form>
  );
};

export default ScheduleInterviewForm;
