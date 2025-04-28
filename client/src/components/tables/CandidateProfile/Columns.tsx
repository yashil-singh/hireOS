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
import { Link } from "react-router-dom";
import AccountAvatar from "@/components/shared/AccountAvatar";
import { differenceInDays } from "date-fns";

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
    id: "avatar",
    header: () => <></>,
    cell: ({ row }) => (
      <AccountAvatar
        className="size-8"
        avatarUrl={row.original.avatarUrl ?? ""}
      />
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

      let filteredDuration = "";
      let totalDuration = 0;

      experiences.forEach((exp) => {
        const startDate = new Date(exp.startDate);
        const endDate = new Date(exp.endDate);

        const diffInDays = differenceInDays(endDate, startDate);
        totalDuration += diffInDays;
      });

      if (totalDuration) {
        const years = Math.floor(totalDuration / 365);
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
        filteredDuration = "N/A";
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
      const candidate = row.original;

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
            <DropdownMenuItem asChild>
              <Link to={`/candidates/${candidate.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/candidates/edit/${candidate.id}`}>Edit Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(candidate.id)}
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
