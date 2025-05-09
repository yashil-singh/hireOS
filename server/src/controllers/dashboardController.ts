import { successResponse } from "@/lib/utils";
import Candidate from "@/models/Candidate";
import Event from "@/models/Event";
import Interview from "@/models/Interview";
import { Request, Response } from "express";
import { startOfWeek, startOfYear, endOfWeek } from "date-fns";

export const getDashboardCounts = async () => {
  const totalCandidates = (await Candidate.find()).length;

  const interviewingCandidates = (
    await Candidate.find({ status: { $regex: "interview", $options: "i" } })
  ).length;
  const assessingCandidates = (
    await Candidate.find({ status: { $regex: "assessment", $options: "i" } })
  ).length;
  const offeringCandidates = (
    await Candidate.find({ status: { $regex: "offer", $options: "i" } })
  ).length;
  const hiredCandidates = (await Candidate.find({ status: "hired" })).length;
  const rejectedCandidates = (await Candidate.find({ status: "rejected" }))
    .length;

  return {
    totalCandidates,
    interviewingCandidates,
    assessingCandidates,
    offeringCandidates,
    hiredCandidates,
    rejectedCandidates,
  };
};

export const getRecentActivities = async () => {
  const recentActivities = await Event.aggregate([
    { $unwind: "$activities" },
    {
      $project: {
        _id: 0,
        activityId: "$activities._id",
        title: "$activities.title",
        description: "$activities.description",
        createdAt: "$activities.createdAt",
        candidate: "$candidate",
        eventTitle: "$title",
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "candidates",
        localField: "candidate",
        foreignField: "_id",
        as: "candidate",
      },
    },
    {
      $unwind: {
        path: "$candidate",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  return recentActivities;
};

export const getUpcomingInterviews = async () => {
  const interviews = await Interview.find({
    status: { $nin: ["completed", "cancelled"] },
    start: { $gte: new Date() },
  })
    .populate("candidate")
    .sort({ start: 1 })
    .limit(5);

  return interviews;
};

export const getRecentHires = async () => {
  const events = await Event.find({ title: "Hired" })
    .populate("candidate")
    .sort({ createdAt: -1 })
    .limit(5);
  return events;
};

export const getApplicationCounts = async () => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const yearStart = startOfYear(now);

  const weekly = await Candidate.aggregate([
    {
      $match: {
        createdAt: { $gte: weekStart, $lte: weekEnd },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const monthly = await Candidate.aggregate([
    {
      $match: {
        createdAt: { $gte: yearStart },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const yearly = await Candidate.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return {
    weekly,
    monthly,
    yearly,
  };
};

const getAverageStageDuration = async () => {
  const events = await Event.find().populate("step candidate");

  // Group events by candidate
  const eventsByCandidate: Record<string, typeof events> = {};

  for (const event of events) {
    const candidateId = event.candidate._id.toString();

    if (!eventsByCandidate[candidateId]) {
      eventsByCandidate[candidateId] = [];
    }

    eventsByCandidate[candidateId].push(event);
  }

  const stepDurations: Record<
    string,
    { totalDuration: number; count: number }
  > = {};

  for (const candidateId in eventsByCandidate) {
    const candidateEvents = eventsByCandidate[candidateId].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    for (let i = 0; i < candidateEvents.length - 1; i++) {
      const currentEvent = candidateEvents[i];
      const nextEvent = candidateEvents[i + 1];

      if (!currentEvent.step) continue;

      const stepName = currentEvent.step.title;
      const start = new Date(currentEvent.createdAt).getTime();
      const end = new Date(nextEvent.createdAt).getTime();
      const durationInDays = (end - start) / (1000 * 60 * 60 * 24);

      if (!stepDurations[stepName]) {
        stepDurations[stepName] = { totalDuration: 0, count: 0 };
      }

      stepDurations[stepName].totalDuration += durationInDays;
      stepDurations[stepName].count += 1;
    }
  }

  const averageDurations: Record<string, number> = {};
  for (const [step, data] of Object.entries(stepDurations)) {
    averageDurations[step] = data.totalDuration / data.count;
  }

  return averageDurations;
};

const getCandidatePiplineOverview = async () => {
  const stageStats = await Event.aggregate([
    {
      $group: {
        _id: { step: "$step", status: "$status" },
        uniqueCandidates: { $addToSet: "$candidate" },
      },
    },
    {
      $project: {
        step: "$_id.step",
        status: "$_id.status",
        count: { $size: "$uniqueCandidates" },
      },
    },
    {
      $group: {
        _id: "$step",
        counts: {
          $push: {
            status: "$status",
            count: "$count",
          },
        },
      },
    },
    {
      $lookup: {
        from: "hiringprocesses",
        localField: "_id",
        foreignField: "_id",
        as: "stepInfo",
      },
    },
    { $unwind: "$stepInfo" },
    { $sort: { "stepInfo.step": 1 } },
    {
      $project: {
        _id: 0,
        stepTitle: "$stepInfo.title",
        counts: {
          $arrayToObject: {
            $map: {
              input: "$counts",
              as: "c",
              in: ["$$c.status", "$$c.count"],
            },
          },
        },
      },
    },
  ]);

  return stageStats;
};

export const getDashboardData = async (req: Request, res: Response) => {
  const [
    counts,
    recentActivities,
    upcomingInterviews,
    recentHires,
    applicationCounts,
    averageStageDurations,
    stageCounts,
  ] = await Promise.all([
    getDashboardCounts(),
    getRecentActivities(),
    getUpcomingInterviews(),
    getRecentHires(),
    getApplicationCounts(),
    getAverageStageDuration(),
    getCandidatePiplineOverview(),
  ]);

  successResponse({
    res,
    data: {
      counts,
      recentActivities,
      recentHires,
      upcomingInterviews,
      applicationCounts,
      averageStageDurations,
      stageCounts,
    },
  });
};
