import { useState } from "react";
import { useForm } from "react-hook-form";
import EvaluateForm, {
  EvaluateFormValues,
} from "../forms/Assessment/EvaluateForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { evaluateAssessmentSchema } from "@/lib/schemas/assessmentSchemas";
import AccountAvatar from "./AccountAvatar";
import { Badge } from "../ui/badge";
import DynamicDialog from "../dialogs/DynamicDialog";
import { Button } from "../ui/button";
import { Assessment, Candidate } from "@/lib/types";
import DiscardChangesAlert from "../dialogs/DiscardChangesAlert";

type EvaluateCardProps = {
  assessment: Assessment;
  candidate: Candidate;
};

const EvaluateCard = ({ assessment, candidate }: EvaluateCardProps) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);

  const form = useForm<EvaluateFormValues>({
    resolver: zodResolver(evaluateAssessmentSchema),
    defaultValues: {
      rating: 0,
      remarks: "",
      format: assessment.format,
      submittedFile: undefined,
      link: assessment.link,
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (form.formState.isDirty) {
        setCancelDialog(true);
        return;
      }
    }

    setIsEvaluating(isOpen);
    form.reset();
  };

  const onEvaluate = async (values: EvaluateFormValues) => {
    console.log("🚀 ~ EvaluateCard.tsx:47 ~ values:", values);
    console.log("🚀 ~ EvaluateCard.tsx:48 ~ candidate:", candidate);
  };

  return (
    <>
      <div className="bg-card space-y-4 rounded-xl border p-4">
        <div className="flex items-center gap-4">
          <AccountAvatar avatarUrl="" />
          <div className="flex flex-col">
            <b>
              {candidate.name} • {candidate.level}
            </b>
            <span>{candidate.email}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {candidate.technology.map((tech, index) => (
            <Badge key={`${candidate.id}-tech-${index}`}>{tech}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="flex gap-2">
            <Button variant="ghost">Resend</Button>
            <DynamicDialog
              open={isEvaluating}
              onOpenChange={onOpenChange}
              trigger={<Button>Evaluate</Button>}
              title={`Evaluate - ${assessment.title}`}
              description="Evaluate the candidate based on their work and provide detailed remarks highlighting their strengths, areas for improvement, and overall performance."
            >
              <EvaluateForm form={form} onSubmit={onEvaluate} />
            </DynamicDialog>
          </div>
        </div>
      </div>

      <DiscardChangesAlert
        open={cancelDialog}
        onOpenChange={setCancelDialog}
        onConfirm={() => {
          setIsEvaluating(false);
          form.reset();
        }}
      />
    </>
  );
};

export default EvaluateCard;
