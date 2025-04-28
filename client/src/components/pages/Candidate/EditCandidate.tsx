import CandidateForm from "@/components/forms/Candidate/CandidateForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { candidateSchema } from "@/lib/schemas/candidateSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const EditCandidate = () => {
  const navigate = useNavigate();
  const [discardOpen, setDiscardOpen] = useState(false);

  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    level: "",
    experience: [],
    reference: "",
    salaryExpectation: "",
    technology: [],
  };

  const form = useForm<z.infer<typeof candidateSchema>>({
    defaultValues,
    resolver: zodResolver(candidateSchema),
  });

  const { isDirty } = form.formState;

  const onSubmit = async (values: z.infer<typeof candidateSchema>) => {
    console.log("🚀 ~ EditCandidateForm.tsx:64 ~ values:", values);
  };

  return (
    <>
      <div className="flex items-start gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (isDirty) {
              setDiscardOpen(true);
            } else {
              navigate(-1);
            }
          }}
        >
          <ArrowLeft />
        </Button>

        <h1 className="page-heading">Edit Candidate</h1>
      </div>
      <p className="page-description">
        This information will be used for screening, interview scheduling, and
        further recruitment steps. Make sure to fill in all relevant fields
        accurately.
      </p>

      <div className="my-8 md:p-4">
        <CandidateForm form={form} onSubmit={onSubmit} />
      </div>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. All progress will be lost, and you'll
              need to re-enter all your information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate(-1)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditCandidate;
