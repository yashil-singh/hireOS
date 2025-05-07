import {
  Activity,
  ArrowLeftRight,
  Briefcase,
  Calendar,
  ChevronDown,
  ClipboardPlus,
  Clock,
  FileText,
  FileUser,
  Footprints,
  Info,
  ListCheck,
  Plus,
  Speech,
  TrendingUpDown,
  WandSparkles,
  X,
} from "lucide-react";
import AccountAvatar from "../shared/AccountAvatar";
import DataCard from "../shared/DataCard";
import { Button } from "../ui/button";
import Barchart from "../charts/barchart";
import BarchartHorizontal from "../charts/barchart-horizontal";
import DashboardCard from "../shared/DashboardCard";
import RadialchartStacked from "../charts/radialchart-stacked";
import { Link } from "react-router-dom";
import BarchartHorizontalStacked from "../charts/barchart-horizontal-stacked";
import { useGetDashboardData } from "@/services/dashboard/queries";
import NotFound from "./NotFound";
import DashboardSkeleton from "../skeletons/DashboardSkeleton";
import { format } from "date-fns";
import { DEFAULT_TIME_FORMAT } from "@/lib/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

const Dashboard = () => {
  const isSideBarCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed,
  );

  const { data, isPending, error } = useGetDashboardData();

  const [applicationTrend, setApplicationTrend] = useState<
    "weekly" | "monthly" | "yearly"
  >("monthly");

  if (isPending) return <DashboardSkeleton />;

  if (!data || error) return <NotFound />;

  const {
    counts,
    recentActivities,
    recentHires,
    upcomingInterviews,
    applicationCounts,
    averageStageDurations,
    stageCounts,
  } = data.data;

  return (
    <div className="space-y-4">
      <h1 className="page-heading">Dashboard</h1>

      <div
        className={cn(
          "grid gap-4",
          isSideBarCollapsed ? "xl:grid-cols-3" : "2xl:grid-cols-3",
        )}
      >
        {/* Data Cards */}
        <div
          className={cn(
            "grid grid-cols-2 gap-4",
            isSideBarCollapsed ? "xl:col-span-2" : "2xl:col-span-2",
          )}
        >
          <DataCard
            label="Uploads"
            Icon={FileUser}
            value={counts.totalCandidates}
            link="/candidates"
          />
          <DataCard
            label="Interviewing"
            Icon={Speech}
            value={counts.interviewingCandidates}
            link="/candidates?status=interview"
          />
          <DataCard
            label="Assessment"
            Icon={ListCheck}
            value={counts.assessingCandidates}
            link="/candidates?status=assessment"
          />
          <DataCard
            label="Offered"
            Icon={FileText}
            value={counts.offeringCandidates}
            link="/candidates?status=offer"
          />
          <DataCard
            label="Hires"
            Icon={Briefcase}
            value={counts.hiredCandidates}
            link="/candidates?status=hired"
          />
          <DataCard
            label="Rejections"
            Icon={X}
            value={counts.rejectedCandidates}
            link="/candidates?status=rejected"
          />
        </div>

        {/* Upcomming Interviews */}
        <DashboardCard
          title="Upcomming Interviews"
          Icon={Speech}
          className="no-scrollbar max-h-[420px] space-y-4 overflow-y-auto"
          containerClassName="h-full"
        >
          {upcomingInterviews.length > 0 ? (
            upcomingInterviews?.map((interview) => {
              return (
                <div
                  key={`upcoming-interview-${interview._id}`}
                  className="flex items-center justify-between gap-4"
                >
                  <span>
                    <p className="text-lg font-bold">{interview.title}</p>

                    <div className="text-muted-foreground flex gap-2 text-sm">
                      <span className="flex items-center gap-2">
                        <Calendar className="size-4" />{" "}
                        {format(new Date(interview.start), "do MMM")}
                      </span>
                      •
                      <span className="flex items-center gap-2">
                        <Clock className="size-4" />
                        {format(
                          new Date(interview.start),
                          DEFAULT_TIME_FORMAT,
                        )}{" "}
                        - {format(new Date(interview.end), DEFAULT_TIME_FORMAT)}
                      </span>
                    </div>
                  </span>

                  <Button size="sm">
                    <Link to={`/calendar/event/${interview._id}`}>View</Link>
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="text-muted-foreground text-center">
              No interviews coming up.
            </p>
          )}
        </DashboardCard>
      </div>

      <div
        className={cn(
          "grid gap-4",
          isSideBarCollapsed ? "xl:grid-cols-4" : "2xl:grid-cols-4",
        )}
      >
        {/* ShortCuts */}
        <DashboardCard
          title="Shortcuts"
          Icon={WandSparkles}
          description="Quick access to common tasks like adding candidates,
                  scheduling interviews, or uploading resumes."
          className="flex h-full flex-col justify-evenly gap-4"
          showDescription
        >
          <Button variant="ghost" asChild>
            <Link to="/candidates/add">
              <Plus /> Add Candidate
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/calendar?schedule=true">
              <Calendar /> Schedule Interview
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/assessments?create=true">
              <ClipboardPlus /> Create Assignment
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/letters/send">
              <FileText /> Send Letter
            </Link>
          </Button>
        </DashboardCard>

        <div
          className={cn(
            "grid gap-4",
            isSideBarCollapsed
              ? "xl:col-span-3 xl:grid-cols-2"
              : "2xl:col-span-3 2xl:grid-cols-2",
          )}
        >
          {/* Recent Activities */}
          <DashboardCard
            title="Recent Activities"
            Icon={Activity}
            containerClassName="h-full max-h-[400px] pb-0"
            className="no-scrollbar space-y-4 overflow-y-auto"
          >
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={`recent-activity-${activity.activityId}`}
                  className="mb-4 flex items-center justify-between gap-4 rounded-xl"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <AccountAvatar
                      avatarUrl={activity.candidate.avatarUrl}
                      className="hidden sm:block"
                    />
                    <span>
                      <span className="font-bold">
                        {activity.candidate.name}
                      </span>
                      <p className="text-sm">
                        {activity.title} - {activity.description}
                      </p>
                    </span>
                  </div>

                  <span className="min-w-[60px] text-xs font-medium md:text-sm">
                    {format(new Date(activity.createdAt), "do MMM")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center">
                No recent activities.
              </p>
            )}
          </DashboardCard>

          {/* Recent Hires */}
          <DashboardCard
            title="Recent Hires"
            Icon={Briefcase}
            containerClassName="h-full max-h-[400px] pb-0"
            className="space-y-4 pb-4"
          >
            {recentHires.length > 0 ? (
              recentHires?.map((recentHire) => {
                const { candidate, createdAt } = recentHire;

                return (
                  <Link
                    to={`/candidates/${candidate._id}`}
                    className="hover:bg-accent flex items-center justify-between gap-4 rounded-xl p-2 transition-colors"
                    key={`recent-hire-${candidate._id}`}
                  >
                    <div className="flex items-center gap-4">
                      <AccountAvatar
                        avatarUrl={candidate.avatarUrl}
                        className="hidden sm:block"
                      />
                      <span>
                        <span className="text-sm font-bold">
                          {candidate.name}
                        </span>
                        <p className="text-sm">{candidate.email}</p>
                      </span>
                    </div>

                    <span className="text-xs font-medium md:text-sm">
                      {format(new Date(createdAt), "do MMMM")}
                    </span>
                  </Link>
                );
              })
            ) : (
              <p className="text-muted-foreground pb-4 text-center">
                No recent hires.
              </p>
            )}
          </DashboardCard>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Candidate Pipeline Overview */}
        <DashboardCard
          title="Candidate Pipeline Overview"
          Icon={Footprints}
          description="Track the status of candidates at each stage of the hiring process. View the number of candidates who have moved forward, are still pending, or have been rejected in each step, providing a quick overview of the recruitment pipeline."
          containerClassName="h-full"
          showDescription
        >
          <BarchartHorizontalStacked stageCounts={stageCounts} />
        </DashboardCard>

        {/* Application Trends */}
        <DashboardCard
          title="Applications Trend"
          description="View applications received across weekly, monthly, and yearly timeframes."
          Icon={TrendingUpDown}
          containerClassName="h-full"
          showDescription
        >
          <div className="flex">
            <Select
              defaultValue={applicationTrend}
              onValueChange={(value: "weekly" | "monthly" | "yearly") =>
                setApplicationTrend(value)
              }
            >
              <SelectTrigger asChild>
                <Button variant="outline" className="mb-4 ml-auto">
                  <SelectValue />
                  <ChevronDown />
                </Button>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Barchart
            weekly={applicationCounts.weekly}
            monthly={applicationCounts.monthly}
            yearly={applicationCounts.yearly}
            type={applicationTrend}
          />
        </DashboardCard>

        {/* Candidate Status Overview */}
        <DashboardCard
          title="Candidate Status Overview"
          Icon={Info}
          description="Displays the total number of candidates, broken down into accepted and rejected statuses."
          showDescription
        >
          <RadialchartStacked
            accepted={counts.hiredCandidates}
            rejected={counts.rejectedCandidates}
            pending={
              counts.totalCandidates -
              counts.hiredCandidates -
              counts.rejectedCandidates
            }
          />
        </DashboardCard>

        {/* Average Stage Durations */}
        <DashboardCard
          title="Average Stage Durations"
          description="The average number of days candidates spend in each hiring step, helping identify which stages of the recruitment process take the most time and where improvements can be made."
          showDescription
          Icon={ArrowLeftRight}
          className="space-y-4"
        >
          <BarchartHorizontal averageDurations={averageStageDurations} />
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
