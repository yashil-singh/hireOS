import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { candidateSchema } from "@/lib/schemas/candidateSchemas";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import ExperienceForm from "./ExperienceForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CandidateLevels, Technologies } from "@/lib/constants";
import { MultiSelect } from "@/components/ui/multi-select";

type CandidateFormProps = {
  form: UseFormReturn<z.infer<typeof candidateSchema>>;
  onSubmit: (data: z.infer<typeof candidateSchema>) => void;
  className?: string;
};

const CandidateForm = ({ form, onSubmit, className }: CandidateFormProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        {/* Personal Information */}
        <h2 className="text-xl font-bold">Personal Information</h2>
        <div className="grid items-start gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter candidate name" {...field} />
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
                <FormLabel>Candidate's Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter candidate email" {...field} />
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
                <FormLabel>Candidate's Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter candidate phone number"
                    type="number"
                    className="hide-num-input"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
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

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2 lg:col-span-2 xl:col-span-3">
            <Label>Candidate's Experience</Label>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <ExperienceForm form={form} />
            </div>
          </div>

          <FormField
            control={form.control}
            name="resumeFile"
            render={({ field }) => (
              <FormItem className="lg:col-span-2 xl:col-span-3">
                <FormLabel>Resume</FormLabel>
                <FormControl>
                  <Input
                    accept=".pdf,.doc,.docx"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Job Preferences */}
        <h2 className="text-xl font-bold">Job Preferences</h2>
        <div className="grid items-start gap-3 md:grid-cols-2">
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

                <FormMessage />
              </FormItem>
            )}
          />

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

                <FormMessage />
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
                    className="hide-num-input"
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <Button className="mt-4 w-full">Confirm</Button>
      </form>
    </Form>
  );
};

export default CandidateForm;
