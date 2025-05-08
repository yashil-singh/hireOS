import CandidateForm from "./CandidateForm";
import { candidateSchema } from "@/lib/schemas/candidateSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEditCandidate } from "@/services/candidates/mutations";
import { Candidate } from "@/services/candidates/type";

const EditCandidateForm = ({ candidate }: { candidate: Candidate }) => {
  const navigate = useNavigate();
  const [discardOpen, setDiscardOpen] = useState(false);

  const form = useForm<z.infer<typeof candidateSchema>>({
    defaultValues: candidate,
    resolver: zodResolver(candidateSchema),
  });

  const editCandidate = useEditCandidate();

  const { isDirty } = form.formState;

  const onSubmit = async (values: z.infer<typeof candidateSchema>) => {
    await editCandidate.mutateAsync(
      { id: candidate._id, data: values },
      {
        onSuccess: () => {
          form.reset();
          navigate("/candidates");
        },
      },
    );
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

      <DiscardChangesAlert
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        onConfirm={() => navigate(-1)}
      />
    </>
  );
};

export default EditCandidateForm;
