import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signupFormSceham } from "@/lib/schemas/authSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/services/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/slices/store";
import { setUser } from "@/lib/slices/session/sessionSlice";
import { toast } from "sonner";

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof signupFormSceham>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signupFormSceham),
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: ({ message, data }) => {
      dispatch(setUser(data));
      toast.success(message);
    },
    onError: ({ message }) => toast.error(message),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof signupFormSceham>) => {
    await signupMutation.mutateAsync(values);
  };

  return (
    <>
      <Form {...form}>
        <div className="text-center">
          <h1 className="text-xl font-black">Create a new account.</h1>
          <p className="text-muted-foreground">Start hiring like a pro!</p>
        </div>

        <form
          className="w-full space-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Signing up" : "Signup"}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
            .
          </p>
        </form>
      </Form>
    </>
  );
};

export default Signup;
