import { Assessment, Assignment } from "@/services/assessments/types";
import { Link } from "react-router-dom";
import AccountAvatar from "../shared/AccountAvatar";
import { Badge } from "../ui/badge";
import Rating from "../shared/Rating";
import { Button } from "../ui/button";
import { ExternalLink, Eye } from "lucide-react";

type EvaluatedCardProps = {
  assessment: Assessment;
  assignment: Assignment;
};

const EvaluatedCard = ({ assessment, assignment }: EvaluatedCardProps) => {
  const { _id, candidate, remarks, rating } = assignment;
  return (
    <div
      className="bg-card space-y-4 rounded-xl border p-4"
      key={`evaluated-${_id}-candidate-${candidate._id}`}
    >
      <Link
        to={`/candidates/${candidate._id}`}
        className="flex items-center gap-4"
      >
        <AccountAvatar avatarUrl={candidate.avatarUrl} />
        <div className="flex flex-col">
          <b>
            {candidate.name} • {candidate.level}
          </b>
          <span>{candidate.email}</span>
        </div>
      </Link>

      <div className="flex gap-2">
        {candidate.technology.map((tech) => (
          <Badge
            className="capitalize"
            key={`evaluated-${_id}-candidate-${candidate._id}-${tech}`}
          >
            {tech}
          </Badge>
        ))}
      </div>

      <p>{remarks}</p>

      <div className="flex items-center justify-between gap-4">
        <Rating
          value={rating!}
          onChange={() => {}}
          starSize={20}
          labelClassName="text-3xl"
          disabled
        />

        {assessment.format === "file" && (
          <Button>
            <Eye /> View File
          </Button>
        )}
        {assessment.format === "link" && (
          <Button>
            <ExternalLink /> Visit
          </Button>
        )}
      </div>
    </div>
  );
};

export default EvaluatedCard;
