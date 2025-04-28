import AccountAvatar from "@/components/shared/AccountAvatar";
import CandidateTimeline from "@/components/shared/CandidateTimeline";
import InfoHeader from "@/components/shared/InfoHeader";
import ToTopButton from "@/components/shared/ToTopButton";
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
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
  TimelineHeader,
  TimelineEvent,
} from "@/components/ui/timeline";
import { Event } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building,
  Code,
  Download,
  EllipsisVertical,
  File,
  Mail,
  MapPin,
  Phone,
  ScanText,
  Star,
  Trophy,
} from "lucide-react";
import { useState } from "react";

const CandidateDetails = () => {
  const [view, setView] = useState<"info" | "timeline">("info");

  const events: Event[] = [
    {
      title: "First Interview",
      status: "completed", // completed or pending
      timestamp: "2024-03-01T09:00:00Z",
      events: [
        {
          description: "Initial invite sent",
          timestamp: "2024-03-01T09:00:00Z",
        },
        { description: "Reminder sent", timestamp: "2024-03-02T10:00:00Z" },
        {
          description: "Interview Completed",
          timestamp: "2024-03-02T10:00:00Z",
        },
      ],
    },
    {
      title: "Second Interview",
      status: "completed",
      timestamp: "2024-03-01T09:00:00Z",
      events: [
        {
          description: "Initial invite sent",
          timestamp: "2024-03-01T09:00:00Z",
        },
        { description: "Reminder sent", timestamp: "2024-03-02T10:00:00Z" },
        {
          description: "Interview Completed",
          timestamp: "2024-03-02T10:00:00Z",
        },
      ],
    },
    {
      title: "Third Interview",
      status: "completed",
      timestamp: "2024-03-01T09:00:00Z",
      events: [
        {
          description: "Initial invite sent",
          timestamp: "2024-03-01T09:00:00Z",
        },
        { description: "Reminder sent", timestamp: "2024-03-02T10:00:00Z" },
        {
          description: "Interview Completed",
          timestamp: "2024-03-02T10:00:00Z",
        },
      ],
    },
    {
      title: "Assessment",
      status: "completed",
      timestamp: "2024-03-01T09:00:00Z",
      events: [
        {
          description: "Initial invite sent",
          timestamp: "2024-03-01T09:00:00Z",
        },
        { description: "Reminder sent", timestamp: "2024-03-02T10:00:00Z" },
        {
          description: "Interview Completed",
          timestamp: "2024-03-02T10:00:00Z",
        },
      ],
    },
    {
      title: "Background Check",
      status: "completed",
      timestamp: "2024-03-01T09:00:00Z",
      events: [
        {
          description: "Initial invite sent",
          timestamp: "2024-03-01T09:00:00Z",
        },
        { description: "Reminder sent", timestamp: "2024-03-02T10:00:00Z" },
        {
          description: "Interview Completed",
          timestamp: "2024-03-02T10:00:00Z",
        },
      ],
    },
    // {
    //   title: "Offer Letter",
    //   status: "completed",
    //   timestamp: "2024-03-01T09:00:00Z",
    //   events: [
    //     {
    //       description: "Initial invite sent",
    //       timestamp: "2024-03-01T09:00:00Z",
    //     },
    //     { description: "Reminder sent", timestamp: "2024-03-02T10:00:00Z" },
    //     {
    //       description: "Interview Completed",
    //       timestamp: "2024-03-02T10:00:00Z",
    //     },
    //   ],
    // },
    // {
    //   title: "Hired",
    //   status: "completed",
    //   timestamp: "2024-03-01T09:00:00Z",
    //   events: [],
    // },
    // {
    //   title: "Rejected",
    //   status: "completed",
    //   timestamp: "2024-03-01T09:00:00Z",
    //   events: [],
    // },
  ];

  return (
    <>
      <h1 className="page-heading">Candidate Details</h1>

      <Card className="my-4">
        <CardHeader className="sr-only">
          <CardTitle>Candidate Details and History</CardTitle>
          <CardDescription>
            The details of the candidate and history of the candidate in the
            hiring process.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-12 pb-8">
          <div className="flex flex-col justify-center gap-4 md:flex-row md:items-center md:justify-start">
            <AccountAvatar avatarUrl="" className="size-28" />

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Peter Parker</h3>

              <div className="text-muted-foreground flex flex-col flex-wrap justify-center gap-4 text-sm sm:flex-row sm:justify-start md:gap-8">
                <div className="flex items-center gap-2">
                  <Mail />
                  peter@gmail.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone />
                  9863928492
                </div>
                <div className="flex items-center gap-2">
                  <MapPin />
                  Kathmandu
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase />
                  Trainee
                </div>
              </div>
            </div>
          </div>

          <CandidateTimeline events={events} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="gap-4 xl:col-span-2">
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
                  Posistion: <b className="text-foreground">Trainee</b>
                </p>
                <p>
                  Salary Expectation:{" "}
                  <b className="text-foreground">Rs. 30,000</b>
                </p>
                <p>
                  Referral:{" "}
                  <b className="text-foreground">reference@gmail.com</b>
                </p>
              </div>

              <div>
                <InfoHeader title="Technologies" Icon={Code} />

                <div className="mt-4 flex items-center gap-2">
                  <Badge className="px-3 text-sm">Tech</Badge>
                </div>
              </div>

              <div className="mb-0!">
                <InfoHeader title="Experiences" Icon={Trophy} />

                <Timeline className="mt-2">
                  <TimelineItem>
                    <TimelineHeader status="pending">
                      <TimelineTime>1 Oct 22 - 1 Dec 22</TimelineTime>
                      <TimelineTitle>Job Title</TimelineTitle>
                      <TimelineDescription className="mt-2 flex items-center gap-1">
                        <Building className="size-5" /> Company Name
                      </TimelineDescription>
                    </TimelineHeader>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineHeader status="pending">
                      <TimelineTime>1 Jan 23 - 1 Aug 23</TimelineTime>
                      <TimelineTitle>Job Title</TimelineTitle>
                      <TimelineDescription className="mt-2 flex items-center gap-1">
                        <Building className="size-5" /> Company Name
                      </TimelineDescription>
                    </TimelineHeader>
                  </TimelineItem>
                </Timeline>
              </div>

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
                <TimelineItem>
                  <TimelineHeader status="completed">
                    <TimelineTime>1 Oct 2022 • 4 days</TimelineTime>
                    <TimelineTitle>Invitation sent</TimelineTitle>
                    <TimelineDescription>
                      Invitation for an interview sent to candidate.
                    </TimelineDescription>
                  </TimelineHeader>
                  <TimelineEvent status="success">
                    <div className="text-sm font-medium">
                      Sent reminder to candidate
                    </div>
                    <TimelineDescription>
                      7 Oct 2022 • 1 day
                    </TimelineDescription>
                  </TimelineEvent>
                  <TimelineEvent status="success">
                    <div className="text-sm font-medium">
                      Sent reminder to candidate
                    </div>
                    <TimelineDescription>
                      13 Oct 2022 • 5 days
                    </TimelineDescription>
                  </TimelineEvent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineHeader status="terminated">
                    <TimelineTime>14 Oct 2022 • 1 day</TimelineTime>
                    <TimelineTitle>Rejected</TimelineTitle>
                    <TimelineDescription>
                      No response from the candidate.
                    </TimelineDescription>
                  </TimelineHeader>
                </TimelineItem>
              </Timeline>
            </CardContent>
          )}
        </Card>

        <Card className="h-fit gap-4">
          <CardHeader>
            <CardTitle className="text-xl">Evaluations</CardTitle>
            <CardDescription className="sr-only">
              The details of the candidate and history of the candidate in the
              hiring process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="relative gap-2 rounded-none border-0 border-b p-0 pb-4">
              <Button
                className="absolute top-0 right-0"
                variant="ghost"
                size="icon"
              >
                <EllipsisVertical />
              </Button>
              <CardHeader className="px-0">
                <CardTitle className="text-lg">Assessment Title</CardTitle>
                <CardDescription className="sr-only">
                  Details of the evaluations of the candidate's assessments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 px-0">
                <div>
                  <b className="text-3xl">4.0</b>

                  <span className="ml-2 inline-flex gap-1">
                    {[0, 1, 2, 3, 4].map((value) => (
                      <Star
                        className={cn(
                          "text-primary size-5",
                          value !== 4 && "fill-primary",
                        )}
                        key={`star-${value}`}
                      />
                    ))}
                  </span>
                </div>
                <p>Some remarks</p>
              </CardContent>
            </Card>

            <Card className="relative gap-2 border-0 p-0">
              <Button
                className="absolute top-0 right-0"
                variant="ghost"
                size="icon"
              >
                <EllipsisVertical />
              </Button>
              <CardHeader className="px-0">
                <CardTitle className="text-lg">Assessment Title</CardTitle>
                <CardDescription className="sr-only">
                  Details of the evaluations of the candidate's assessments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 px-0">
                <div>
                  <b className="text-3xl">4.0</b>

                  <span className="ml-2 inline-flex gap-1">
                    {[0, 1, 2, 3, 4].map((value) => (
                      <Star
                        className={cn(
                          "text-primary size-5",
                          value !== 4 && "fill-primary",
                        )}
                        key={`star-${value}`}
                      />
                    ))}
                  </span>
                </div>
                <p>Some remarks</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      <ToTopButton />
    </>
  );
};

export default CandidateDetails;
