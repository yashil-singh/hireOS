import Candidates from "@/assets/data/Candidates";
import AccountAvatar from "@/components/shared/AccountAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { assignAssessmentSchema } from "@/lib/schemas/assessmentSchemas";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof assignAssessmentSchema>;

type AssignAssessmentFormProps = {
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
  className?: string;
};

const AssignAssessmentForm = ({
  form,
  onSubmit,
  className,
}: AssignAssessmentFormProps) => {
  const selected = form.watch("candidates");

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

  return (
    <>
      <Input placeholder="Search..." />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-4", className)}
        >
          <Button type="submit" className="w-full">
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
                    {Candidates.map((candidate) => (
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
                            selected.includes(candidate._id) && "bg-primary",
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
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-muted-foreground text-sm">
                              {candidate.email}
                            </p>
                            <span className="mt-2 space-x-1">
                              {candidate.technology.map((tech, index) => (
                                <Badge key={`${candidate._id}-tech-${index}`}>
                                  {tech}
                                </Badge>
                              ))}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default AssignAssessmentForm;
