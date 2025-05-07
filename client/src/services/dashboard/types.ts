import { Event } from "@/lib/types";
import { CalendarEvent } from "../calendar/types";
import { Candidate } from "../candidates/type";

export type DashboardCounts = {
  totalCandidates: number;
  interviewingCandidates: number;
  assessingCandidates: number;
  offeringCandidates: number;
  hiredCandidates: number;
  rejectedCandidates: number;
};

export type Activity = {
  activityId: string;
  title: string;
  description: string;
  candidate: Candidate;
  eventTitle: string;
  createdAt: string;
};

export type ApplicationData = {
  _id: string;
  count: number;
};

export type DashboardDataResponse = {
  message: string;
  data: {
    counts: DashboardCounts;
    recentActivities: Activity[];
    upcomingInterviews: CalendarEvent[];
    recentHires: Event[];
    applicationCounts: {
      weekly: ApplicationData[];
      monthly: ApplicationData[];
      yearly: ApplicationData[];
    };
    averageStageDurations: {
      "short-listed": number;
      "first-interview": number;
      "second-interview": number;
      "third-interview": number;
      assessment: number;
      offer: number;
      Rejected: number;
      Hired: number;
    };
    stageCounts: {
      stepTitle: string;
      counts: {
        pending: number;
        completed: number;
        cancelled: number;
      };
    }[];
  };
};
