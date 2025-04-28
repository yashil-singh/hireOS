import { cn } from "@/lib/utils";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import RichTextEditorToolbar from "./RichTextEditorToolbar";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import CharacterCounter from "@tiptap/extension-character-count";
import { useEffect } from "react";

type RichTextEditorProps = {
  className?: string;
  contentClassName?: string;
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  showToolBar?: boolean;
};

const RichTextEditor = ({
  className,
  contentClassName,
  content,
  onChange,
  editable = true,
  showToolBar = true,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      CharacterCounter,
    ],
    editable,
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert focus:outline-none p-4 max-w-full",
          "[&_ol]:ml-8 [&_ol]:list-decimal [&_ol]:my-2",
          "[&_ul]:ml-8 [&_ul]:list-disc [&_ul]:my-2",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-3",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-2",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-1",
          contentClassName,
        ),
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  return (
    <div className={cn("bg-card rounded-xl border", className)}>
      {showToolBar && <RichTextEditorToolbar editor={editor} />}

      <EditorContent editor={editor} />

      {showToolBar && (
        <BubbleMenu editor={editor}>
          <RichTextEditorToolbar
            editor={editor}
            className="bg-card w-fit rounded-full border"
            showChars={false}
          />
        </BubbleMenu>
      )}
    </div>
  );
};

export default RichTextEditor;
