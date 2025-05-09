import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardCard = ({
  children,
  title,
  Icon,
  description,
  showDescription = false,
  className,
  containerClassName,
}: {
  title: string;
  Icon: LucideIcon;
  description?: string;
  showDescription?: boolean;
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <Card className={cn("gap-4", containerClassName)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="text-primary size-5" /> {title}
        </CardTitle>
        <CardDescription className={cn(!showDescription && "sr-only")}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className={className}>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
