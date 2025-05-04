import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  candidateSchema,
  experienceSchema,
} from "@/lib/schemas/candidateSchemas";
import { Delete, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const addExperienceFormRef = useRef<HTMLDivElement | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newExperience, setNewExperience] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
  });
  const [newExperienceErrors, setNewExperienceErrors] = useState<{
    jobTitle: string | null;
    company: string | null;
    startDate: string | null;
    endDate: string | null;
  }>({
    jobTitle: null,
    company: null,
    startDate: null,
    endDate: null,
  });

  const validateNewExperience = () => {
    // Reset errors
    setNewExperienceErrors({
      jobTitle: null,
      company: null,
      endDate: null,
      startDate: null,
    });

    const result = experienceSchema.safeParse(newExperience);
    const errors = result.error?.errors;

    errors?.map((error) => {
      const path = error.path[0];

      if (path === "jobTitle") {
        setNewExperienceErrors((prev) => ({
          ...prev,
          jobTitle: error.message,
        }));
      }

      if (path === "company") {
        setNewExperienceErrors((prev) => ({ ...prev, company: error.message }));
      }

      if (path === "startDate") {
        setNewExperienceErrors((prev) => ({
          ...prev,
          startDate: error.message,
        }));
      }

      if (path === "endDate") {
        setNewExperienceErrors((prev) => ({ ...prev, endDate: error.message }));
      }
    });

    if (!result.success) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (addExperienceFormRef) {
      addExperienceFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isAdding]);

  return (
    <>
      {/* Added experiences */}
      {experienceFields.map((field, index) => (
        <div key={field.id} className="h-fit space-y-2 rounded-md border p-4">
          <FormField
            control={form.control}
            name={`experience.${index}.jobTitle`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
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
                <FormLabel>Company Name</FormLabel>
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
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="destructive"
            type="button"
            onClick={() => removeExperience(index)}
            disabled={isSubmitting}
          >
            <Delete />
            Remove
          </Button>
        </div>
      ))}

      {/* Mini add experience form */}
      {isAdding && (
        <div className="space-y-2 rounded-md border p-4">
          <div ref={addExperienceFormRef}></div>
          <Label>Job Title</Label>
          <Input
            placeholder="Enter job title"
            value={newExperience.jobTitle}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                jobTitle: e.target.value,
              })
            }
            aria-invalid={!!newExperienceErrors.jobTitle}
          />
          {newExperienceErrors.jobTitle && (
            <p className="text-destructive text-sm">
              {newExperienceErrors.jobTitle}
            </p>
          )}
          <Label>Company Name</Label>
          <Input
            placeholder="Enter company name"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                company: e.target.value,
              })
            }
            aria-invalid={!!newExperienceErrors.company}
          />
          {newExperienceErrors.company && (
            <p className="text-destructive text-sm">
              {newExperienceErrors.company}
            </p>
          )}
          <Label>Start Date</Label>
          <Input
            type="date"
            value={newExperience.startDate}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                startDate: e.target.value,
              })
            }
            aria-invalid={!!newExperienceErrors.startDate}
          />
          {newExperienceErrors.startDate && (
            <p className="text-destructive text-sm">
              {newExperienceErrors.startDate}
            </p>
          )}
          <Label>End Date</Label>
          <Input
            type="date"
            value={newExperience.endDate}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                endDate: e.target.value,
              })
            }
            aria-invalid={!!newExperienceErrors.endDate}
          />
          {newExperienceErrors.endDate && (
            <p className="text-destructive text-sm">
              {newExperienceErrors.endDate}
            </p>
          )}

          <Button
            className="w-full"
            type="button"
            onClick={() => {
              if (validateNewExperience()) {
                appendExperience(newExperience);
                setNewExperience({
                  jobTitle: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                });
                setIsAdding(false);
              }
            }}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={() => {
              setIsAdding(false);
              setNewExperienceErrors({
                company: null,
                jobTitle: null,
                startDate: null,
                endDate: null,
              });
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Add new experience button  */}
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          type="button"
          className="h-full w-full"
          variant="ghost"
          disabled={isSubmitting}
        >
          <Plus /> Add
        </Button>
      )}
    </>
  );
};

export default ExperienceForm;
