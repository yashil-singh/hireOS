import Rating from "@/components/shared/Rating";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { evaluateAssessmentSchema } from "@/lib/schemas/assessmentSchemas";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Dropzone from "@/components/shared/Dropzone";
import { CircleAlert, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllInterviewers } from "@/services/interviewer/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FormSubmitButton from "@/components/shared/FormSubmitButton";
import { Combobox } from "@/components/ui/combo-box";

export type EvaluateFormValues = z.infer<typeof evaluateAssessmentSchema>;

type EvaluateFromProps = {
  form: UseFormReturn<EvaluateFormValues>;
  onSubmit: (data: EvaluateFormValues) => void;
  className?: string;
};

const EvaluateForm = ({ form, onSubmit, className }: EvaluateFromProps) => {
  const format = form.watch("submissionFormat");
  const link = form.watch("submissionLink");

  //Queries
  const { data: interviewersData, isPending: interviewersLoading } =
    useGetAllInterviewers();

  if (interviewersLoading) return <Loader2 className="mx-auto animate-spin" />;

  if (!interviewersData)
    return (
      <p className="text-destructive flex items-center justify-center gap-1 text-center text-sm">
        <CircleAlert className="size-5" /> Failed to load form.
      </p>
    );
  const getEvaluatorOptions = (): { label: string; value: string }[] => {
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
        <FormLabel>
          View submission here:
          <Button
            type="button"
            variant="link"
            className="h-fit w-fit! gap-1 p-0!"
            asChild
          >
            <Link to={link!} target="_blank">
              Link <ExternalLink className="size-3" />
            </Link>
          </Button>
        </FormLabel>

        <FormField
          control={form.control}
          name="interviewerId"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Evaluator</FormLabel>
              <FormControl>
                <Combobox
                  placeholder="Select Evaluator"
                  options={getEvaluatorOptions()}
                  value={field.value}
                  setValue={field.onChange}
                  error={!!form.formState.errors.interviewerId}
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
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Rating
                  value={field.value}
                  onChange={field.onChange}
                  disabled={field.disabled}
                  starSize={28}
                  labelClassName="text-3xl"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write something..."
                  className="max-h-[200px]"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submissionFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submission Format</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <SelectTrigger
                    className="h-12! w-full"
                    aria-invalid={!!form.formState.errors.submissionFormat}
                  >
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">File</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {format === "file" && (
          <FormField
            control={form.control}
            name="submittedFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Submitted File</FormLabel>
                <FormControl>
                  <Dropzone value={field.value} onChange={field.onChange} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {format === "link" && (
          <FormField
            control={form.control}
            name="submissionLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Submission Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter submission link" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormSubmitButton isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};

export default EvaluateForm;
