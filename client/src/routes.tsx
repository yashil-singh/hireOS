import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layouts/RootLayout";
import Dashboard from "@/components/pages/Dashboard";
import Assessments from "./components/pages/Assessments";
import OfferLetters from "./components/pages/OfferLetters";
import Interviews from "./components/pages/Interviews";
import CandidateProfiles from "./components/pages/CanditateProfiles";
import NotFound from "./components/pages/NotFound";

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
        path: "/candidate-profiles",
        element: <CandidateProfiles />,
      },
      {
        path: "/assessments",
        element: <Assessments />,
      },
      {
        path: "/offer-letters",
        element: <OfferLetters />,
      },
      {
        path: "/interviews",
        element: <Interviews />,
      },
    ],
  },
  {},
]);

export default router;
