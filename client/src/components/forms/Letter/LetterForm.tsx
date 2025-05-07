import DynamicDialog from "@/components/dialogs/DynamicDialog";
import FormSubmitButton from "@/components/shared/FormSubmitButton";
import NoData from "@/components/shared/NoData";
import RichTextEditor from "@/components/shared/RichTextEditor";
import SendLetterFormSkeleton from "@/components/skeletons/SendLetterFormSkeleton";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, replaceVariables } from "@/lib/utils";
import { useGetEligibleCandidates } from "@/services/candidates/queries";
import { useGetAllDrafts } from "@/services/drafts/queries";
import { LetterFormValues } from "@/services/letter/types";
import { Editor } from "@tiptap/react";
import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type LetterFormProps = {
  form: UseFormReturn<LetterFormValues>;
  onSubmit: (data: LetterFormValues) => void;
  className?: string;
  onEditorReady?: (editor: Editor) => void;
  setContentBeforeSubmitting: React.MutableRefObject<string>;
};

const LetterForm = ({
  form,
  onSubmit,
  className,
  onEditorReady,
  setContentBeforeSubmitting,
}: LetterFormProps) => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const editorRef = useRef<Editor | null>(null);

  const draft = form.watch("draftId");
  const content = form.watch("content");

  const [extraVariables, setExtraVariables] = useState<Record<string, string>>(
    {},
  );
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [preview, setPreview] = useState("");

  // Queries
  const {
    data: candidatesData,
    isPending: candidatesLoading,
    error: candidatesError,
  } = useGetEligibleCandidates(type ?? undefined);

  const { data: draftsData, isPending: draftsLoading } = useGetAllDrafts();

  const buildCandidateOptions = () => {
    const options: { label: string; value: string }[] = [];
    for (const candidate of candidatesData!.data) {
      options.push({
        label: `${candidate.name} - ${candidate.email}`,
        value: candidate._id,
      });
    }
    return options;
  };

  const buildDraftOptions = () => {
    const options: { label: string; value: string }[] = [];
    for (const draft of draftsData!.data) {
      options.push({
        label: `${draft.title} - Type: ${draft.type}`,
        value: draft._id,
      });
    }
    return options;
  };

  const changeContent = (content: string) => {
    editorRef.current?.commands.setContent(content);
    form.setValue("content", content);
  };

  useEffect(() => {
    if (candidatesError) {
      toast.error("Error loading form.");
    }
  }, [candidatesError]);

  useEffect(() => {
    const selectedDraft = draftsData?.data.find(
      (selected) => selected._id === draft,
    );

    if (!selectedDraft) return;

    changeContent(selectedDraft.content);
  }, [draft]);

  useEffect(() => {
    const defaultDraft = draftsData?.data.find(
      (draft) => draft.type === type && draft.isDefault,
    );

    if (defaultDraft) {
      form.setValue("draftId", defaultDraft._id);
    }
  }, [draftsData, type]);

  if (candidatesLoading || draftsLoading) return <SendLetterFormSkeleton />;

  if (!candidatesData || candidatesError) return null;

  const candidates = candidatesData.data;

  const candidateId = form.watch("candidateId");
  const selectedCandidate = candidates.find((c) => c._id === candidateId);

  const variabeValues: Record<string, string | undefined> = {
    candidateName: selectedCandidate?.name,
    candidateEmail: selectedCandidate?.email,
    candidatePhone: selectedCandidate?.phone,
    jobTitle: selectedCandidate?.level,
    salary: Number(selectedCandidate?.salaryExpectation).toLocaleString(),
  };

  const placeholderRegex = /{{(.*?)}}/g;
  const foundKeys = Array.from(
    new Set(
      Array.from(content.matchAll(placeholderRegex)).map(([, key]) =>
        key.trim(),
      ),
    ),
  );

  const missingKeys = foundKeys.filter((key) => !variabeValues[key]);

  return candidates.length > 0 ? (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="candidateId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Candidate</FormLabel>
              <FormControl>
                <Combobox
                  options={buildCandidateOptions()}
                  value={field.value}
                  setValue={field.onChange}
                  placeholder="Select candidate"
                  error={!!fieldState.error}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-4">
          {draftsData && draftsData.data.length > 0 && (
            <FormField
              control={form.control}
              name="draftId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <FormLabel>Draft</FormLabel>
                      <Combobox
                        options={buildDraftOptions()}
                        value={field.value!}
                        setValue={field.onChange}
                        error={!!fieldState.error}
                        placeholder="Select a draft"
                        searchPlaceholder="Search draft"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        {missingKeys.length > 0 && (
          <div className="space-y-4">
            <FormLabel>Variables</FormLabel>
            {missingKeys.map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <label htmlFor={key} className="text-sm font-medium capitalize">
                  {key}
                </label>
                <Input
                  id={key}
                  type="text"
                  value={extraVariables[key] || ""}
                  onChange={(e) =>
                    setExtraVariables((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  placeholder={`Enter value for ${key}`}
                />
              </div>
            ))}
          </div>
        )}

        <FormField
          control={form.control}
          name="content"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor
                  isError={!!fieldState.error}
                  content={field.value}
                  onChange={field.onChange}
                  onEditorReady={(editor) => {
                    editorRef.current = editor;
                    if (onEditorReady) {
                      onEditorReady(editor);
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {content !== "<p></p>" && (
          <DynamicDialog
            title="Letter Preview"
            description="The following is a preview of the letter that will be sent:"
            open={isPreviewing}
            onOpenChange={setIsPreviewing}
            trigger={
              <Button
                type="button"
                onClick={() => {
                  const replacedContent = replaceVariables(content, {
                    ...variabeValues,
                    ...extraVariables,
                  });
                  setPreview(replacedContent);
                }}
                className="w-full"
                variant="outline"
              >
                <Eye /> Preview
              </Button>
            }
          >
            <RichTextEditor
              content={preview}
              onChange={() => {}}
              editable={false}
              showToolBar={false}
            />
          </DynamicDialog>
        )}

        <FormSubmitButton
          type="button"
          onClick={() => {
            const knownValuesReplaced = replaceVariables(
              content,
              variabeValues,
            );
            setContentBeforeSubmitting.current = knownValuesReplaced;

            const replacedContent = replaceVariables(
              knownValuesReplaced,
              extraVariables,
            );
            form.setValue("content", replacedContent);

            form.handleSubmit(onSubmit)();
          }}
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  ) : (
    <NoData label="Currently, no candidates in the offer stage." />
  );
};

export default LetterForm;
