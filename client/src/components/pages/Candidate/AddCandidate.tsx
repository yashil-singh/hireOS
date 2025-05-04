import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";
import CandidateForm from "@/components/forms/Candidate/CandidateForm";
import { Button } from "@/components/ui/button";
import { candidateSchema } from "@/lib/schemas/candidateSchemas";
import { useCreateCandidate } from "@/services/candidates/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const AddCandidate = () => {
  const navigate = useNavigate();
  const [discardOpen, setDiscardOpen] = useState(false);

  const createCandidate = useCreateCandidate();

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
    await createCandidate.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
      },
    });
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

        <h1 className="page-heading">Add Candidate</h1>
      </div>
      <p className="page-description">
        This information will be used for screening, interview scheduling, and
        further recruitment steps. Make sure to fill in all relevant fields
        accurately.
      </p>

      <div className="my-8 md:p-4">
        <CandidateForm form={form} onSubmit={onSubmit} />
      </div>

      <DiscardChangesAlert
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        onConfirm={() => navigate(-1)}
      />
    </>
  );
};

export default AddCandidate;
