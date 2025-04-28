import AccountAvatar from "@/components/shared/AccountAvatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Letter } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { formatDate } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export const LetterColumns: ColumnDef<Letter>[] = [
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
    cell: ({ row }) => (
      <AccountAvatar
        className="size-8"
        avatarUrl={row.original.candidate.avatarUrl ?? ""}
      />
    ),
  },
  {
    accessorKey: "candidate.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Candidate Name" />
    ),
  },
  {
    accessorKey: "candidate.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Candidate Email" />
    ),
  },
  {
    accessorKey: "draft.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Draft" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Sent" />
    ),
    cell: ({ row }) =>
      `${formatDate(new Date(row.original.createdAt), DEFAULT_DATE_FORMAT)}`,
  },
  {
    id: "actions",
    header: () => <span className="text-primary">Actions</span>,
    cell: ({ row }) => {
      const { id, candidate } = row.original;

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
              <Link to={`/letters/${id}`}>View Letter Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/candidates/${candidate.id}`}>
                View Candidate Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
              Copy Letter ID
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
