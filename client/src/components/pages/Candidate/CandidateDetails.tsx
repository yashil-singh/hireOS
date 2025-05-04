import AccountAvatar from "@/components/shared/AccountAvatar";
import BackButton from "@/components/shared/BackButton";
import CandidateTimeline from "@/components/shared/CandidateTimeline";
import InfoHeader from "@/components/shared/InfoHeader";
import ToTopButton from "@/components/shared/ToTopButton";
import CandidateDetailsSkeleton from "@/components/skeletons/CandidateDetailsSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
  TimelineHeader,
  TimelineEvent,
} from "@/components/ui/timeline";
import { RootState } from "@/lib/slices/store";
import { cn, formatTimelineDate } from "@/lib/utils";
import { useGetCandidateById } from "@/services/candidates/queries";
import {
  Briefcase,
  Building,
  Calendar,
  Code,
  Download,
  EllipsisVertical,
  File,
  Info,
  LinkIcon,
  Loader2,
  Mail,
  Phone,
  ScanText,
  Star,
  Text,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFound from "../NotFound";
import { useGetEventsByCandidateId } from "@/services/events/queries";
import { useChangeCandidateStatus } from "@/services/candidates/mutations";
import { format, formatDistanceToNow } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "@/lib/constants";
import { toast } from "sonner";
import { useGetCalendarEventsByCandidateId } from "@/services/calendar/queries";
import { Skeleton } from "@/components/ui/skeleton";
import CandidateInterviewCard from "@/components/shared/CandidateInterviewCard";

const CandidateDetails = () => {
  const navigate = useNavigate();

  const steps = useSelector((state: RootState) => state.hiringProcess.steps);
  const { id } = useParams();

  const [view, setView] = useState<"info" | "timeline">("info");
  const [selectedStepId, setSelectedStepId] = useState<string | undefined>();

  // Queries
  const { data, isPending, error } = useGetCandidateById(id!);
  const {
    data: eventsData,
    isLoading: isEventsLoading,
    error: eventsDataError,
  } = useGetEventsByCandidateId(id!);
  const {
    data: calendarEventsData,
    isLoading: calendarEventsLoading,
    error: calendarEventsError,
  } = useGetCalendarEventsByCandidateId(id!);

  // Mutations
  const changeCandidateStatusMutation = useChangeCandidateStatus();

  const usedStepIds = useMemo(() => {
    return eventsData?.data.map((event) => event.step?._id) ?? [];
  }, [eventsData]);

  const availableSteps = useMemo(() => {
    return steps.filter((step) => !usedStepIds.includes(step._id));
  }, [steps, usedStepIds]);

  const handleChangeStep = (value: string) => {
    setSelectedStepId(value);

    if (id) {
      changeCandidateStatusMutation.mutate(
        {
          candidateId: id,
          stepId: value,
        },
        {
          onError: ({ message }) => {
            toast.error(message);
            setSelectedStepId(eventsData!.data[0].step?._id);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (error) toast.error(error.message);
    if (eventsDataError) toast.error(eventsDataError.message);
    if (calendarEventsError) toast.error(calendarEventsError.message);
  }, [error, eventsDataError, calendarEventsError]);

  useEffect(() => {
    if (eventsData && eventsData.data?.length > 0) {
      setSelectedStepId(eventsData.data[0].step?._id);
    }
  }, [eventsData]);

  if (isPending || isEventsLoading) return <CandidateDetailsSkeleton />;

  if (!data) return <NotFound label="candidate" />;

  const { data: candidate } = data;

  return (
    <>
      <BackButton />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="page-heading mt-4">Candidate Details</h1>

        <div className="flex w-fit items-center gap-2">
          <p className="text-muted-foreground text-sm">Status</p>
          <Select
            value={selectedStepId}
            onValueChange={handleChangeStep}
            disabled={changeCandidateStatusMutation.isPending}
          >
            <SelectTrigger className="w-full max-w-[250px] capitalize">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {steps.map((step) => (
                <SelectItem
                  disabled={
                    !availableSteps.map((s) => s._id).includes(step._id)
                  }
                  value={step._id}
                  key={`status-${step._id}`}
                  className="capitalize"
                >
                  {step.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {changeCandidateStatusMutation.isPending && (
            <Loader2 className="animate-spin" />
          )}

          <Button>
            <Text /> Offer Letter
          </Button>
          <Button variant="destructive">
            <X /> Reject
          </Button>
        </div>
      </div>

      <Card className="my-4">
        <CardHeader className="sr-only">
          <CardTitle>Candidate Details and History</CardTitle>
          <CardDescription>
            The details of the candidate and history of the candidate in the
            hiring process.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-12 pb-8">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
            <AccountAvatar avatarUrl="" className="size-28" />

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">{candidate.name}</h3>

              <div className="text-muted-foreground flex flex-col flex-wrap items-center justify-center gap-4 text-sm md:flex-row md:justify-start md:gap-8">
                <div className="flex items-center gap-2">
                  <Mail />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone />
                  {candidate.phone}
                </div>
                <div className="flex items-center gap-2 capitalize">
                  <Briefcase />
                  {candidate.level}
                </div>
              </div>
            </div>
          </div>

          <CandidateTimeline events={eventsData?.data ?? []} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="h-fit gap-4 xl:col-span-2">
          <div className="px-6">
            <Button
              className={cn(
                "text-base",
                view === "info"
                  ? "underline underline-offset-4"
                  : "text-foreground",
              )}
              variant="ghost"
              onClick={() => setView("info")}
            >
              Information
            </Button>
            <Button
              className={cn(
                "text-base",
                view === "timeline"
                  ? "underline underline-offset-4"
                  : "text-foreground",
              )}
              variant="ghost"
              onClick={() => setView("timeline")}
            >
              Timeline
            </Button>
          </div>

          <CardHeader className="sr-only">
            <CardTitle>
              {view === "info" ? "Information" : "Timeline"}
            </CardTitle>
            <CardDescription>
              {view === "info"
                ? "View information of the candidate."
                : "View the timeline of the candidate in the hiring process."}
            </CardDescription>
          </CardHeader>

          {view === "info" ? (
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <InfoHeader title="Job Details" Icon={Briefcase} />

                <p>
                  Posistion: <b className="capitalize">{candidate.level}</b>
                </p>
                <p>
                  Salary Expectation:{" "}
                  <b>
                    Rs. {Number(candidate.salaryExpectation).toLocaleString()}
                  </b>
                </p>
                <p>
                  Referral: <b>{candidate.reference}</b>
                </p>
              </div>

              <div>
                <InfoHeader title="Technologies" Icon={Code} />

                <div className="mt-4 flex items-center gap-2">
                  {candidate.technology.map((tech) => (
                    <Badge className="px-3 text-sm capitalize" key={tech}>
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              {candidate.experience.length > 0 && (
                <div className="mb-0!">
                  <InfoHeader title="Experiences" Icon={Trophy} />
                  <Timeline className="mt-2">
                    {candidate.experience.map((exp) => (
                      <TimelineItem key={exp.jobTitle + "-" + exp.company}>
                        <TimelineHeader status="pending">
                          <TimelineTime>
                            {formatTimelineDate(exp.startDate)} -{" "}
                            {formatTimelineDate(exp.endDate)}
                          </TimelineTime>
                          <TimelineTitle>{exp.jobTitle}</TimelineTitle>
                          <TimelineDescription className="mt-2 flex items-center gap-1">
                            <Building className="size-5" /> {exp.company}
                          </TimelineDescription>
                        </TimelineHeader>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </div>
              )}

              <div>
                <InfoHeader title="Resume" Icon={ScanText} />

                <div className="bg-accent text-accent-foreground mt-4 flex w-full items-center justify-between rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <File className="size-10" />

                    <span>
                      <b>Resume.pdf</b>
                      <p className="text-muted-foreground text-sm">300 kb</p>
                    </span>
                  </div>

                  <Button className="p-5" variant="ghost" size="icon">
                    <Download className="size-6" />
                  </Button>
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <Timeline className="mt-4">
                {eventsData?.data.map((event) => (
                  <TimelineItem key={event._id}>
                    <TimelineHeader
                      status={
                        event.title.toLowerCase() === "rejectd"
                          ? "terminated"
                          : event.status === "completed"
                            ? "completed"
                            : "pending"
                      }
                    >
                      <TimelineTime>
                        {format(new Date(event.createdAt), DEFAULT_DATE_FORMAT)}{" "}
                        •{" "}
                        {formatDistanceToNow(new Date(event.createdAt), {
                          addSuffix: true,
                        })}
                      </TimelineTime>
                      <TimelineTitle className="capitalize">
                        {event.title}
                      </TimelineTitle>
                      <TimelineDescription>
                        {event.description}
                      </TimelineDescription>
                    </TimelineHeader>
                    {[...event.activities].reverse().map((activity) => (
                      <TimelineEvent status="success" key={activity._id}>
                        <div className="text-sm font-medium">
                          {activity.title} - {activity.description}
                        </div>
                        <TimelineDescription>
                          {format(
                            new Date(activity.createdAt),
                            DEFAULT_DATE_FORMAT,
                          )}{" "}
                          • {formatDistanceToNow(new Date(activity.createdAt))}
                        </TimelineDescription>
                      </TimelineEvent>
                    ))}
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          )}
        </Card>

        <div className="space-y-4">
          {/* Interviews */}
          {calendarEventsLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <Card className="h-fit gap-4">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-xl">Interviews</CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      navigate(
                        `/calendar?schedule=true&candidate=${candidate._id}`,
                      )
                    }
                    disabled={
                      candidate.status === "hired" ||
                      candidate.status === "rejected" ||
                      candidate.status === "blacklisted"
                    }
                  >
                    <Calendar /> Schedule
                  </Button>
                </div>
                <CardDescription className="sr-only">
                  The history of the candidate interviews.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {calendarEventsData && calendarEventsData?.data.length < 1 ? (
                  <p className="text-muted-foreground text-center">
                    No interviews scheduled yet.
                  </p>
                ) : (
                  calendarEventsData?.data.map((event) => (
                    <CandidateInterviewCard
                      key={event._id + event.start + event.end}
                      event={event}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Assessment Evaluations */}
          <Card className="h-fit gap-4">
            <CardHeader>
              <CardTitle className="text-xl">Evaluations</CardTitle>
              <CardDescription className="sr-only">
                The details of the candidate and history of the candidate in the
                hiring process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-md p-2">
                      {/* <File className="size-7" /> */}
                      <LinkIcon className="size-7" />
                    </span>
                    <span>
                      <b className="text-lg">Assessment Title</b>
                      <p className="text-muted-foreground flex items-center gap-1">
                        Assigned on {format(new Date(), DEFAULT_DATE_FORMAT)}
                      </p>
                    </span>
                  </div>

                  <Button variant="ghost" size="icon">
                    <EllipsisVertical />
                  </Button>
                </div>

                <div className="mt-2 mb-4 space-y-2">
                  <p>Some remarks</p>
                  <b className="text-3xl">4.0</b>
                  <div className="ml-2 inline-flex gap-1">
                    {[0, 1, 2, 3, 4].map((value) => (
                      <Star
                        className={cn(
                          "text-primary size-5",
                          value !== 4 && "fill-primary",
                        )}
                        key={`star-${value}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex w-full items-end">
                  <Button className="ml-auto w-full md:w-fit" asChild>
                    <Link to={`/assessments/asdasd`}>
                      <Info /> Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ToTopButton />
    </>
  );
};

export default CandidateDetails;
