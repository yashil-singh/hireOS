export type HiringProcessStep = {
  _id: string;
  title: string;
  step: number;
  optional: boolean;
};

export type GetAllHiringProcessStepsResponse = {
  message: string;
  data: HiringProcessStep[];
};

export type GetHiringProcessStepByIdResponse = {
  message: string;
  data: HiringProcessStep;
};
