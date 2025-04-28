import { useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { VariantProps } from "class-variance-authority";

type BackButtonProps = {
  iconSize?: number;
  className?: string;
  variant?: string;
};

const BackButton = ({
  iconSize,
  variant,
  size,
  ...props
}: VariantProps<typeof buttonVariants> & BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button
      variant={variant ?? "ghost"}
      size={size ?? "icon"}
      {...props}
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={iconSize} />
    </Button>
  );
};

export default BackButton;
