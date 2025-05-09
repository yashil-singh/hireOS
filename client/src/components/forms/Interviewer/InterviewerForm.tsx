import { interviwerSchema } from "@/lib/schemas/calendarSchemas";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FormValues = z.infer<typeof interviwerSchema>;

type InterviwerFormProps = {
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
  className?: string;
};

const InterviewerForm = ({
  form,
  onSubmit,
  className,
}: InterviwerFormProps) => {
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Interviewers's Name<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter interviewers name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Interviewers's Email<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter interviewers email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Interviewers's Phone Number
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter interviewers phone number"
                  type="number"
                  className="hide-num-input"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default InterviewerForm;
