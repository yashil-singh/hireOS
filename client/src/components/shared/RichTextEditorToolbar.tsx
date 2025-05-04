import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pen,
  PenOff,
  Pilcrow,
  Underline,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ToolTip from "./ToolTip";

type RichTextEditorToolbarProps = {
  className?: string;
  editor: Editor | null;
  showChars?: boolean;
};

const RichTextEditorToolbar = ({
  className,
  editor,
  showChars = true,
}: RichTextEditorToolbarProps) => {
  const [selectedBlock, setSelectedBlock] = useState("paragraph"); // For Select
  const [activeFormats, setActiveFormats] = useState<string[]>([]); // For bold, italic, underline
  const [textAlign, setTextAlign] = useState<string | undefined>(undefined); // For alignment
  const [characterCount, setCharacterCount] = useState(
    editor?.getText().length,
  );
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      // Block type (paragraph, heading, list)
      if (editor.isActive("heading", { level: 1 })) setSelectedBlock("h1");
      else if (editor.isActive("heading", { level: 2 })) setSelectedBlock("h2");
      else if (editor.isActive("heading", { level: 3 })) setSelectedBlock("h3");
      else if (editor.isActive("bulletList")) setSelectedBlock("bullet-list");
      else if (editor.isActive("orderedList")) setSelectedBlock("num-list");
      else setSelectedBlock("paragraph");

      // Active text formats (bold, italic, underline)
      const formats: string[] = [];
      if (editor.isActive("bold")) formats.push("bold");
      if (editor.isActive("italic")) formats.push("italic");
      if (editor.isActive("underline")) formats.push("underline");
      setActiveFormats(formats);

      // Text alignment
      if (editor.isActive({ textAlign: "left" })) setTextAlign("left");
      else if (editor.isActive({ textAlign: "center" })) setTextAlign("center");
      else if (editor.isActive({ textAlign: "right" })) setTextAlign("right");
      else if (editor.isActive({ textAlign: "justify" }))
        setTextAlign("justify");
      else setTextAlign(undefined);
    };

    const updateCharacterCount = () => {
      const content = editor.getText();
      setCharacterCount(content.length);
    };

    setEditable(editor.isEditable);

    editor.on("selectionUpdate", updateToolbar);
    editor.on("transaction", updateToolbar);
    editor.on("update", () => {
      setEditable(editor.isEditable);
      updateCharacterCount();
    });

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("transaction", updateToolbar);
      editor.off("update", () => {
        setEditable(editor.isEditable);
        updateCharacterCount();
      });
    };
  }, [editor]);

  if (!editor) return null;

  const handleValueChange = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    }
    if (value === "h1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    }
    if (value === "h2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    }
    if (value === "h3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
    if (value === "bullet-list") {
      editor.chain().focus().toggleBulletList().run();
    }
    if (value === "num-list") {
      editor.chain().focus().toggleOrderedList().run();
    }
  };

  const getIcon = (val: string) => {
    switch (val) {
      case "paragraph":
        return <Pilcrow className="size-4" />;
      case "h1":
        return <Heading1 className="size-4" />;
      case "h2":
        return <Heading2 className="size-4" />;
      case "h3":
        return <Heading3 className="size-4" />;
      case "bullet-list":
        return <List className="size-4" />;
      case "num-list":
        return <ListOrdered className="size-4" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        showChars &&
          "flex h-fit flex-col items-center gap-1 border-b p-2 md:h-13 md:flex-row md:gap-2",
        !showChars && "items-centerborder-b flex h-13 flex-row gap-2 p-2",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <Select
          value={selectedBlock}
          onValueChange={handleValueChange}
          disabled={!editable}
        >
          <SelectTrigger className="dark:bg-card border-none shadow-none">
            {getIcon(selectedBlock)}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Hierarchy</SelectLabel>
              <SelectItem value="paragraph">
                <Pilcrow className="size-4" /> Paragraph
              </SelectItem>
              <SelectItem value="h1">
                <Heading1 className="size-4" /> Heading 1
              </SelectItem>
              <SelectItem value="h2">
                <Heading2 className="size-4" /> Heading 2
              </SelectItem>
              <SelectItem value="h3">
                <Heading3 className="size-4" /> Heading 3
              </SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Lists</SelectLabel>
              <SelectItem value="bullet-list">
                <List className="size-4" /> Bullet List
              </SelectItem>
              <SelectItem value="num-list">
                <ListOrdered className="size-4" /> Numbered List
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <ToggleGroup type="multiple" className="gap-1" value={activeFormats}>
          <ToolTip label="Toggle Bold" show={editable}>
            <ToggleGroupItem
              value="bold"
              aria-label="Toggle bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="aspect-square"
              disabled={!editable}
            >
              <Bold className="size-4" />
            </ToggleGroupItem>
          </ToolTip>

          <ToolTip label="Toggle Italic" show={editable}>
            <ToggleGroupItem
              value="italic"
              aria-label="Toggle italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="aspect-square"
              disabled={!editable}
            >
              <Italic className="size-4" />
            </ToggleGroupItem>
          </ToolTip>

          <ToolTip label="Toggle Underline" show={editable}>
            <ToggleGroupItem
              value="underline"
              aria-label="Toggle underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="aspect-square"
              disabled={!editable}
            >
              <Underline className="size-4" />
            </ToggleGroupItem>
          </ToolTip>
        </ToggleGroup>
      </div>

      <Separator orientation="vertical" />

      <ToggleGroup type="single" className="gap-1" value={textAlign}>
        <ToolTip label="Align Left" show={editable}>
          <ToggleGroupItem
            value="left"
            aria-label="Align Left"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className="aspect-square"
            disabled={!editable}
          >
            <AlignLeft className="size-4" />
          </ToggleGroupItem>
        </ToolTip>
        <ToolTip label="Align Center" show={editable}>
          <ToggleGroupItem
            value="center"
            aria-label="Align Center"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className="aspect-square"
            disabled={!editable}
          >
            <AlignCenter className="size-4" />
          </ToggleGroupItem>
        </ToolTip>
        <ToolTip label="Align Right" show={editable}>
          <ToggleGroupItem
            value="right"
            aria-label="Align Right"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className="aspect-square"
            disabled={!editable}
          >
            <AlignRight className="size-4" />
          </ToggleGroupItem>
        </ToolTip>

        <ToolTip label="Align Justify" show={editable}>
          <ToggleGroupItem
            value="justify"
            aria-label="Align Justify"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className="aspect-square"
            disabled={!editable}
          >
            <AlignJustify className="size-4" />
          </ToggleGroupItem>
        </ToolTip>
      </ToggleGroup>

      {showChars && (
        <div className="flex items-center gap-1 md:ml-auto">
          <span className="text-muted-foreground text-sm">
            {characterCount} characters
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost-muted"
                onClick={() => editor.setEditable(!editor.isEditable)}
              >
                {editable ? <PenOff /> : <Pen />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {editable ? "Make Read-Only" : "Edit"}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default RichTextEditorToolbar;
