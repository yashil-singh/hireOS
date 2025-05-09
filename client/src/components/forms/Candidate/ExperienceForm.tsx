import { DatePicker } from "@/components/shared/DatePicker";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { candidateSchema } from "@/lib/schemas/candidateSchemas";
import { Delete, Plus } from "lucide-react";
import { useRef } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";

type ExperienceFormProps = {
  form: UseFormReturn<z.infer<typeof candidateSchema>>;
  isSubmitting?: boolean;
};

const ExperienceForm = ({
  form,
  isSubmitting = false,
}: ExperienceFormProps) => {
  const {
    append: appendExperience,
    remove: removeExperience,
    fields: experienceFields,
  } = useFieldArray({
    name: "experience",
    control: form.control,
  });

  const formBottomRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      {experienceFields.map((field, index) => (
        <div key={field.id} className="h-fit space-y-2 rounded-md border p-4">
          <FormField
            control={form.control}
            name={`experience.${index}.jobTitle`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Job Title<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`experience.${index}.company`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company Name<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`experience.${index}.startDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Start Date<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={field.onChange}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`experience.${index}.endDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  End Date<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="destructive"
            type="button"
            className="w-full"
            onClick={() => removeExperience(index)}
            disabled={isSubmitting}
          >
            <Delete />
            Remove
          </Button>
        </div>
      ))}

      <Button
        variant="ghost"
        className="h-full"
        type="button"
        ref={formBottomRef}
        onClick={() => {
          formBottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          appendExperience({
            company: "",
            jobTitle: "",
            startDate: new Date().toString(),
            endDate: new Date().toString(),
          });
        }}
      >
        <Plus /> Add
      </Button>
    </>
  );
};

export default ExperienceForm;
