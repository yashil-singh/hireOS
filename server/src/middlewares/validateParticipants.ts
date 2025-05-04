import { isObjectId, throwError } from "@/lib/utils";
import Candidate from "@/models/Candidate";
import Interview from "@/models/Interview";
import Interviewer from "@/models/Interviewer";
import { NextFunction, Request, Response } from "express";
import { format } from "date-fns";

const validateParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    candidate: candidateId,
    interviewers,
    date,
    startTime,
    endTime,
  } = req.body;

  if (!isObjectId(candidateId)) return throwError("Invalid candidate ID");

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) return throwError("Candidate not found.", 404);

  const invalidIds = interviewers.filter((id: string) => !isObjectId(id));
  if (invalidIds.length) {
    return throwError(`Invalid interviewer IDs: ${invalidIds.join(", ")}`);
  }

  const existingInterviewers = await Interviewer.find({
    _id: { $in: interviewers },
  });
  if (existingInterviewers.length !== interviewers.length) {
    const foundIds = existingInterviewers.map((user) => user._id.toString());
    const missingIds = interviewers.filter(
      (id: string) => !foundIds.includes(id)
    );
    return throwError(`Interviewers not found: ${missingIds.join(", ")}`, 404);
  }

  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  const start = new Date(date);
  start.setHours(startDateTime.getHours(), startDateTime.getMinutes(), 0, 0);
  const end = new Date(date);
  end.setHours(endDateTime.getHours(), endDateTime.getMinutes(), 0, 0);

  const candidatePendingInterviews = await Interview.findOne({
    _id: { $ne: id },
    candidate: candidateId,
    status: { $nin: ["completed", "cancelled"] },
  });

  if (candidatePendingInterviews)
    return throwError("Candidate has a pending interview.");

  const candidateConflict = await Interview.findOne({
    candidate: candidateId,
    start: { $lt: end },
    end: { $gt: start },
  });

  if (candidateConflict) {
    const timeRange = `${format(candidateConflict.start, "hh:mm a")} - ${format(
      candidateConflict.end,
      "hh:mm a"
    )}`;
    return throwError(
      `Candidate is already scheduled for another interview during this time: ${timeRange}.`,
      409
    );
  }

  const interviewerConflicts = await Interview.find({
    interviewers: { $in: interviewers },
    start: { $lt: end },
    end: { $gt: start },
  }).populate("interviewers");

  if (interviewerConflicts.length > 0) {
    const busyInfo: Record<string, string[]> = {};

    interviewerConflicts.forEach((interview) => {
      const timeRange = `${format(interview.start, "hh:mm a")} - ${format(
        interview.end,
        "hh:mm a"
      )}`;

      interview.interviewers.forEach((interviewer: any) => {
        const idStr = interviewer._id.toString();
        if (interviewers.includes(idStr)) {
          if (!busyInfo[interviewer.name]) {
            busyInfo[interviewer.name] = [];
          }
          busyInfo[interviewer.name].push(timeRange);
        }
      });
    });

    const messageLines = Object.entries(busyInfo).map(
      ([name, times]) => `${name}: ${times.join(", ")}`
    );

    return throwError(
      `Some interviewers are not available during this time:-\n ${messageLines.join(
        "\n"
      )}`,
      409
    );
  }

  next();
};

export default validateParticipants;
