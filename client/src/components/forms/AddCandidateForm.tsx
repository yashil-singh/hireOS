import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import {
  addCandidateSchema,
  experienceSchema,
} from "@/lib/schemas/candidateSchemas";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CandidateLevels,
  CandidateStatus,
  Technologies,
} from "@/lib/constants";
import { MultiSelect } from "../ui/multi-select";
import { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Delete, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

const AddCandidateForm = ({ className }: { className?: string }) => {
  // states related to mini add experience form
  const [addingExperience, setAddingExperience] = useState(false);
  const [newExperience, setNewExperience] = useState({
    company: "",
    startDate: "",
    endDate: "",
  });
  const [newExperienceErrors, setNewExperienceErrors] = useState<{
    company: string | null;
    startDate: string | null;
    endDate: string | null;
  }>({
    company: null,
    startDate: null,
    endDate: null,
  });

  const form = useForm<z.infer<typeof addCandidateSchema>>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      level: "",
      experience: [],
      reference: "",
      salaryExpectation: undefined,
      status: "",
      technology: [],
    },
    resolver: zodResolver(addCandidateSchema),
  });

  // for mini add experience form
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  // function to validate mini add experience form
  const validateNewExperience = () => {
    // Reset errors
    setNewExperienceErrors({ company: null, endDate: null, startDate: null });

    const result = experienceSchema.safeParse(newExperience);
    const errors = result.error?.errors;

    errors?.map((error) => {
      const path = error.path[0];

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

  async function onSubmit(values: z.infer<typeof addCandidateSchema>) {
    console.log("🚀 ~ AddCandidateForm.tsx:64 ~ values:", values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter candidate name" {...field} />
                </FormControl>
                <span>
                  <FormMessage />
                </span>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate's Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter candidate email" {...field} />
                </FormControl>
                <span>
                  <FormMessage />
                </span>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate's Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter candidate phone number"
                    {...field}
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
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate's Reference</FormLabel>
                <FormControl>
                  <Input placeholder="Enter reference email" {...field} />
                </FormControl>
                <span>
                  <FormMessage />
                </span>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technology"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Candidate's Preferred Technologies</FormLabel>
                <FormControl>
                  <MultiSelect
                    className="h-12"
                    options={Technologies}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Select technologies"
                    variant="inverted"
                    maxCount={3}
                    error={!!form.formState.errors.technology}
                  />
                </FormControl>
                <span>
                  <FormMessage />
                </span>
              </FormItem>
            )}
          />

          <div className="space-y-2 md:col-span-2">
            <Label>Candidate's Experience</Label>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Added experiences */}
              {experienceFields.map((field, index) => (
                <div key={field.id} className="space-y-2 rounded-md border p-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <span>
                          <FormMessage />
                        </span>
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
                        <span>
                          <FormMessage />
                        </span>
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
                        <span>
                          <FormMessage />
                        </span>
                      </FormItem>
                    )}
                  />

                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => removeExperience(index)}
                  >
                    <Delete />
                    Remove
                  </Button>
                </div>
              ))}

              {/* Mini add experience form */}
              {addingExperience && (
                <div className="space-y-2 rounded-md border p-4">
                  <Label>Company Name</Label>
                  <Input
                    placeholder="Company name"
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
                          company: "",
                          startDate: "",
                          endDate: "",
                        });
                        setAddingExperience(false);
                      }
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={() => setAddingExperience(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Add new experience button  */}
              {!addingExperience && (
                <Button
                  onClick={() => setAddingExperience(true)}
                  type="button"
                  className="h-full w-full"
                  variant="ghost"
                >
                  <Plus />
                  Add
                </Button>
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate's Position</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-12! w-full",
                        form.formState.errors.level &&
                          "border-destructive focus-visible:ring-destructive/20 border",
                      )}
                    >
                      <SelectValue placeholder="Select candidate position" />
                    </SelectTrigger>
                    <SelectContent>
                      {CandidateLevels.map((level) => (
                        <SelectItem
                          value={level}
                          key={`add-form-level-${level}`}
                        >
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <span>
                  <FormMessage />
                </span>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate's Profile Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-12! w-full",
                        form.formState.errors.status &&
                          "border-destructive focus-visible:ring-destructive/20 border",
                      )}
                    >
                      <SelectValue placeholder="Select candidate profile status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CandidateStatus.map((status) => (
                        <SelectItem
                          value={status.value}
                          key={`add-form-status-${status.value}`}
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <span>
                  <FormMessage />
                </span>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salaryExpectation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate's Salary Expectation</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter candidate's salaray expectation"
                    type="number"
                    {...field}
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
            name="resumeFile"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Resume</FormLabel>
                <FormControl>
                  <Input
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </FormControl>
                <span>
                  <FormMessage />
                </span>
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full">Add Profile</Button>
      </form>
    </Form>
  );
};

export default AddCandidateForm;
