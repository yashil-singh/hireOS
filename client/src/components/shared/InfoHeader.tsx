import { LucideIcon } from "lucide-react";

const InfoHeader = ({ Icon, title }: { Icon: LucideIcon; title: string }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-primary/10 text-primary rounded-md p-2">
        <Icon className="size-7" />
      </span>
      <span className="text-primary text-lg font-semibold">{title}</span>
    </div>
  );
};

export default InfoHeader;
