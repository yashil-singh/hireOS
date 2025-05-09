import { RootState } from "@/lib/slices/store";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import SearchInput from "@/components/shared/SearchInput";
import { useEffect, useState } from "react";
import { useGetAllDrafts } from "@/services/drafts/queries";
import GridViewSkeleton from "@/components/skeletons/GridViewLayout";
import NotFound from "../NotFound";
import NoData from "@/components/shared/NoData";
import BackButton from "@/components/shared/BackButton";
import { useDebounce } from "use-debounce";
import RetryButton from "@/components/shared/RetryButton";
import DraftCard from "@/components/cards/DraftCard";
import { DataTable } from "@/components/tables/DataTable";
import { DraftColumns } from "@/components/tables/Columns/DraftColumns";
import DataViewToggle from "@/components/shared/DataViewToggle";
import GridViewLayout from "@/components/layouts/GridViewLayout";
import ListViewSkeleton from "@/components/skeletons/ListViewSkeleton";

const Drafts = () => {
  const view = useSelector((state: RootState) => state.dataView.drafts);
  const isGridView = view === "grid";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  // Queries
  const {
    data: draftsData,
    isPending: draftsLoading,
    error: draftsError,
    refetch: refetchDrafts,
  } = useGetAllDrafts(isGridView ? { search: debouncedQuery } : undefined);

  useEffect(() => {
    refetchDrafts();
  }, [debouncedQuery, refetchDrafts]);

  if (draftsError)
    return (
      <NotFound
        className="h-no-header"
        label="Something went wrong. Failed to load drafts."
        actionButton={
          <RetryButton
            onClick={() => refetchDrafts()}
            className="w-fit"
            retrying={draftsLoading}
          />
        }
      />
    );

  return (
    <>
      <BackButton />

      <h1 className="page-heading mt-4">Drafts</h1>
      <p className="page-description">
        Manage and customize reusable letter templates such as offer letters,
        rejection letters, and more. Drafts can be edited, previewed, and used
        to quickly issue letters to candidates.
      </p>

      <DataViewToggle view={view} section="drafts" />

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
          <Link to="/letters/drafts/create">
            <Plus /> Add
          </Link>
        </Button>
      </div>

      {isGridView ? (
        draftsLoading ? (
          <GridViewSkeleton />
        ) : draftsData && draftsData.data.length > 0 ? (
          <GridViewLayout>
            {draftsData.data.map((draft) => (
              <DraftCard key={draft._id} draft={draft} />
            ))}
          </GridViewLayout>
        ) : (
          <NoData label="No drafts found." />
        )
      ) : draftsLoading ? (
        <ListViewSkeleton />
      ) : (
        <DataTable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={draftsLoading}
          columns={DraftColumns}
          data={draftsData.data}
          searchableColumns={["_id", "title", "type"]}
          addDataTitle="Generate Letter"
          addDataDescription=""
          searchPlaceholder="Filter drafts by title or type..."
          topChildren={
            <Button asChild>
              <Link to="/letters/drafts/create">
                <Plus /> Add
              </Link>
            </Button>
          }
        />
      )}
    </>
  );
};

export default Drafts;
