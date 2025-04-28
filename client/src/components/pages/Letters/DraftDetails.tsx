import Drafts from "@/assets/data/Drafts";
import BackButton from "@/components/shared/BackButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { format } from "date-fns";
import { useState } from "react";

const DraftDetails = () => {
  const draft = Drafts[0];

  const { id, title, content: initialContent, createdAt } = draft;

  const [content, setContent] = useState(initialContent);

  return (
    <div className="small-container space-y-4">
      <BackButton />

      <div>
        <h1 className="page-heading">
          {title} - {id}
        </h1>
        <p className="page-description">
          Created on {format(new Date(createdAt), DEFAULT_DATE_FORMAT)}
        </p>
      </div>

      <RichTextEditor
        content={content}
        onChange={setContent}
        className="no-scrollbar max-h-[60vh] overflow-y-auto"
        editable={false}
      />
    </div>
  );
};

export default DraftDetails;
