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
import { useState } from "react";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Loader2 } from "lucide-react";

interface DataTableProps<TData, TValue> {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  topChildren?: React.ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  searchableColumns?: (
    | Extract<keyof TData, string>
    | `${Extract<keyof TData, string>}.${string}`
  )[];
  addDataForm?: React.ReactNode;
  addDataTitle?: string;
  addDataDescription?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  searchQuery,
  setSearchQuery,
  columns,
  data,
  searchableColumns,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data ?? [],
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
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    globalFilterFn: (row: Row<TData>, _, filterValue: string) => {
      const value = filterValue.toLowerCase();

      if (!searchableColumns || searchableColumns.length === 0) {
        return true;
      }

      return searchableColumns.some((col) => {
        const keys = col.split(".");
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
        } else if (Array.isArray(rowValue)) {
          return rowValue.some((item) =>
            item?.toString().toLowerCase().includes(value),
          );
        }
        return false;
      });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex-1 overflow-x-hidden rounded-xl border">
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-14 text-center"
                >
                  <Loader2 className="mx-auto animate-spin" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
