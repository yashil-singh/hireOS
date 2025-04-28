import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bell, Calendar, Clock, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useSearchParams } from "react-router-dom";
import ScheduleInterviewForm from "../forms/ScheduleInterviewForm";
import DynamicDialog from "../dialogs/DynamicDialog";
import { z } from "zod";
import { scheduleInterviewSchema } from "@/lib/schemas/interviewSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

const events: CalendarEvent[] = [
  {
    id: "event1",
    title: "Interview",
    start: new Date(),
    end: new Date(new Date().getTime() + 1 * 60 * 60 * 1000), // +1 hour
  },
  {
    id: "event2",
    title: "Interview",
    start: new Date(),
    end: new Date(new Date().getTime() + 1 * 60 * 60 * 1000), // +2 hours
  },
  {
    id: "event3",
    title: "Interview",
    start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // +1.5 hours
  },
  {
    id: "event4",
    title: "Interview",
    start: new Date(),
    end: new Date(new Date().getTime() + 75 * 60 * 1000), // +1.25 hours
  },
];

const Interviews = () => {
  const [searchParams] = useSearchParams();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  const [isScheduling, setIsScheduling] = useState(false);

  const filterEvents = (date: Date) => {
    setSelectedDate(date);

    const sameDayEvents = events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });

    setFilteredEvents(sameDayEvents);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const isBeforeToday = selected < today;

  const form = useForm<z.infer<typeof scheduleInterviewSchema>>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      title: "",
      date: selectedDate,
      startTime: undefined,
      endTime: undefined,
      candidate: "",
      interviewers: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof scheduleInterviewSchema>) => {
    console.log("🚀 ~ ScheduleInterviewForm.tsx:38 ~ values:", values);
  };

  useEffect(() => {
    filterEvents(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const shouldOpenDialog = searchParams.get("schedule") === "true";
    if (shouldOpenDialog) {
      setIsScheduling(true);
    }
  }, [searchParams]);

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
              initialEvents={events}
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
                  onOpenChange={setIsScheduling}
                  trigger={
                    <Button variant="ghost" disabled={isBeforeToday}>
                      <Calendar /> Schedule
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
                {filteredEvents.map((event) => (
                  <li key={event.id} className="flex flex-col gap-2 md:gap-1">
                    <strong className="md:text-lg">{event.title}</strong>
                    <span className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Clock className="size-5" />
                      {format(event.start!, "hh:mm a")} -{" "}
                      {format(event.end, "hh:mm a")}
                    </span>

                    <div className="flex flex-col items-center gap-2 md:ml-auto md:flex-row">
                      <Button variant="outline" className="max-md:w-full">
                        <Bell /> Send Reminder
                      </Button>
                      <Button
                        variant="outline"
                        className="max-md:w-full"
                        asChild
                      >
                        <Link to={`/interviews/${event.id}`}>
                          <Info /> Details
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events for this date.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Interviews;
