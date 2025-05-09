import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Briefcase,
  EllipsisVerticalIcon,
  FileEdit,
  Info,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { candidateStatusColors } from "@/lib/constants";
import ToolTip from "../shared/ToolTip";
import { Link } from "react-router-dom";
import AccountAvatar from "../shared/AccountAvatar";
import { Candidate } from "@/services/candidates/type";
import { cn, normalizeCandidateStatus } from "@/lib/utils";
import { Badge } from "../ui/badge";

type CandidateCardProps = {
  candidate: Candidate;
};

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const { _id, name, email, phone, status, technology, level, avatarUrl } =
    candidate;

  const normalizedStatus = normalizeCandidateStatus(status);

  const statusClass =
    candidateStatusColors[
      normalizedStatus as keyof typeof candidateStatusColors
    ];

  return (
    <Card className="gap-2">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-4">
            <AccountAvatar className="size-10" avatarUrl={avatarUrl} />
            <div className="space-y-1">
              <span className="flex items-center gap-2">
                <b className="text-lg">{name}</b>
                <Badge className={cn("capitalize", statusClass)}>
                  {status}
                </Badge>
              </span>

              <p className="text-muted-foreground flex items-center gap-3">
                <Mail className="size-4" /> {email}
              </p>
              <p className="text-muted-foreground flex items-center gap-3">
                <Phone className="size-4" /> {phone}
              </p>
              <p className="text-muted-foreground flex items-center gap-3 capitalize">
                <Briefcase className="size-4" /> {level}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <ToolTip label="More">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
            </ToolTip>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to={`/candidates/edit/${_id}`}>
                    <FileEdit /> Edit
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-destructive hover:text-destructive!">
                  <Trash2 className="text-destructive" /> Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex items-center gap-2">
        {technology.map((tech) => (
          <Badge key={_id + tech} className="capitalize">
            {tech}
          </Badge>
        ))}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link to={`/candidates/${_id}`}>
            <Info />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
