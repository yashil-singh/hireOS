import { LetterColumns } from "@/components/tables/Columns/LetterColumns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FilePen, Send } from "lucide-react";
import { useGetAllLetters } from "@/services/letter/queries";
import NotFound from "../NotFound";

const Letters = () => {
  // Queries
  const {
    data: lettersData,
    isPending: lettersLoading,
    error: lettersError,
  } = useGetAllLetters();

  if (lettersError) return <NotFound />;

  return (
    <>
      <h1 className="page-heading">Letters</h1>
      <p className="page-description">Generate and manage letters.</p>

      <DataTable
        isLoading={lettersLoading}
        columns={LetterColumns}
        data={lettersData?.data}
        searchableColumns={[
          "id",
          "candidate.id",
          "candidate.name",
          "draft.title",
          "createdAt",
        ]}
        addDataTitle="Generate Letter"
        addDataDescription=""
        searchPlaceholder="Filter letters using candidate's id, name, email or draft title"
        topChildren={
          <>
            <Button asChild>
              <Link to="/letters/drafts">
                <FilePen />
                Drafts
              </Link>
            </Button>
            <Button asChild>
              <Link to="/letters/send">
                <Send />
                Send
              </Link>
            </Button>
          </>
        }
      />
    </>
  );
};

export default Letters;
