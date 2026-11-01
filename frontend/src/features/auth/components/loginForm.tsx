import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { InlineAlert } from "@/components/feedback/inlineAlert";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/features/auth/components/passwordInput";
import { useLoginMutation } from "@/features/auth/hooks/useAuthMutations";
import { useAuthStore } from "@/stores/authStore";
import { getApiError } from "@/features/auth/utils/authErrors";
import {
  loginSchema,
  type LoginValues,
} from "@/features/auth/validation/authSchema";
import { getFirstName } from "@/lib/format";

function getSafeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/app";
  }

  return value;
}

export function LoginForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutateAsync: login, isPending: isLoggingIn } = useLoginMutation();
  const setSession = useAuthStore((state) => state.setSession);
  const setPendingVerification = useAuthStore(
    (state) => state.setPendingVerification,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const registered = searchParams.get("registered") === "1";
  const verified = searchParams.get("verified") === "1";
  const registeredEmail = searchParams.get("email") ?? undefined;
  const nextPath = getSafeNextPath(searchParams.get("next"));

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: searchParams.get("username") ?? "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    try {
      const response = await login({
        username: values.username.trim(),
        password: values.password,
      });

      setSession(response.data);
      toast.success(`Welcome back, ${getFirstName(response.data.name)}`);
      navigate(nextPath, { replace: true });
    } catch (error) {
      const parsed = getApiError(error);

      if (parsed.status === 403 && /verif/i.test(parsed.message)) {
        setPendingVerification({
          username: values.username.trim(),
          email: registeredEmail,
        });
        toast.info("Check your inbox for the verification link");
        navigate(
          `/verify-email?username=${encodeURIComponent(values.username.trim())}`,
        );
        return;
      }

      for (const [field, message] of Object.entries(parsed.fieldErrors)) {
        if (field === "username" || field === "password") {
          setError(field, { message });
        }
      }

      setServerError(parsed.message);
    }
  });

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

      <div className="space-y-3">
        {verified ? (
          <InlineAlert tone="success" title="Email verified">
            Your account is ready. Sign in to continue.
          </InlineAlert>
        ) : registered ? (
          <InlineAlert tone="success" title="Account created">
            Sign in below. If your email isn't verified yet, we'll send a fresh
            link.
          </InlineAlert>
        ) : null}

        {serverError ? (
          <InlineAlert tone="error">{serverError}</InlineAlert>
        ) : null}
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate>
        <Field id="username" label="Username" error={errors.username?.message}>
          <Input
            id="username"
            autoComplete="username"
            placeholder="your handle"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={
              errors.username ? "username-message" : undefined
            }
            {...register("username")}
          />
        </Field>

        <Field id="password" label="Password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "password-message" : undefined
            }
            {...register("password")}
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Spinner className="size-4" label="Signing in" />
              Signing in
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-7 text-center text-[13px] text-muted-foreground">
        New here?{" "}
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
