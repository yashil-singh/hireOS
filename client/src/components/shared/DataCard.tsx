import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";

const DataCard = ({
  label,
  value,
  Icon,
  link,
}: {
  label: string;
  value: number;
  Icon: LucideIcon;
  link?: string;
}) => {
  return (
    <Link to={link ?? "/"}>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="text-primary size-5" /> {label}
          </CardTitle>
          <CardDescription className="sr-only"></CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-4xl font-bold">{value}</span>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DataCard;
