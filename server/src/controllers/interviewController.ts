import { isObjectId, successResponse, throwError } from "@/lib/utils";
import Event from "@/models/Event";
import Interview from "@/models/Interview";
import { Request, Response } from "express";
import { getCandidateProgressStatus } from "./eventsController";
import { format } from "date-fns";
import HiringProcess from "@/models/HiringProcess";
import Candidate from "@/models/Candidate";
import { DEFAULT_TIME_FORMAT } from "@/lib/constants";

export const getAllInterviews = async (req: Request, res: Response) => {
  const { search } = req.query;
  const query: any = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { "candidate.name": { $regex: search, $options: "i" } },
    ];
  }

  const interviews = await Interview.find(query)
    .populate("interviewers")
    .populate("candidate")
    .populate("event")
    .populate({
      path: "event",
      populate: {
        path: "step",
      },
    })
    .sort({ start: -1 });
  successResponse({ res, data: interviews });
};

export const getInterviewById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError("Invalid event ID.");

  const event = await Interview.findById(id)
    .populate("interviewers")
    .populate("event")
    .populate("candidate");
  if (!event) return throwError("Event not found.");

  successResponse({ res, data: event });
};

export const getInterviewsByCandidateId = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError("Invalid candidate ID.");

  const candidate = await Candidate.findById(id);
  if (!candidate) return throwError("Candidate not found.", 404);

  const interviews = await Interview.find({ candidate: candidate._id })
    .populate("candidate")
    .populate("event")
    .sort({
      createdAt: -1,
    });

  successResponse({ res, data: interviews });
};

export const scheduleInterview = async (req: Request, res: Response) => {
  const {
    title,
    date,
    startTime,
    endTime,
    candidate: candidateId,
    interviewers,
  } = req.body;

  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  const start = new Date(date);
  start.setHours(startDateTime.getHours(), startDateTime.getMinutes(), 0, 0);
  const end = new Date(date);
  end.setHours(endDateTime.getHours(), endDateTime.getMinutes(), 0, 0);

  const {
    currentStep,
    nextStep,
    currEventHasActivities,
    isCurrentEventCompleted,
    currentEvent,
  } = await getCandidateProgressStatus(candidateId);

  if (!currentEvent) return throwError("Event not found.");

  let event = null;

  if (isCurrentEventCompleted) {
    if (!nextStep) return throwError("Candidate has finished hiring process.");

    if (!nextStep.title.includes("interview"))
      return throwError("Candidate has passed interview stage.");

    event = await Event.create({
      title,
      candidate: candidateId,
      step: nextStep._id,
      activities: [
        {
          title,
          description: `Scheduled \`${nextStep.title}\` for the candidate.`,
        },
      ],
    });
  } else {
    if (currEventHasActivities)
      return throwError("Candidate has pending interviews. Please reshedule.");

    event = await Event.findByIdAndUpdate(
      currentEvent._id,
      {
        $push: {
          activities: {
            title,
            description: `Scheduled \`${
              currentStep?.title || "interview"
            }\` for the candidate.`,
          },
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (!event) return throwError("Failed to update event.");
  }

  const interview = await Interview.create({
    title,
    candidate: candidateId,
    interviewers,
    start,
    end,
    event: event._id,
  });

  const formatedDate = start.toLocaleDateString();
  const formatedStartDate = start.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formatedEndDate = end.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  successResponse({
    res,
    message: `Interview scheduled at ${format(
      new Date(start),
      "do MMMM"
    )}, ${format(new Date(start), DEFAULT_TIME_FORMAT)}-${format(
      new Date(start),
      DEFAULT_TIME_FORMAT
    )}`,
    data: interview,
  });
};

export const rescheduleInterview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, startTime, endTime } = req.body;

  if (!isObjectId(id)) return throwError("Invalid interview ID.");

  const selectedInterview = await Interview.findById(id);
  if (!selectedInterview) return throwError("Interview not found.", 404);

  const candidateId = selectedInterview.candidate.toString();

  const { currentStep, isCurrentEventCompleted } =
    await getCandidateProgressStatus(candidateId);

  if (
    isCurrentEventCompleted ||
    selectedInterview.status === "completed" ||
    selectedInterview.status === "cancelled"
  )
    return throwError("Interview has already completed or cancelled.");

  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  const start = new Date(date);
  start.setHours(startDateTime.getHours(), startDateTime.getMinutes(), 0, 0);
  const end = new Date(date);
  end.setHours(endDateTime.getHours(), endDateTime.getMinutes(), 0, 0);

  const eventUpdateResult = await Event.updateOne(
    { candidate: candidateId, step: currentStep!._id },
    {
      $push: {
        activities: {
          title: selectedInterview.title,
          description: `Re-scheduled \`${
            currentStep!.title
          }\` for the candidate.`,
        },
      },
    }
  );

  if (eventUpdateResult.modifiedCount === 0)
    return throwError("Event not found.");

  const updatedInterview = await Interview.findByIdAndUpdate(
    id,
    { start, end, status: "rescheduled" },
    { new: true }
  );

  successResponse({
    res,
    data: updatedInterview,
    message: "Interview Resheduled.",
  });
};

export const sendReminder = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError("Invalid interview ID.");

  const interview = await Interview.findById(id);
  if (!interview) return throwError("Interview not found.", 404);

  if (interview.status === "completed" || interview.status === "cancelled")
    return throwError(
      "Cannot send reminder for an interview that is already completed or cancelled."
    );

  const eventId = interview.event;
  const event = await Event.findById(eventId);
  if (!event) return throwError("Event not found.", 404);

  const activities = [...event.activities].reverse();

  if (activities.length === 0)
    return throwError("Interview not yet scheduled.");

  const latestActivity = activities[0];
  const isRescheduled = latestActivity.description
    ?.toLowerCase()
    .includes("re-scheduled");

  if (!isRescheduled) {
    const isReminderSent =
      latestActivity.title.toLowerCase() === "reminder sent";

    if (isReminderSent) {
      const now = new Date();
      const lastSent = new Date(latestActivity.createdAt);
      const hoursDiff = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        return throwError(
          "A reminder was already sent within the last 24 hours."
        );
      }
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    {
      $push: {
        activities: {
          title: "Reminder sent",
          description: `Reminder email sent for interview on ${format(
            new Date(interview.end),
            "do MMMM yyyy"
          )}.`,
        },
      },
    },
    { new: true }
  ).populate("candidate");

  // TODO: Send email

  successResponse({ res, message: "Reminder sent.", data: updatedEvent });
};

export const markInterviewAsCompleted = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError("Interview ID is required.");

  const interview = await Interview.findById(id).populate("candidate");
  if (!interview) return throwError("Interview not found.", 404);

  if (interview.status === "completed")
    return throwError("Interview is already completed.");
  if (interview.status === "cancelled")
    return throwError("Interview is cancelled.");

  if (new Date(interview.end) > new Date())
    return throwError(
      "Cannot mark interview as completed before the scheduled time."
    );

  interview.status = "completed";

  const updatedInterview = await interview.save();

  const event = await Event.findById(updatedInterview.event);
  if (!event) return throwError("Event not found", 404);

  const step = await HiringProcess.findById(event.step);
  if (!step) return throwError("Step not found", 404);

  await Event.findByIdAndUpdate(updatedInterview.event, {
    status: "completed",
    $push: {
      activities: {
        title: "Interview Completed",
        description: `\`${step.title}\` step completed for the candidate.`,
      },
    },
  });

  successResponse({
    res,
    message: "Interview marked as completed.",
    data: updatedInterview,
  });
};
