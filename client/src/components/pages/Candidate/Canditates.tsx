import { DataTable } from "@/components/tables/DataTable";
import { CandidateColumns } from "@/components/tables/Columns/CandidateColumns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetAllCandidates } from "@/services/candidates/queries";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import NotFound from "../NotFound";
import SearchInput from "@/components/shared/SearchInput";
import { useDebounce } from "use-debounce";
import GridViewSkeleton from "@/components/skeletons/GridViewLayout";
import ListViewSkeleton from "@/components/skeletons/ListViewSkeleton";
import GridViewLayout from "@/components/layouts/GridViewLayout";
import CandidateCard from "@/components/cards/CandidateCard";
import NoData from "@/components/shared/NoData";
import DataViewToggle from "@/components/shared/DataViewToggle";
import RetryButton from "@/components/shared/RetryButton";

const Candidates = () => {
  const view = useSelector((state: RootState) => state.dataView.candidates);
  const isGridView = view === "grid";

  const [searchParams] = useSearchParams();
  const initialSearchQuery =
    searchParams.get("search") || searchParams.get("status") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const {
    data: candidatesData,
    isPending: candidatesLoading,
    error: candidateError,
    refetch: refetchCandidates,
  } = useGetAllCandidates(isGridView ? { search: debouncedQuery } : undefined);

  if (candidateError)
    return (
      <NotFound
        className="h-no-header"
        label="Something went wrong. Failed to load drafts."
        actionButton={
          <RetryButton
            onClick={() => refetchCandidates()}
            retrying={candidatesLoading}
          />
        }
      />
    );

  return (
    <>
      <h1 className="page-heading">Candidates</h1>
      <p className="page-description">
        Add or view full CV, change status and record assessments/evaluations.
      </p>

      <DataViewToggle view={view} section="candidates" />

      <div className="mb-4 flex flex-col items-end justify-between gap-4 md:flex-row">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={() => {
            setSearchQuery("");
          }}
          className="max-w-[600px] self-start"
          placeholder="Search for candidates using id, name, email, phone, technology, level and status."
        />

        <Button asChild>
          <Link to="/candidates/add">
            <Plus /> Add
          </Link>
        </Button>
      </div>

      {isGridView ? (
        candidatesLoading ? (
          <GridViewSkeleton />
        ) : candidatesData && candidatesData.data.length > 0 ? (
          <GridViewLayout>
            {candidatesData.data.map((candidate) => (
              <CandidateCard key={candidate._id} candidate={candidate} />
            ))}
          </GridViewLayout>
        ) : (
          <NoData label="No candidates found." />
        )
      ) : candidatesLoading ? (
        <ListViewSkeleton />
      ) : (
        <DataTable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          columns={CandidateColumns}
          data={candidatesData.data}
          searchableColumns={[
            "_id",
            "name",
            "email",
            "phone",
            "technology",
            "level",
            "status",
          ]}
          searchPlaceholder="Search for candidates using id, name, email, phone, technology, level and status."
        />
      )}
    </>
  );
};

export default Candidates;
