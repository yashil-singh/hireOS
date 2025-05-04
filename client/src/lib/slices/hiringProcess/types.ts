import { HiringProcessStep } from "@/services/hiringProcess/types";

export type HiringProcessStepsState = {
  loading: boolean;
  steps: HiringProcessStep[];
};
