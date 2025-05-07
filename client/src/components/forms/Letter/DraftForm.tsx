import FormSubmitButton from "@/components/shared/FormSubmitButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, extractVariables } from "@/lib/utils";
import { DraftFormValues } from "@/services/drafts/types";
import { UseFormReturn } from "react-hook-form";
import { Editor } from "@tiptap/react";
import VariableInsert from "@/components/shared/VariableInsert";
import { useRef } from "react";
import { useGetDraftVariables } from "@/services/drafts/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DraftFormProps = {
  form: UseFormReturn<DraftFormValues>;
  onSubmit: (data: DraftFormValues) => void;
  className?: string;
  onEditorReady?: (editor: Editor) => void;
};

const DraftForm = ({
  form,
  onSubmit,
  className,
  onEditorReady,
}: DraftFormProps) => {
  const editorRef = useRef<Editor | null>(null);

  const content = form.watch("content");

  // Queries
  const { data: draftVariablesData } = useGetDraftVariables();

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const extractedVariables = extractVariables(content);

          const usedVariables = extractedVariables.map((key) => {
            const matched = draftVariablesData?.data.find((v) => v.key === key);
            return {
              _id: matched ? matched._id : null,
              key,
            };
          });

          form.setValue("variables", usedVariables);
          form.handleSubmit(onSubmit)();
        }}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter draft title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  {...form}
                >
                  <SelectTrigger className="h-12! w-full">
                    <SelectValue placeholder="Select draft type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejection">Rejection</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center justify-end gap-4 md:flex-row">
          <VariableInsert
            variables={draftVariablesData?.data ?? []}
            onClick={(key) => editorRef?.current?.commands.insertContent(key)}
          />
        </div>

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

        <FormSubmitButton isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};

export default DraftForm;
