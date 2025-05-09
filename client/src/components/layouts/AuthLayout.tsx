import { GoogleLogo, Logo, Profiling } from "@/lib/constants";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { googleLogin, googleOneTapLogin } from "@/services/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/slices/store";
import { setUser } from "@/lib/slices/session/sessionSlice";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const AuthLayout = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.session,
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const googleOneTapMutation = useMutation({
    mutationFn: googleOneTapLogin,
    onSuccess: ({ message, data }) => {
      dispatch(setUser(data));
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      googleOneTapMutation.mutateAsync({
        credential: credentialResponse.credential,
      });
    },
    onError: () => {
      toast.error("An unexpected error occured. Try again later.");
    },
    auto_select: false,
    disabled: !!user,
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return user ? (
    <Navigate to="/" />
  ) : (
    <div className="relative flex h-screen w-full justify-center p-4 md:gap-12 md:p-8 xl:gap-24">
      <div className="flex h-full flex-1 flex-col items-center">
        <div className="mb-12 flex flex-col items-end md:self-start">
          <img src={Logo} className="h-8 md:h-10" />
          <p className="font-bold">Hiring made easier</p>
        </div>

        <div className="flex h-full w-full items-center justify-center pb-12">
          <div className="flex w-full max-w-[500px] flex-col items-center gap-8 justify-self-center">
            <Outlet />

            <span className="text-muted-foreground">or</span>

            <div className="w-full space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={googleLogin}
              >
                Continue with Google
                <img src={GoogleLogo} alt="google logo" className="size-5" />
              </Button>
            </div>
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
