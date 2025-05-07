import { DataTable } from "@/components/tables/DataTable";
import { CandidateColumns } from "@/components/tables/Columns/CandidateColumns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetAllCandidates } from "@/services/candidates/queries";
import { useEffect } from "react";
import { toast } from "sonner";

const Candidates = () => {
  const [searchParams] = useSearchParams();
  const initialSearchQuery =
    searchParams.get("search") || searchParams.get("status") || "";

  const { data, isLoading, error } = useGetAllCandidates();

  useEffect(() => {
    if (error) {
      toast.error("Error getting candidate data.", {
        description: error.message,
      });
    }
  }, [error]);

  return (
    <>
      <h1 className="page-heading">Candidates</h1>
      <p className="page-description">
        Add or view full CV, change status and record assessments/evaluations.
      </p>

      <DataTable
        columns={CandidateColumns}
        data={data?.data}
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
        searchPlaceholder="Search for candidates using id, name, email, phone, technology, level and status."
        topChildren={
          <Button asChild>
            <Link to="/candidates/add">
              <Plus /> Add
            </Link>
          </Button>
        }
        isLoading={isLoading}
      />
    </>
  );
};

export default Candidates;
