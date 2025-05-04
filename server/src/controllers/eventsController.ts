import { isObjectId, successResponse, throwError } from "@/lib/utils";
import Event from "@/models/Event";
import HiringProcess from "@/models/HiringProcess";
import { Request, Response } from "express";

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isObjectId(id)) return throwError("Invalid event ID.");

  const event = await Event.findById(id);
  if (!event) return throwError("Event not found.");

  successResponse({ res, data: event });
};

export const getEventsByCandidateId = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isObjectId(id)) return throwError("Invalid candidate ID");

  const events = await Event.find({ candidate: id })
    .populate("candidate")
    .populate("step")
    .sort({ createdAt: -1 });
  if (!events) return throwError("Candidate doesn't exist.", 404);

  successResponse({ res, data: events });
};

export const getRecentEvents = async (req: Request, res: Response) => {
  const { limit } = req.query;

  let query = Event.find().sort({ createdAt: -1 });

  if (limit) {
    const parsedLimit = Number(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return throwError("'limit' must be a positive number");
    }

    query = query.limit(parsedLimit);
  }

  const events = await query;

  successResponse({ res, data: events });
};

// export const getCandidateProgressStatus = async (id: string) => {
//   const [events, steps] = await Promise.all([
//     Event.find({ candidate: id }),
//     HiringProcess.find().sort({ step: 1 }),
//   ]);

//   const eventMap = new Map(
//     events.map((event) => [event.step.toString(), event])
//   );

//   let currentStep = null;
//   let currentEvent = null;
//   let currEventHasActivities = true;
//   let isCurrentEventCompleted = false;
//   let nextStep = null;

//   for (let i = 0; i < steps.length; i++) {
//     const step = steps[i];
//     const stepId = step._id.toString();
//     const event = eventMap.get(stepId);

//     if (event) {
//       currentStep = step;
//       currentEvent = event;
//       isCurrentEventCompleted = event.status === "completed";
//       currEventHasActivities =
//         Array.isArray(event.activities) && event.activities.length > 0;

//       if (!isCurrentEventCompleted) {
//         nextStep = steps[i + 1] || null;
//         break;
//       }
//     } else {
//       nextStep = step;
//       break;
//     }
//   }

//   return {
//     currentStep,
//     nextStep,
//     currentEvent,
//     currEventHasActivities,
//     isCurrentEventCompleted,
//   };
// };

export const getCandidateProgressStatus = async (id: string) => {
  const events = await Event.find({ candidate: id }).populate("step");

  const currentEvent = events.pop();

  if (events.length < 1 || !currentEvent)
    return throwError("No events found for this candidate.");

  const currEventHasActivities = currentEvent.activities.length > 0;
  const isCurrentEventCompleted = currentEvent.status === "completed";
  const currentStep = currentEvent.step;

  const nextStep = await HiringProcess.findOne({ step: currentStep.step + 1 });

  const nextRequiredStep = await HiringProcess.findOne({
    step: { $gt: currentStep.step },
    optional: false,
  }).sort({ step: 1 });

  return {
    currentStep,
    nextStep,
    currentEvent,
    currEventHasActivities,
    isCurrentEventCompleted,
    nextRequiredStep,
  };
};
