import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Bell, CalendarIcon, Clock, Info } from "lucide-react";
import { Button } from "../../ui/button";
import { Link, useSearchParams } from "react-router-dom";
import ScheduleInterviewForm from "../../forms/Calendar/ScheduleInterviewForm";
import DynamicDialog from "../../dialogs/DynamicDialog";
import { z } from "zod";
import { scheduleInterviewSchema } from "@/lib/schemas/interviewSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import DiscardChangesAlert from "@/components/dialogs/DiscardChangesAlert";
import { CalendarEvent } from "@/services/calendar/types";
import { useScheduleInterview } from "@/services/calendar/mutations";
import { useGetAllCalenderEvents } from "@/services/calendar/queries";
import CalendarSkeleton from "@/components/skeletons/CalendarSkeleton";
import { toast } from "sonner";
import NotFound from "../NotFound";
import AccountAvatar from "@/components/shared/AccountAvatar";

const Calendar = () => {
  const [searchParams] = useSearchParams();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  const [isScheduling, setIsScheduling] = useState(
    searchParams.get("schedule") === "true",
  );
  const [scheduleCancelOpen, setScheduleCancelOpen] = useState(false);

  const { data, isLoading, error } = useGetAllCalenderEvents();

  const filterEvents = useCallback(
    (date: Date) => {
      setSelectedDate(date);

      if (data) {
        const sameDayEvents = data.data.filter((event) => {
          const eventDate = new Date(event.start);
          return (
            eventDate.getFullYear() === date.getFullYear() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getDate() === date.getDate()
          );
        });

        setFilteredEvents(sameDayEvents);
      }
    },
    [data],
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const isBeforeToday = selected < today;

  const form = useForm<z.infer<typeof scheduleInterviewSchema>>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      startTime: undefined,
      endTime: undefined,
      candidate: searchParams.get("candidate") ?? "",
      interviewers: [],
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (form.formState.isDirty) {
        setScheduleCancelOpen(true);
        return;
      }
    }

    setIsScheduling(isOpen);
    if (isOpen) {
      form.reset({
        ...form.getValues(),
        date: selectedDate,
      });
    } else {
      form.reset();
    }
  };

  const scheduleMutation = useScheduleInterview();

  const onSubmit = async (values: z.infer<typeof scheduleInterviewSchema>) => {
    await scheduleMutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        setIsScheduling(false);
      },
    });
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
      filterEvents(selectedDate);
    }
  }, [data, selectedDate, filterEvents]);

  if (isLoading) return <CalendarSkeleton />;

  if (!data) return <NotFound label="events" />;

  return (
    <>
      <h1 className="page-heading">Interviews</h1>
      <p className="page-description">Schedule interviews and set reminders.</p>

      <div className="mt-4 grid w-full gap-4 xl:grid-cols-3">
        <Card className="no-scrollbar h-full overflow-y-auto xl:col-span-2">
          <CardContent>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={data?.data}
              eventContent={(eventInfo) => (
                <button
                  onClick={() => setSelectedDate(eventInfo.event.start!)}
                  className="flex w-full items-center gap-2 text-xs"
                >
                  <b>{eventInfo.timeText}</b>
                  <i className="line-clamp-1">{eventInfo.event.title}</i>
                </button>
              )}
              dateClick={(args) => setSelectedDate(args.date)}
              selectable={true}
              dayMaxEvents={true}
              eventClassNames="bg-primary! border-none! hover:bg-primary/80! transition-colors text-background dark:text-foreground"
              nowIndicatorClassNames="bg-primary!"
              dayCellClassNames="cursor-pointer"
              dayHeaderClassNames="text-xs sm:text-base"
            />
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {format(selectedDate, DEFAULT_DATE_FORMAT)}
              </CardTitle>

              {!isBeforeToday && (
                <DynamicDialog
                  title="Schedule Interview"
                  description="Select a date and time to schedule an interview with
                            the candidate. You can also choose an interviewer."
                  open={isScheduling}
                  onOpenChange={onOpenChange}
                  trigger={
                    <Button disabled={isBeforeToday}>
                      <CalendarIcon /> Schedule
                    </Button>
                  }
                >
                  <ScheduleInterviewForm form={form} onSubmit={onSubmit} />
                </DynamicDialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredEvents.length > 0 ? (
              <ul className="space-y-4">
                {filteredEvents.map((event) => {
                  const today = new Date();
                  const isPassed = new Date(event.end) < today;

                  return (
                    <li
                      key={event._id}
                      className="flex flex-col gap-2 md:gap-1"
                    >
                      <strong className="md:text-lg">{event.title}</strong>
                      <span className="text-muted-foreground flex items-center gap-2 text-sm">
                        <AccountAvatar
                          className="size-5"
                          avatarUrl={event.candidate.avatarUrl}
                        />
                        {event.candidate.name} - {event.candidate.email}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Clock className="size-5" />
                        {format(event.start!, "hh:mm a")} -{" "}
                        {format(event.end, "hh:mm a")}
                      </span>

                      <div className="flex flex-col items-center gap-2 md:ml-auto md:flex-row">
                        <Button
                          variant="ghost"
                          className="max-md:w-full"
                          disabled={isPassed}
                        >
                          <Bell /> Send Reminder
                        </Button>
                        <Button
                          variant="outline"
                          className="max-md:w-full"
                          asChild
                        >
                          <Link to={`/calendar/event/${event._id}`}>
                            <Info /> Details
                          </Link>
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No events for this date.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <DiscardChangesAlert
        open={scheduleCancelOpen}
        onOpenChange={setScheduleCancelOpen}
        onConfirm={() => {
          setIsScheduling(false);
          form.reset();
        }}
      />
    </>
  );
};

export default Calendar;
