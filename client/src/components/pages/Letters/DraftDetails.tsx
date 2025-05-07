import DeleteAlert from "@/components/dialogs/DeleteAlert";
import BackButton from "@/components/shared/BackButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import LetterSkeleton from "@/components/skeletons/LetterSkeleton";
import { Button } from "@/components/ui/button";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { useGetDraftById } from "@/services/drafts/queries";
import { format } from "date-fns";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../NotFound";

const DraftDetails = () => {
  const { id } = useParams();

  // Queries
  const { data, isPending } = useGetDraftById(id!);

  const [content, setContent] = useState("");

  if (isPending) return <LetterSkeleton />;
  if (!data) return <NotFound label="draft" />;

  const { _id, title, content: initialContent, createdAt } = data.data;

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

        <DeleteAlert itemName={`${title}-${_id}`} />
      </div>

      <RichTextEditor
        content={initialContent}
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
