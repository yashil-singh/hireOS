import Drafts from "@/assets/data/Drafts";
import DeleteAlert from "@/components/dialogs/DeleteAlert";
import BackButton from "@/components/shared/BackButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { format } from "date-fns";
import { Save, X } from "lucide-react";
import { useState } from "react";

const DraftDetails = () => {
  const draft = Drafts[0];

  const { id, title, content: initialContent, createdAt } = draft;

  const [content, setContent] = useState(initialContent);

  return (
    <div className="small-container space-y-4">
      <BackButton />

      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="page-heading">
            {title} - {id}
          </h1>
          <p className="page-description">
            Created on {format(new Date(createdAt), DEFAULT_DATE_FORMAT)}
          </p>
        </div>

        <DeleteAlert itemName={`${draft.title}-${draft.id}`} />
      </div>

      <RichTextEditor
        content={content}
        onChange={setContent}
        className="no-scrollbar max-h-[60vh] overflow-y-auto"
        editable={false}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button className="w-full sm:w-[80px]">
          <Save /> Save
        </Button>
        <Button variant="destructive" className="w-full sm:w-fit">
          <X /> Discard
        </Button>
      </div>
    </div>
  );
};

export default DraftDetails;
