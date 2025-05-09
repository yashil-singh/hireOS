import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DataView, DataViewState } from "@/lib/slices/dataView/types";
import { useDispatch } from "react-redux";
import { setDataView } from "@/lib/slices/dataView/dataViewSlice";
import { LayoutGrid, List } from "lucide-react";

const DataViewToggle = ({
  view,
  section,
}: {
  view: DataView;
  section: keyof DataViewState;
}) => {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-muted-foreground text-sm font-semibold">
        View:{" "}
      </span>
      <ToggleGroup
        value={view}
        onValueChange={(view: DataView) =>
          dispatch(setDataView({ section, view }))
        }
        type="single"
        className="my-4 space-x-1"
      >
        <ToggleGroupItem value="grid">
          <LayoutGrid className="size-5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list">
          <List className="size-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default DataViewToggle;
