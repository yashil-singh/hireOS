import { LetterColumns } from "@/components/tables/Columns/LetterColumns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileEdit, Send } from "lucide-react";
import { useGetAllLetters } from "@/services/letter/queries";
import NotFound from "../NotFound";
import DataViewToggle from "@/components/shared/DataViewToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import GridViewSkeleton from "@/components/skeletons/GridViewLayout";
import NoData from "@/components/shared/NoData";
import SearchInput from "@/components/shared/SearchInput";
import LetterCard from "@/components/cards/LetterCard";
import ListViewSkeleton from "@/components/skeletons/ListViewSkeleton";
import GridViewLayout from "@/components/layouts/GridViewLayout";

const Letters = () => {
  const view = useSelector((state: RootState) => state.dataView.letters);
  const isGridView = view === "grid";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  // Queries
  const {
    data: lettersData,
    isPending: lettersLoading,
    error: lettersError,
  } = useGetAllLetters(isGridView ? { search: debouncedQuery } : undefined);

  if (lettersError) return <NotFound label="Failed to load letters." />;

  return (
    <>
      <h1 className="page-heading">Letters</h1>
      <p className="page-description">Generate and manage letters.</p>

      <DataViewToggle view={view} section="letters" />

      <div className="mb-4 flex flex-col items-end justify-between gap-4 md:flex-row">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={() => {
            setSearchQuery("");
          }}
          className="max-w-[500px] self-start"
          placeholder="Search for a letter using title, type, candidate's name or email..."
        />

        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link to="/letters/drafts">
              <FileEdit /> Drafts
            </Link>
          </Button>
          <Button asChild>
            <Link to="/letters/drafts/create">
              <Send /> Send
            </Link>
          </Button>
        </div>
      </div>

      {isGridView ? (
        lettersLoading ? (
          <GridViewSkeleton />
        ) : lettersData && lettersData.data.length > 0 ? (
          <GridViewLayout>
            {lettersData.data.map((letter) => (
              <LetterCard key={letter._id} letter={letter} />
            ))}
          </GridViewLayout>
        ) : (
          <NoData label="No letters found." />
        )
      ) : lettersLoading ? (
        <ListViewSkeleton />
      ) : (
        <DataTable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={lettersLoading}
          columns={LetterColumns}
          data={lettersData.data}
          searchableColumns={[
            "_id",
            "candidate._id",
            "candidate.name",
            "draft.title",
            "createdAt",
          ]}
          addDataTitle="Generate Letter"
          searchPlaceholder="Filter letters using candidate's id, name, email or draft title"
        />
      )}
    </>
  );
};

export default Letters;
