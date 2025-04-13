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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { DataTableViewOptions } from "@/components/tables/DataTableViewOptions";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchableColumns?: (keyof TData)[];
  addDataForm?: React.ReactNode;
  addDataTitle?: string;
  addDataDescription?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumns,
  addDataForm,
  addDataTitle,
  addDataDescription,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
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
        const rowValue = row.original[col];
        if (typeof rowValue === "number") {
          return rowValue.toString().includes(value);
        } else if (typeof rowValue === "string") {
          return rowValue.toLowerCase().includes(value);
        }
        return false;
      });
    },
  });

  const isMobile = useIsMobile();

  return (
    <div className="mt-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        {searchableColumns && searchableColumns.length > 0 && (
          <div className="space-y-2">
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            <Label className="text-muted-foreground text-xs">{`Filter by ${searchableColumns.join(", ")}.`}</Label>
          </div>
        )}

        <div className="flex gap-2 md:ml-auto">
          {addDataForm &&
            (isMobile ? (
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button>
                    <Plus /> Add
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="flex min-h-[90vh] items-center outline-none">
                  <div className="no-scrollbar mx-auto mt-4 w-full max-w-[800px] overflow-y-auto p-4">
                    <DrawerHeader className="px-0">
                      <DrawerTitle>{addDataTitle}</DrawerTitle>
                      <DrawerDescription>
                        {addDataDescription}
                      </DrawerDescription>
                    </DrawerHeader>
                    {addDataForm}
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus /> Add
                  </Button>
                </DialogTrigger>

                <DialogContent className="no-scrollbar max-h-[95vh] max-w-[800px]! overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{addDataTitle}</DialogTitle>
                    <DialogDescription>{addDataDescription}</DialogDescription>
                  </DialogHeader>
                  {addDataForm}
                </DialogContent>
              </Dialog>
            ))}
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
