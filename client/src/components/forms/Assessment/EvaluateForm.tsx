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
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export type EvaluateFormValues = z.infer<typeof evaluateAssessmentSchema>;

type EvaluateFromProps = {
  form: UseFormReturn<EvaluateFormValues>;
  onSubmit: (data: EvaluateFormValues) => void;
  className?: string;
};

const EvaluateForm = ({ form, onSubmit, className }: EvaluateFromProps) => {
  const format = form.getValues("format");
  const link = form.getValues("link");

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
        <Button className="w-full">Submit</Button>
      </form>
    </Form>
  );
};

export default EvaluateForm;
