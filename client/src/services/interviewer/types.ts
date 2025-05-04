export type Interviewer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
};

export type MutateInterviewerResponse = {
  message: string;
  data: Interviewer;
};

export type GetInterviewersResponse = {
  message: string;
  data: Interviewer[];
};
