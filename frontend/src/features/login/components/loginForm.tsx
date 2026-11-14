import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { loginApi } from "@/features/login/api/login.api";
import {
  loginSchema,
  type LoginValues,
} from "@/features/login/validation/loginSchema";
import { useAuthStore } from "@/stores/authStore";
import { getFirstName } from "@/lib/format";

export function LoginForm() {
  const [usernameParam] = useQueryState("username");
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: loginApi.login,
  });
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: usernameParam ?? "",
      password: "",
    },
  });

  const handleFormSubmit = (values: LoginValues) => {
    login(
      {
        username: values.username.trim(),
        password: values.password,
      },
      {
        onSuccess: (response) => {
          setSession(response.data);
          const isUserVerified = response.data.is_verified;

          if (!isUserVerified) {
            navigate("/verify-email");
            return;
          }

          toast.success(`Welcome back, ${getFirstName(response.data.name)}`);
          navigate("/conversations", { replace: true });
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
          );
        },
      },
    );
  };

  return (
    <div className="mx-auto w-full max-w-[22rem] animate-rise">
      <div className="mb-7 space-y-2.5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-secondary-foreground/80">
          Welcome back
        </p>
        <h1 className="text-[32px] font-extrabold leading-none tracking-[-0.05em] text-foreground">
          Sign in
        </h1>
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">
          Enter your username and password to continue.
        </p>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <Field id="username" label="Username" error={errors.username?.message}>
          <Input
            id="username"
            autoComplete="username"
            placeholder="your handle"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "username-message" : undefined}
            {...register("username")}
          />
        </Field>

        <Field id="password" label="Password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-message" : undefined}
            {...register("password")}
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          disabled={isLoggingIn}
        >
          Sign in
          {isLoggingIn ? (
            <Spinner className="size-4" label="Signing in" />
          ) : (
            <ArrowRight className="size-4" aria-hidden="true" />
          )}
        </Button>
      </form>

      <p className="mt-7 text-center text-[13px] text-muted-foreground">
        New here?
        <Link
          to="/register"
          className="font-bold text-secondary-foreground underline-offset-4 transition hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
