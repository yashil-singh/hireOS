import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginFormSchema } from "@/lib/schemas/authSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/slices/store";
import { setUser } from "@/lib/slices/session/sessionSlice";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: ({ message, data }) => {
      dispatch(setUser(data));
      toast.success(message);
    },
    onError: ({ message }) => toast.error(message),
  });

  const form = useForm<z.infer<typeof loginFormSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    await loginMutation.mutateAsync(values);
  };

  return (
    <>
      <Form {...form}>
        <div className="text-center">
          <h1 className="text-xl font-black">Login to your account.</h1>
          <p className="text-muted-foreground">Get back to hiring!</p>
        </div>

        <form
          className="w-full space-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full text-right">
            <Link
              to="forgort-password"
              className="text-primary ml-auto text-sm underline"
            >
              Forgot your password?{" "}
            </Link>
          </div>

          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Logging in" : "Login"}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary underline">
              Signup
            </Link>
            .
          </p>
        </form>
      </Form>
    </>
  );
};

export default Login;
