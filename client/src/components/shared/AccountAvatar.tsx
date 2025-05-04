import { AvatarPlaceholder } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

const AccountAvatar = ({
  avatarUrl,
  className,
}: {
  avatarUrl?: string;
  className?: string;
}) => {
  return (
    <Avatar className={cn("size-12", className)}>
      <AvatarImage referrerPolicy="no-referrer" src={avatarUrl} />
      <AvatarFallback>
        <img src={AvatarPlaceholder} />
      </AvatarFallback>
    </Avatar>
  );
};

export default AccountAvatar;
