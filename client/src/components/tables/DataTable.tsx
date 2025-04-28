import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  VisibilityState,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { DataTableViewOptions } from "@/components/tables/DataTableViewOptions";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import DynamicDialog from "../dialogs/DynamicDialog";
import SearchInput from "../shared/SearchInput";

interface DataTableProps<TData, TValue> {
  topChildren?: React.ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchableColumns?: string[];
  addDataForm?: React.ReactNode;
  addDataTitle: string;
  addDataDescription: string;
  searchPlaceholder?: string;
  initialSearchQuery?: string;
}

export function DataTable<TData, TValue>({
  topChildren,
  columns,
  data,
  searchableColumns,
  addDataForm,
  addDataTitle,
  addDataDescription,
  searchPlaceholder,
  initialSearchQuery,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>(
    initialSearchQuery ?? "",
  );
  const [open, setOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row: Row<TData>, _, filterValue: string) => {
      const value = filterValue.toLowerCase();

      if (!searchableColumns || searchableColumns.length === 0) {
        return true;
      }

      return searchableColumns.some((col) => {
        const keys = col.split("."); // handle nested keys
        let rowValue: unknown = row.original;

        for (const key of keys) {
          if (rowValue == null) {
            return false;
          }
          rowValue = (rowValue as Record<string, unknown>)[key];
        }

        if (typeof rowValue === "number") {
          return rowValue.toString().includes(value);
        } else if (typeof rowValue === "string") {
          return rowValue.toLowerCase().includes(value);
        }
        return false;
      });
    },
  });

  return (
    <div className="mt-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        {searchableColumns && searchableColumns.length > 0 && (
          <div className="w-full space-y-2">
            <SearchInput
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full max-w-[500px]"
            />
            {searchPlaceholder && (
              <Label className="text-muted-foreground text-xs">
                {searchPlaceholder}
              </Label>
            )}
          </div>
        )}

        <div className="flex gap-2 md:ml-auto">
          {addDataForm && (
            <DynamicDialog
              title={addDataTitle}
              description={addDataDescription}
              trigger={
                <Button>
                  <Plus /> Add
                </Button>
              }
              open={open}
              onOpenChange={setOpen}
            >
              {addDataForm}
            </DynamicDialog>
          )}
          {topChildren}
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-14 text-center"
                >
                  No data to show.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
