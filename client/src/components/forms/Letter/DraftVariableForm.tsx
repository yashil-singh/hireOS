import FormSubmitButton from "@/components/shared/FormSubmitButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DraftVariableFormValues } from "@/services/drafts/types";
import { UseFormReturn } from "react-hook-form";

type DraftVariableFormProps = {
  form: UseFormReturn<DraftVariableFormValues>;
  onSubmit: (data: DraftVariableFormValues) => void;
  className?: string;
};

const DraftVariableForm = ({
  form,
  onSubmit,
  className,
}: DraftVariableFormProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(onSubmit)();
        }}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="Enter variable label" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter variable label" {...field} />
              </FormControl>

              <FormDescription>
                {
                  "This is a unique identifier for the variable which will be used in the letter drafts, e.g., {{candidateName}}"
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description for the variable"
                  className="max-h-[200px]"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormSubmitButton
          type="submit"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
};

export default DraftVariableForm;
