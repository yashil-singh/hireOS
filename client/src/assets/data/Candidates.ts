import { Candidate } from "@/lib/types";

const Candidates: Candidate[] = [
  {
    id: "12345",
    name: "Peter Parker",
    email: "peter@gmail.com",
    phone: "9874622461",
    level: "Intern",
    status: "Short-Listed",
    technology: ["ReactJS"],
    experience: [
      {
        jobTitle: "Frontend Developer",
        company: "LIS Nepal",
        startDate: "01/01/2025",
        endDate: "01/03/2025",
        duration: 21,
      },
    ],
    references: ["yashil@gmail.com"],
    resumeUrl: "",
    salaryExpectation: "10000",
  },
];

export default Candidates;
