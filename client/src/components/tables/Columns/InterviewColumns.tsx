import AccountAvatar from "@/components/shared/AccountAvatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { formatDate } from "date-fns";
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  interviewStatusColor,
} from "@/lib/constants";
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
import { CalendarEvent } from "@/services/calendar/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const InterviewColumns: ColumnDef<CalendarEvent>[] = [
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
    accessorKey: "candidate.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Candidate Name" />
    ),
    cell: ({ row }) => {
      const { candidate } = row.original;
      return (
        <Link
          to={`/candidates/${candidate._id}`}
          className="flex items-center space-x-2"
        >
          <AccountAvatar
            className="size-8"
            avatarUrl={candidate.avatarUrl ?? ""}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{candidate.name}</span>
            <span className="text-muted-foreground text-xs">
              {candidate.email}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "event.step.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Step" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.original.event.step?.title}</span>
    ),
  },
  {
    id: "scheduledFor",
    header: () => <p className="text-primary">Scheduled For</p>,
    cell: ({ row }) => {
      const { start, end } = row.original;
      return (
        <p>
          {formatDate(new Date(start), `${DEFAULT_DATE_FORMAT}`)},{" "}
          {formatDate(new Date(start), `${DEFAULT_TIME_FORMAT}`)} -{" "}
          {formatDate(new Date(end), `${DEFAULT_TIME_FORMAT}`)}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const statusClass =
        interviewStatusColor[
          row.original.status as keyof typeof interviewStatusColor
        ];
      return (
        <Badge className={cn("capitalize", statusClass)}>
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="text-primary">Actions</span>,
    cell: ({ row }) => {
      const { _id, candidate } = row.original;

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
              <Link to={`/interviews/${_id}`}>View Interview Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/candidates/${candidate._id}`}>
                View Candidate Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(_id)}
            >
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
