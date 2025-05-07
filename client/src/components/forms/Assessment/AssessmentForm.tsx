import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { assessmentSchema } from "@/lib/schemas/assessmentSchemas";
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { AssessmentTypes, Technologies } from "@/lib/constants";
import Dropzone from "../../shared/Dropzone";
import { MultiSelect } from "@/components/ui/multi-select";
import FormSubmitButton from "@/components/shared/FormSubmitButton";

type AssessmentFormProps = {
  form: UseFormReturn<z.infer<typeof assessmentSchema>>;
  onSubmit: (data: z.infer<typeof assessmentSchema>) => void;
  className?: string;
};

const AssessmentForm = ({ form, onSubmit, className }: AssessmentFormProps) => {
  const { format } = form.watch();
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
              <FormLabel>Assessment Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter assessment title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Related Technologies</FormLabel>
              <FormControl>
                <MultiSelect
                  className="h-12"
                  options={Technologies}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select technologies"
                  variant="inverted"
                  maxCount={3}
                  error={!!form.formState.errors.technologies}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assessmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <SelectTrigger
                    className="h-12! w-full"
                    aria-invalid={!!form.formState.errors.assessmentType}
                  >
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {AssessmentTypes.map((assessment) => (
                      <SelectItem
                        value={assessment.value}
                        key={`add-assessment-type-${assessment.value}`}
                      >
                        {assessment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Format</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <SelectTrigger
                    className="h-12! w-full"
                    aria-invalid={!!form.formState.errors.format}
                  >
                    <SelectValue placeholder="Select assessment format" />
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
            name="assessmentFile"
            render={({ field }) => (
              <FormItem className="lg:col-span-2 xl:col-span-3">
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Dropzone
                    onChange={field.onChange}
                    value={field.value}
                    accept={{ "application/pdf": [], "image/*": [] }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {format === "link" && (
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter assessment link" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter assessment description"
                  className="max-h-[200px]"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormSubmitButton isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};

export default AssessmentForm;
