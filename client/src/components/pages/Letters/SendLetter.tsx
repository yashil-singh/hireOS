import LetterForm from "@/components/forms/Letter/LetterForm";
import BackButton from "@/components/shared/BackButton";
import { letterFormSchema } from "@/lib/schemas/letterSchemas";
import { LetterFormValues } from "@/services/letter/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Editor } from "@tiptap/react";
import { useSearchParams } from "react-router-dom";
import { useSendLetter } from "@/services/letter/mutations";

const SendLetter = () => {
  const [searchParams] = useSearchParams();
  const draft = searchParams.get("draft");
  const candidate = searchParams.get("candidate");

  const editorRef = useRef<Editor | null>(null);
  const contentBeforeSubmittingRef = useRef("");

  const form = useForm<LetterFormValues>({
    defaultValues: {
      candidateId: candidate ?? "",
      content: "",
      draftId: draft ?? "",
    },
    resolver: zodResolver(letterFormSchema),
  });

  // Mutations
  const sendLetterMutation = useSendLetter();

  const onSend = async (values: LetterFormValues) => {
    await sendLetterMutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        editorRef.current?.commands.setContent("");
        contentBeforeSubmittingRef.current = "";
      },
      onError: () =>
        form.setValue("content", contentBeforeSubmittingRef.current),
    });
  };

  useEffect(() => {
    if (draft) {
      form.setValue("draftId", draft);
    }
  }, [draft, form]);

  return (
    <div className="small-container space-y-4">
      <BackButton />

      <div>
        <h1 className="page-heading">Send Letter</h1>
        <p className="page-description">
          Select a letter template, customize its content if needed, and send it
          to a candidate.
        </p>
      </div>

      <LetterForm
        form={form}
        onSubmit={onSend}
        onEditorReady={(editor) => (editorRef.current = editor)}
        setContentBeforeSubmitting={contentBeforeSubmittingRef}
      />
    </div>
  );
};

export default SendLetter;
