import { Logo } from "@/lib/constants";

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <img src={Logo} className="h-14 animate-pulse" alt="logo" />
    </div>
  );
};

export default Loading;
