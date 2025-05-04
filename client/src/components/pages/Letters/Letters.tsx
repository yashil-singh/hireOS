import { LetterColumns } from "@/components/tables/Columns/LetterColumns";
import { DataTable } from "@/components/tables/DataTable";
import LetterData from "@/assets/data/Letters";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FilePen, Send } from "lucide-react";

const Letters = () => {
  return (
    <>
      <h1 className="page-heading">Letters</h1>
      <p className="page-description">Generate and manage letters.</p>

      <DataTable
        columns={LetterColumns}
        data={LetterData}
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
