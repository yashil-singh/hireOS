import AccountAvatar from "@/components/shared/AccountAvatar";
import BackButton from "@/components/shared/BackButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import LetterSkeleton from "@/components/skeletons/LetterSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { useGetLetterById } from "@/services/letter/queries";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";
import NotFound from "../NotFound";

const LetterDetails = () => {
  const { id } = useParams();

  const { data, isPending, error } = useGetLetterById(id!);

  if (isPending) return <LetterSkeleton />;

  if (!data || error) return <NotFound label="letter" />;

  const { candidate, content, draft, createdAt } = data.data;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <BackButton />

      <div>
        <h1 className="page-heading">Draft Used - {draft.title}</h1>

        <div className="flex items-center gap-2 text-lg">
          <p className="hidden md:block">Sent to </p>
          <Link
            to={`/candidates/${candidate._id}`}
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
        <Link to={`/letters/drafts/${draft._id}`}>View Used Draft</Link>
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
