import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Candidate } from "@/lib/types";

export const columns: ColumnDef<Candidate>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
  },
  {
    accessorKey: "experience",
    header: () => <div className="text-primary">Experience</div>,
    cell: ({ row }) => {
      const candidate = row.original;
      const experiences = candidate.experience;

      const totalDuration = experiences.reduce(
        (total, exp) => total + exp.duration,
        0,
      );

      let filteredDuration = "";

      if (totalDuration) {
        const years = Math.floor(totalDuration / 12);
        const months = totalDuration % 12;

        if (years > 0) {
          filteredDuration += `${years} year${years > 1 ? "s" : ""}`;
        }

        if (months > 0) {
          filteredDuration +=
            years > 0
              ? ` ${months} month${months > 1 ? "s" : ""}`
              : `${months} month${months > 1 ? "s" : ""}`;
        }
      } else {
        filteredDuration = "None";
      }

      return <span>{filteredDuration}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    id: "actions",
    header: () => <span className="text-primary">Actions</span>,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="data-[state=open]:bg-primary/10"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View CV</DropdownMenuItem>
            <DropdownMenuItem>Edit Candidate Profile</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Candidate ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive hover:text-destructive!">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
