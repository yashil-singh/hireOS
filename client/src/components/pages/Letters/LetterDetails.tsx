import Letters from "@/assets/data/Letters";
import AccountAvatar from "@/components/shared/AccountAvatar";
import BackButton from "@/components/shared/BackButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const LetterDetails = () => {
  const letter = Letters[0];
  const { candidate, content, draft, createdAt } = letter;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <BackButton />

      <div>
        <h1 className="page-heading">Draft - {draft.title}</h1>

        <div className="flex items-center gap-2 text-lg">
          <p className="hidden md:block">Sent to </p>
          <Link
            to={`/candidates/${candidate.id}`}
            className="flex flex-col md:flex-row md:items-center md:gap-1"
          >
            <AccountAvatar
              avatarUrl={candidate.avatarUrl ?? ""}
              className="hidden size-4 md:block"
            />
            <p>{candidate.name}</p>
            <span className="hidden md:block">•</span>
            <p>{candidate.email}</p>
          </Link>
        </div>
        <p className="page-description">
          On {format(new Date(createdAt), `${DEFAULT_DATE_FORMAT}, hh:mm a`)}
        </p>
      </div>

      <Button asChild>
        <Link to={`/letters/drafts/${draft.id}`}>View Used Draft</Link>
      </Button>

      <Card className="mx-auto">
        <CardHeader className="sr-only">
          <CardTitle>Letter Content</CardTitle>
          <CardDescription>
            This card shows the contents of the sent letter.
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-auto max-w-2xl text-left">
          <RichTextEditor
            content={content}
            onChange={() => {}}
            editable={false}
            showToolBar={false}
            className="rounded-none border-none"
            contentClassName="p-0"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LetterDetails;
