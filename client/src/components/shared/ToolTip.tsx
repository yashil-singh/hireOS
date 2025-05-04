import {
  TooltipContentProps,
  TooltipProps,
  TooltipTriggerProps,
} from "@radix-ui/react-tooltip";
import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ToolTipProps = {
  tooltipProps?: TooltipProps;
  triggerProps?: TooltipTriggerProps;
  contentProps?: TooltipContentProps;
  children: React.ReactNode;
  label: React.ReactNode;
  show?: boolean;
};

const ToolTip = ({
  tooltipProps,
  triggerProps,
  contentProps,
  children,
  label,
  show = true,
}: ToolTipProps) => {
  return (
    <Tooltip {...tooltipProps}>
      <TooltipTrigger
        className={cn(!show && "pointer-events-none", triggerProps?.className)}
        asChild
        {...triggerProps}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent {...contentProps}>{label}</TooltipContent>
    </Tooltip>
  );
};

export default ToolTip;
