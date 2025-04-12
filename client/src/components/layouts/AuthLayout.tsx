import {
  GoogleLogo,
  Logo,
  ProfilingPrimary,
  ProfilingSecondary,
} from "@/lib/constants";
import { RootState } from "@/lib/stores/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { Github } from "lucide-react";

const AuthLayout = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  const authImage = isDark ? ProfilingSecondary : ProfilingPrimary;

  return (
    <div className="relative flex h-screen w-full justify-center p-4 md:gap-12 md:p-8 xl:gap-24">
      <div className="absolute top-8 left-1/2 flex flex-col items-end max-md:-translate-x-1/2 md:left-8">
        <img src={Logo} className="h-8 md:h-10" />
        <p className="font-bold">Hiring made easier</p>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-[500px] flex-col items-center gap-8">
          <Outlet />

          <span className="text-muted-foreground">or</span>

          <div className="w-full space-y-4">
            <Button variant="outline" className="w-full">
              Continue with Google
              <img src={GoogleLogo} alt="google logo" className="size-5" />
            </Button>
            <Button variant="outline" className="w-full">
              Continue with Github
              <Github className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-secondary dark:bg-primary relative hidden flex-1 items-center justify-center rounded-xl md:flex">
        <img src={authImage} />
      </div>
    </div>
  );
};

export default AuthLayout;
