import {
  Activity,
  Briefcase,
  Calendar,
  CircleX,
  ClipboardPlus,
  Clock,
  FileText,
  FileUser,
  Footprints,
  Info,
  Plus,
  Speech,
  TrendingUpDown,
  WandSparkles,
} from "lucide-react";
import AccountAvatar from "../shared/AccountAvatar";
import DataCard from "../shared/DataCard";
import { Button } from "../ui/button";
import Barchart from "../charts/barchart";
import BarchartHorizontal from "../charts/barchart-horizontal";
import DashboardCard from "../shared/DashboardCard";
import RadialchartStacked from "../charts/radialchart-stacked";
import Donutchart from "../charts/donutchart";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <h1 className="page-heading">Dashboard</h1>

      <div className="grid gap-4 2xl:grid-cols-3">
        <div className="space-y-4 2xl:col-span-2">
          {/* Data Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <DataCard
              label="Uploaded CVs"
              Icon={FileUser}
              value={500}
              link="/candidates"
            />
            <DataCard
              label="Hires"
              Icon={Briefcase}
              value={100}
              link="/candidates?status=hired"
            />
            <DataCard
              label="Rejections"
              Icon={CircleX}
              value={400}
              link="/candidates?status=rejected"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
                <Link to="/interviews?schedule=true">
                  <Calendar /> Schedule Interview
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/assessments?create=true">
                  <ClipboardPlus /> Create Assignment
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/letters?generate=true">
                  <FileText /> Generate Offer Letter
                </Link>
              </Button>
            </DashboardCard>

            {/* Recent Activities */}
            <DashboardCard
              title="Recent Activities"
              Icon={Activity}
              containerClassName="h-full md:col-span-2 max-h-[360px]"
              className="no-scrollbar space-y-4 overflow-y-auto"
            >
              <div className="mb-4 flex items-center justify-between gap-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <AccountAvatar avatarUrl="" className="hidden sm:block" />
                  <span>
                    <span className="font-bold">Candidate Name</span>
                    <p className="text-sm">
                      Some activity relating to the candidate
                    </p>
                  </span>
                </div>

                <span className="text-xs font-medium md:text-sm">25th Apr</span>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Upcomming Interviews */}
        <DashboardCard
          title="Upcomming Interviews"
          Icon={Speech}
          className="no-scrollbar space-y-4 overflow-y-auto"
          containerClassName="h-full max-h-[508px]"
        >
          <div className="flex items-center justify-between gap-4">
            <span>
              <p className="text-lg font-bold">Interview Title</p>

              <div className="text-muted-foreground flex gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <Calendar className="size-4" /> 25th Apr
                </span>
                •
                <span className="flex items-center gap-2">
                  <Clock className="size-4" />
                  10:00 AM - 12:00 PM
                </span>
              </div>
            </span>

            <Button size="sm" asChild>
              <Link to={`/interviews/interview-1`}>View</Link>
            </Button>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 2xl:grid-cols-6">
        <DashboardCard
          title="Recent Hires"
          Icon={Briefcase}
          containerClassName="h-fit 2xl:col-span-2"
          className="space-y-4"
        >
          <Link
            to={`/candidates/candidate-1`}
            className="hover:bg-accent flex items-center justify-between gap-4 rounded-xl p-2 transition-colors"
          >
            <div className="flex items-center gap-4">
              <AccountAvatar avatarUrl="" className="hidden sm:block" />
              <span>
                <span className="text-sm font-bold">Candidate Name</span>
                <p className="text-sm">candidate@gmail.com</p>
              </span>
            </div>

            <span className="text-xs font-medium md:text-sm">25th Apr</span>
          </Link>
          <Link
            to={`/candidates/candidate-1`}
            className="hover:bg-accent flex items-center justify-between gap-4 rounded-xl p-2 transition-colors"
          >
            <div className="flex items-center gap-4">
              <AccountAvatar avatarUrl="" className="hidden sm:block" />
              <span>
                <span className="text-sm font-bold">Candidate Name</span>
                <p className="text-sm">candidate@gmail.com</p>
              </span>
            </div>

            <span className="text-xs font-medium md:text-sm">25th Apr</span>
          </Link>
          <Link
            to={`/candidates/candidate-1`}
            className="hover:bg-accent flex items-center justify-between gap-4 rounded-xl p-2 transition-colors"
          >
            <div className="flex items-center gap-4">
              <AccountAvatar avatarUrl="" className="hidden sm:block" />
              <span>
                <span className="text-sm font-bold">Candidate Name</span>
                <p className="text-sm">candidate@gmail.com</p>
              </span>
            </div>

            <span className="text-xs font-medium md:text-sm">25th Apr</span>
          </Link>
        </DashboardCard>

        <div className="grid gap-4 xl:grid-cols-2 2xl:col-span-4">
          <div className="flex flex-col gap-4">
            <DashboardCard
              title="Candidate Status Overview"
              Icon={Info}
              description="Displays the total number of candidates, broken down into accepted and rejected statuses."
              showDescription
            >
              <RadialchartStacked />
            </DashboardCard>

            <DashboardCard
              title="Letters Issued"
              Icon={FileText}
              description="Shows the number of letters issued on a weekly, monthly, yearly, and all-time basis, covering all types of letters issued."
              showDescription
            >
              <Donutchart />
            </DashboardCard>
          </div>

          <div className="flex flex-col gap-4">
            {/* Application Trends */}
            <DashboardCard
              title="Applications Trend"
              description="View applications received across weekly, monthly, and yearly timeframes."
              Icon={TrendingUpDown}
              containerClassName="h-full"
              showDescription
            >
              <Barchart />
            </DashboardCard>

            {/* Candidate Pipeline Overview */}
            <DashboardCard
              title="Candidate Pipeline Overview"
              Icon={Footprints}
              description="Shows how many candidates are in each stage of the hiring process."
              containerClassName="h-full"
              showDescription
            >
              <BarchartHorizontal />
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
