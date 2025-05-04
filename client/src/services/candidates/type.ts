export type Experience = {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  duration: number;
};

export type Candidate = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  level: string;
  avatarUrl?: string;
  technology: string[];
  reference: string;
  experience: Experience[];
  salaryExpectation: string;
  status: string;
  resumeUrl: string;
};

export type CandidatePreview = Pick<
  Candidate,
  "_id" | "name" | "email" | "phone" | "avatarUrl"
>;

export type SingleCandidateResponse = {
  message: string;
  data: Candidate;
};

export type MultiCandidateResponse = {
  message: string;
  data: Candidate[];
};

export type ChangeCandidateStatusResponse = {
  message: string;
  data: {
    candidate: Candidate;
    type: "interview" | "assessment" | "letter";
  };
};
