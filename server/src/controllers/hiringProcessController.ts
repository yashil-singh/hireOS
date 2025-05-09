import { successResponse } from "@/lib/utils";
import HiringProcess from "@/models/HiringProcess";
import { Request, Response } from "express";

export const getHiringProcess = async (req: Request, res: Response) => {
  const steps = await HiringProcess.find().sort({ step: 1 });
  successResponse({ res, data: steps });
};

export const seedHiringSteps = async () => {
  const count = await HiringProcess.countDocuments();
  if (count === 0) {
    await HiringProcess.insertMany([
      { title: "short-listed", step: 1 },
      { title: "first-interview", step: 2 },
      { title: "second-interview", step: 3 },
      { title: "third-interview", step: 4, optional: true },
      { title: "assessment", step: 5 },
      { title: "offer", step: 6 },
    ]);
    console.log("✅ Default hiring steps seeded.");
  } else {
    console.log("ℹ️ Hiring steps already exist. Skipping seed.");
  }
};
