import DraftForm from "@/components/forms/Letter/DraftForm";
import BackButton from "@/components/shared/BackButton";

import { draftFormSchema } from "@/lib/schemas/letterSchemas";
import { useCreateDraft } from "@/services/drafts/mutations";
import { DraftFormValues } from "@/services/drafts/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Editor } from "@tiptap/react";

const CreateDraft = () => {
  const form = useForm<DraftFormValues>({
    defaultValues: {
      title: "",
      content: undefined,
      variables: [],
    },
    resolver: zodResolver(draftFormSchema),
  });

  // Mutations
  const createDraftMutation = useCreateDraft();

  const editorRef = useRef<Editor | null>(null);

  const onCreate = async (values: DraftFormValues) => {
    await createDraftMutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        editorRef.current?.commands.setContent("");
      },
    });
  };

  return (
    <>
      <div className="small-container mt-4 space-y-4">
        <BackButton />

        <h1 className="page-heading mt-4">Create new draft</h1>
        <p className="page-description">
          Quickly add new Create a reusable draft letter template that can be
          edited and personalized before sending.
        </p>

        <DraftForm
          form={form}
          onSubmit={onCreate}
          onEditorReady={(editor) => (editorRef.current = editor)}
        />
      </div>
    </>
  );
};

export default CreateDraft;
