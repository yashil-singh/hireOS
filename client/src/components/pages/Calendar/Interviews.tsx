import { InterviewColumns } from "@/components/tables/Columns/InterviewColumns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { useGetAllCalenderEvents } from "@/services/calendar/queries";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import NotFound from "../NotFound";
import { RootState } from "@/lib/slices/store";
import { useSelector } from "react-redux";
import DataViewToggle from "@/components/shared/DataViewToggle";
import SearchInput from "@/components/shared/SearchInput";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import GridViewSkeleton from "@/components/skeletons/GridViewLayout";
import NoData from "@/components/shared/NoData";
import GridViewLayout from "@/components/layouts/GridViewLayout";
import InterviewCard from "@/components/cards/InterviewCard";
import ListViewSkeleton from "@/components/skeletons/ListViewSkeleton";

const Interviews = () => {
  const view = useSelector((state: RootState) => state.dataView.interviews);
  const isGridView = view === "grid";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  // Queries
  const {
    data: interviewsData,
    isPending: interviewsLoading,
    error: interviewsError,
  } = useGetAllCalenderEvents(
    isGridView ? { search: debouncedQuery } : undefined,
  );

  if (interviewsError) return <NotFound label="Failed to load interviews." />;

  return (
    <>
      <h1 className="page-heading">Interviews</h1>
      <p className="page-description">Generate and manage letters.</p>

      <DataViewToggle view={view} section="interviews" />

      <div className="mb-4 flex flex-col items-end justify-between gap-4 md:flex-row">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={() => {
            setSearchQuery("");
          }}
          className="max-w-[500px] self-start"
          placeholder="Search for a draft using title or type..."
        />

        <Button asChild>
          <Link to="/calendar?schedule=true">
            <Calendar />
            Schedule
          </Link>
        </Button>
      </div>

      {isGridView ? (
        interviewsLoading ? (
          <GridViewSkeleton />
        ) : interviewsData.data.length > 0 ? (
          <GridViewLayout className="md:grid-cols-2">
            {interviewsData.data.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </GridViewLayout>
        ) : (
          <NoData label="No interviews found." />
        )
      ) : interviewsLoading ? (
        <ListViewSkeleton />
      ) : (
        <DataTable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          columns={InterviewColumns}
          data={interviewsData.data}
          searchableColumns={[
            "_id",
            "candidate.id",
            "candidate.name",
            "title",
            "status",
            "event.step.title",
          ]}
          addDataTitle="Generate Letter"
          searchPlaceholder="Filter interviews using interview title, status, step, candidate name or email... "
        />
      )}
    </>
  );
};

export default Interviews;
