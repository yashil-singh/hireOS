import AccountAvatar from "@/components/shared/AccountAvatar";
import BackButton from "@/components/shared/BackButton";
import { Button } from "@/components/ui/button";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { format } from "date-fns";
import {
  Bell,
  Briefcase,
  Calendar,
  Check,
  CircleCheck,
  Clock,
  EllipsisVertical,
  Eye,
  Loader2,
  Mail,
  Phone,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EventDetailsSkeleton from "@/components/skeletons/EventDetailsSkeleton";
import NotFound from "../NotFound";
import { useGetCalendarEventById } from "@/services/calendar/queries";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import DynamicDialog from "@/components/dialogs/DynamicDialog";
import RescheduleInterviewForm, {
  RescheduleInterviewFormValues,
} from "@/components/forms/Calendar/RescheduleInterviewForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rescheduleInterviewSchema } from "@/lib/schemas/interviewSchemas";
import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";
import {
  useMarkInterviewAsCompleted,
  useRescheduleInterview,
  useSendInterviewReminder,
} from "@/services/calendar/mutations";

const EventDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useGetCalendarEventById(id!);

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleCancelOpen, setRescheduleCancelOpen] = useState(false);

  const form = useForm<RescheduleInterviewFormValues>({
    resolver: zodResolver(rescheduleInterviewSchema),
    defaultValues: {
      candidate: "",
      date: undefined,
      startTime: undefined,
      endTime: undefined,
      interviewers: [],
    },
  });

  // Mutations
  const rescheduleMutation = useRescheduleInterview();
  const completeMutation = useMarkInterviewAsCompleted(id!);
  const { mutateAsync: sendReminderMutate, isPending: isSendingReminder } =
    useSendInterviewReminder();

  const [isCompleting, setIsCompleting] = useState(false);

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (form.formState.isDirty) {
        setRescheduleCancelOpen(true);
        return;
      }
    }

    setIsRescheduling(isOpen);
    form.reset();
  };

  const onReschedule = async (data: RescheduleInterviewFormValues) => {
    if (!id) {
      toast.error("Event ID not found.");
      return;
    }

    await rescheduleMutation.mutateAsync(
      {
        data,
        id,
      },
      {
        onSuccess: () => {
          form.reset();
          setIsRescheduling(false);
        },
      },
    );
  };

  const onComplete = async () => {
    setIsCompleting(true);
    await completeMutation.mutateAsync();
    setIsCompleting(false);
  };

  useEffect(() => {
    if (error) {
      toast.error("Error getting event data.", {
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      const candidateId = data.data.candidate._id;
      const interviewers = data.data.interviewers.map((int) => int._id);
      if (candidateId && interviewers) {
        form.reset({
          ...form.getValues(),
          candidate: candidateId,
          interviewers: interviewers,
        });
      }
    }
  }, [data]);

  if (isLoading) return <EventDetailsSkeleton />;

  if (!data || error) return <NotFound label="event" />;

  const { _id, title, candidate, start, end, interviewers, status } = data.data;

  const today = new Date();
  const isPassed = new Date(end) < today;

  return (
    <>
      <BackButton />

      <div className="my-4 flex items-start justify-between gap-8 md:justify-start">
        <div>
          <span className="flex items-center gap-2">
            <h1 className="page-heading">{title}</h1>
            {!isPassed && status !== "cancelled" && (
              <p className="flex items-center gap-1 text-sm text-amber-500">
                <Clock className="size-4" /> Pending
              </p>
            )}

            {isPassed && status === "completed" && (
              <p className="flex items-center gap-1 text-sm text-green-500">
                <CircleCheck className="size-4" /> Completed
              </p>
            )}

            {status === "cancelled" && (
              <p className="text-destructive flex items-center gap-1 text-sm">
                <X className="size-4" /> Cancelled
              </p>
            )}
          </span>

          <p className="page-description mt-1 flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
            <span className="flex items-center gap-1">
              <Calendar className="size-5" />{" "}
              {format(new Date(start), DEFAULT_DATE_FORMAT)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-5" /> {format(new Date(start), "hh:mm a")}{" "}
              - {format(new Date(end), "hh:mm a")}
              {status === "rescheduled" && (
                <span className="text-sm">(Rescheduled)</span>
              )}
            </span>
          </p>
        </div>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">More</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled={
                  isPassed || status === "cancelled" || isSendingReminder
                }
                onClick={() => sendReminderMutate(_id)}
              >
                <Bell /> Send Reminder
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {isPassed ? (
                <DropdownMenuItem className="text-destructive hover:text-destructive!">
                  <Trash2 className="text-destructive" /> Delete
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-destructive hover:text-destructive!">
                  <X className="text-destructive" /> Cancel
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col items-center gap-2 md:flex-row">
        {isPassed && (
          <Button
            className="w-full md:max-w-[170px]"
            disabled={
              status === "completed" || status === "cancelled" || !isPassed
            }
            onClick={onComplete}
          >
            {status === "completed" ? (
              <>
                <Check /> Completed
              </>
            ) : isCompleting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Check /> Mark as completed
              </>
            )}
          </Button>
        )}

        <DynamicDialog
          open={isRescheduling}
          onOpenChange={onOpenChange}
          trigger={
            <Button
              variant="outline"
              className="w-full md:max-w-[125px]"
              disabled={status === "completed" || status === "cancelled"}
            >
              <RotateCcw /> Reschedule
            </Button>
          }
          title="Re-Schedule Interview"
          description="Update the date and time of an existing interview, ensuring that the new schedule does not conflict with the candidate’s or interviewers’ availability."
        >
          <RescheduleInterviewForm form={form} onSubmit={onReschedule} />
        </DynamicDialog>
      </div>

      <h2 className="mt-4 text-lg font-semibold">Interviewee Details</h2>
      <div className="bg-card mt-2 flex flex-col items-center gap-4 rounded-xl border p-6 md:flex-row md:gap-8">
        <AccountAvatar
          avatarUrl={candidate.avatarUrl ?? ""}
          className="size-32"
        />

        <div className="w-full text-center md:text-start">
          <p className="text-xl font-bold">{candidate.name}</p>

          <span className="text-muted-foreground mt-2 mb-4 flex flex-col items-center gap-4 md:flex-row">
            <span className="mr-2 flex items-center gap-2">
              <Mail className="size-5" /> {candidate.email}
            </span>
            <span className="mr-2 flex items-center gap-2">
              <Phone className="size-5" /> {candidate.phone}
            </span>
            <span className="mr-2 flex items-center gap-2">
              <Briefcase className="size-5" /> Intern
            </span>
          </span>

          <Button className="w-full md:w-fit" variant="ghost" asChild>
            <Link to={`/candidates/${candidate._id}`}>
              <Eye /> View Details
            </Link>
          </Button>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Interviewers</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {interviewers.map((i) => (
          <div
            key={i._id}
            className="bg-card mt-2 flex items-center gap-4 rounded-xl border p-4"
          >
            <AccountAvatar avatarUrl={i.avatarUrl} />
            <span>
              <b>{i.name}</b>
              <p className="text-muted-foreground">{i.email}</p>
            </span>
          </div>
        ))}
      </div>

      {isPassed && (
        <>
          <div className="mt-8 flex w-full items-center gap-2">
            <h2 className="text-lg font-semibold">Remarks</h2>
            <Button variant="ghost" disabled={status !== "completed"}>
              <Plus /> Add
            </Button>
          </div>
          {/* <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card rounded-xl border p-4">
              <div className="mb-4 flex items-center gap-2">
                <AccountAvatar avatarUrl={interviewers[0].avatarUrl} />

                <div>
                  <b>{interviewers[0].name}</b>
                  <p className="text-muted-foreground">
                    {interviewers[0].email}
                  </p>
                </div>
              </div>

              <p>Some remarks</p>
            </div>
          </div> */}

          <p className="text-muted-foreground mt-4 text-center">
            No remarks yet. Mark event as completed to start adding remarks.
          </p>
        </>
      )}

      <DiscardChangesAlert
        open={rescheduleCancelOpen}
        onOpenChange={setRescheduleCancelOpen}
        onConfirm={() => {
          setIsRescheduling(false);
          form.reset();
        }}
      />
    </>
  );
};

export default EventDetails;
