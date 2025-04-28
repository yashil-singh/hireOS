import { Asssessments } from "@/assets/data/Assessments";
import Candidates from "@/assets/data/Candidates";
import AccountAvatar from "@/components/shared/AccountAvatar";
import BackButton from "@/components/shared/BackButton";
import EvaluateCard from "@/components/shared/EvaluateCard";
import Rating from "@/components/shared/Rating";
import ToTopButton from "@/components/shared/ToTopButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { useParams } from "react-router-dom";

const AssessmentDetails = () => {
  // const { id } = useParams();

  const assessment = Asssessments[0];
  const candidate = Candidates[0];

  return (
    <div className="relative space-y-4">
      <BackButton />

      <div>
        <h1 className="page-heading">Assessment Title</h1>
        <p className="text-muted-foreground">25th April, 2025</p>
      </div>

      <div className="space-x-2">
        <Badge className="text-sm font-bold">Tech</Badge>
        <Badge className="text-sm font-bold">Tech</Badge>
        <Badge className="text-sm font-bold">Tech</Badge>
      </div>
      <p className="page-description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris
      </p>

      <h2 className="mb-2! text-lg font-semibold">Assigned Candidates (4)</h2>

      <div className="flex flex-col gap-8 overflow-hidden md:flex-row">
        <div className="h-full w-full space-y-2">
          <h2 className="text-lg font-semibold">Remaining (2)</h2>

          <EvaluateCard assessment={assessment} candidate={candidate} />
        </div>

        <div className="hidden md:block">
          <Separator orientation="vertical" />
        </div>

        <div className="h-full w-full space-y-2">
          <h2 className="text-lg font-semibold">Evaluated (3)</h2>

          <div className="space-y-4">
            <div className="bg-card space-y-4 rounded-xl border p-4">
              <div className="flex items-center gap-4">
                <AccountAvatar avatarUrl="" />
                <div className="flex flex-col">
                  <b>Candidate Name • Position</b>
                  <span>candidate@gmail.com</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge>Tech</Badge>
                <Badge>Tech</Badge>
                <Badge>Tech</Badge>
              </div>

              <p>Some remarks</p>

              <div className="flex items-center justify-between gap-4">
                <Rating
                  value={4}
                  onChange={() => {}}
                  starSize={20}
                  labelClassName="text-3xl"
                  disabled
                />
                <Button>View File</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToTopButton />
    </div>
  );
};

export default AssessmentDetails;
