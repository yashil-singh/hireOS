import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layouts/RootLayout";
import Dashboard from "@/components/pages/Dashboard";
import NotFound from "@/components/pages/NotFound";
import Settings from "@/components/pages/Settings/Settings";
import AuthLayout from "@/components/layouts/AuthLayout";
import Login from "@/components/pages/Auth/Login";
import Signup from "@/components/pages/Auth/Signup";
import Candidates from "@/components/pages/Candidate/Canditates";
import CandidateDetails from "./components/pages/Candidate/CandidateDetails";
import AddCandidate from "./components/pages/Candidate/AddCandidate";
import EditCandidate from "./components/pages/Candidate/EditCandidate";
import AssessmentDetails from "./components/pages/Assessment/AssessmentDetails";
import Assessments from "./components/pages/Assessment/Assessments";
import Letters from "@/components/pages/Letters/Letters";
import LetterDetails from "./components/pages/Letters/LetterDetails";
import SendLetter from "./components/pages/Letters/SendLetter";
import DraftDetails from "./components/pages/Letters/DraftDetails";
import Drafts from "./components/pages/Letters/Drafts";
import SettingsLayout from "./components/layouts/SettingsLayout";
import HiringProcess from "./components/pages/Settings/HiringProcess";
import Calendar from "./components/pages/Calendar/Calendar";
import Interviewers from "./components/pages/Calendar/Interviewers";
import CreateDraft from "./components/pages/Letters/CreateDraft";
import Interviews from "./components/pages/Calendar/Interviews";
import InterviewDetails from "./components/pages/Calendar/InterviewDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/candidates",
        children: [
          {
            index: true,
            element: <Candidates />,
          },
          {
            path: "add",
            element: <AddCandidate />,
          },
          {
            path: "edit/:id",
            element: <EditCandidate />,
          },
          {
            path: ":id",
            element: <CandidateDetails />,
          },
        ],
      },
      {
        path: "/assessments",
        children: [
          {
            index: true,
            element: <Assessments />,
          },
          {
            path: ":id",
            element: <AssessmentDetails />,
          },
        ],
      },
      {
        path: "/letters",
        children: [
          {
            index: true,
            element: <Letters />,
          },
          {
            path: "send",
            element: <SendLetter />,
          },
          {
            path: "drafts",
            element: <Drafts />,
          },
          {
            path: "drafts/create",
            element: <CreateDraft />,
          },
          {
            path: "drafts/:id",
            element: <DraftDetails />,
          },
          {
            path: ":id",
            element: <LetterDetails />,
          },
        ],
      },
      {
        path: "/calendar",

        children: [
          {
            index: true,
            element: <Calendar />,
          },
        ],
      },
      {
        path: "/interviews",
        children: [
          {
            index: true,
            element: <Interviews />,
          },
          {
            path: ":id",
            element: <InterviewDetails />,
          },
        ],
      },
      {
        path: "/interviewers",
        element: <Interviewers />,
      },
      {
        path: "/settings",
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <Settings />,
          },
          {
            path: "hiring-process",
            element: <HiringProcess />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
