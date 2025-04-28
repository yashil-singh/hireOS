import CandidateData from "@/assets/data/Candidates";
import { useEffect } from "react";
import { getCandidates } from "@/services/candidates/api";
import { DataTable } from "@/components/tables/DataTable";
import { columns } from "@/components/tables/CandidateProfile/Columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const Candidates = () => {
  const [searchParams] = useSearchParams();
  const initialSearchQuery = searchParams.get("search") ?? "";
  useEffect(() => {
    const fetchCandidates = async () => {
      const response = await getCandidates();
      console.log("🚀 ~ CanditateProfiles.tsx:12 ~ response:", response);
    };

    fetchCandidates();
  }, []);
  return (
    <>
      <h1 className="page-heading">Candidates</h1>
      <p className="page-description">
        Add or view full CV, change status and record assessments/evaluations.
      </p>

      <DataTable
        columns={columns}
        data={CandidateData}
        searchableColumns={[
          "id",
          "name",
          "email",
          "phone",
          "technology",
          "level",
          "status",
        ]}
        addDataTitle=""
        addDataDescription=""
        initialSearchQuery={initialSearchQuery}
        topChildren={
          <Button asChild>
            <Link to="/candidates/add">
              <Plus /> Add
            </Link>
          </Button>
        }
      />
    </>
  );
};

export default Candidates;
