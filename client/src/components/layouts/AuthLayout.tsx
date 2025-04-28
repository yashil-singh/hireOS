import { GoogleLogo, Logo, Profiling } from "@/lib/constants";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Github } from "lucide-react";
import { googleLogin } from "@/services/auth/api";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { POST } from "@/services/api";
import { toast } from "sonner";

const AuthLayout = () => {
  const navigate = useNavigate();

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const response = await POST("/auth/google/one-tap", {
          credential: credentialResponse.credential,
        });

        if (response.success) {
          toast.success(response.message);
          navigate("/");
        }
      } catch (error) {
        console.error(error);
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

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
            <Button variant="outline" className="w-full" onClick={googleLogin}>
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

      <div className="bg-primary relative hidden flex-1 items-center justify-center rounded-xl md:flex">
        <img src={Profiling} />
      </div>
    </div>
  );
};

export default AuthLayout;
