import AccountAvatar from "@/components/shared/AccountAvatar";
import { DatePicker } from "@/components/shared/DatePicker";
import FormSubmitButton from "@/components/shared/FormSubmitButton";
import { TimePicker } from "@/components/shared/TimePicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { AssignAssessmentFormValues } from "@/services/assessments/types";
import { useGetEligibleCandidates } from "@/services/candidates/queries";
import { Check, CircleAlert, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import Fuse from "fuse.js";
import NoData from "@/components/shared/NoData";
import SearchInput from "@/components/shared/SearchInput";

type AssignAssessmentFormProps = {
  form: UseFormReturn<AssignAssessmentFormValues>;
  onSubmit: (data: AssignAssessmentFormValues) => void;
  className?: string;
};

const AssignAssessmentForm = ({
  form,
  onSubmit,
  className,
}: AssignAssessmentFormProps) => {
  const [step, setStep] = useState(1);

  const selected = form.watch("candidates");

  const [searchTerm, setSearchTerm] = useState("");

  const toggleCandidate = (id: string) => {
    if (selected.includes(id)) {
      form.setValue(
        "candidates",
        selected.filter((c) => c !== id),
      );
    } else {
      form.setValue("candidates", [...selected, id]);
    }
  };

  const { data: eligibleCandidatesData, isPending: eligibleCandidatesLoading } =
    useGetEligibleCandidates("assessment");

  const eligibleCandidates = useMemo(
    () => eligibleCandidatesData?.data ?? [],
    [eligibleCandidatesData],
  );

  const fuse = useMemo(() => {
    return new Fuse(eligibleCandidates, {
      keys: ["name", "email", "technology"],
      threshold: 0.2,
    });
  }, [eligibleCandidates]);

  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return eligibleCandidates;
    return fuse.search(searchTerm).map((result) => result.item);
  }, [searchTerm, fuse, eligibleCandidates]);

  if (eligibleCandidatesLoading)
    return <Loader2 className="mx-auto animate-spin" />;

  if (!eligibleCandidatesData)
    return (
      <p className="text-destructive flex items-center justify-center gap-1 text-center text-sm">
        <CircleAlert className="size-5" /> Failed to load form.
      </p>
    );
  return (
    <>
      {step === 1 && (
        <SearchInput
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-4", className)}
        >
          {step === 1 && (
            <>
              <Button
                type="button"
                className="w-full"
                onClick={() => setStep(2)}
                disabled={selected.length < 1}
              >
                Assign {selected.length > 0 && `(${selected.length})`}
              </Button>
              <FormField
                control={form.control}
                name="candidates"
                render={() => (
                  <FormItem>
                    <FormMessage />
                    <FormControl>
                      <div className="space-y-4">
                        {filteredCandidates.length > 0 ? (
                          filteredCandidates.map((candidate) => (
                            <Card
                              key={candidate._id}
                              className={`cursor-pointer flex-row items-center gap-4 p-4 ${
                                selected.includes(candidate._id)
                                  ? "border-primary bg-primary/10"
                                  : "border-muted"
                              }`}
                              onClick={() => toggleCandidate(candidate._id)}
                            >
                              <div
                                className={cn(
                                  "flex size-5 items-center justify-center rounded border",
                                  selected.includes(candidate._id) &&
                                    "bg-primary",
                                )}
                              >
                                {selected.includes(candidate._id) && (
                                  <Check className="text-primary-foreground size-4" />
                                )}
                              </div>
                              <div className="flex gap-4">
                                <AccountAvatar
                                  avatarUrl={candidate.avatarUrl ?? ""}
                                />
                                <div>
                                  <p className="font-medium">
                                    {candidate.name}
                                  </p>
                                  <p className="text-muted-foreground text-sm">
                                    {candidate.email}
                                  </p>
                                  <span className="mt-2 space-x-1">
                                    {candidate.technology.map((tech, index) => (
                                      <Badge
                                        className="capitalize"
                                        key={`${candidate._id}-tech-${index}`}
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </span>
                                </div>
                              </div>
                            </Card>
                          ))
                        ) : (
                          <NoData label="Currently, there are no candidates in the assessment stage." />
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="deadlineDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Deadline Date<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        error={!!form.formState.errors.deadlineDate}
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
                name="deadlineTime"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Deadline Time<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <TimePicker
                        time={field.value}
                        setTime={field.onChange}
                        error={!!form.formState.errors.deadlineTime}
                      />
                    </FormControl>
                    <span>
                      <FormMessage />
                    </span>
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <FormSubmitButton isSubmitting={form.formState.isSubmitting} />
              </div>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default AssignAssessmentForm;
