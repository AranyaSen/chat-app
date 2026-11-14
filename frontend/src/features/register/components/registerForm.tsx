import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { createSerializer, parseAsString } from "nuqs";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { registerApi } from "@/features/register/api/register.api";
import {
  registerSchema,
  type RegisterValues,
} from "@/features/register/validation/registerSchema";

const serializeVerifyEmailParams = createSerializer({
  registered: parseAsString,
  username: parseAsString,
  email: parseAsString,
});

export function RegisterForm() {
  const navigate = useNavigate();
  const { mutate: registerAccount, isPending: isRegistering } = useMutation({
    mutationFn: registerApi.register,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = (values: RegisterValues) => {
    registerAccount(
      {
        name: values.name.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);

          navigate(
            `/verify-email${serializeVerifyEmailParams({
              registered: "1",
              username: values.username.trim(),
              email: values.email.trim(),
            })}`,
          );
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
          Create account
        </p>
        <h1 className="text-[32px] font-extrabold leading-none tracking-[-0.05em] text-foreground">
          Create an account
        </h1>
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">
          Set up your account. We'll verify your email before you sign in.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <Field id="name" label="Full name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-message" : undefined}
            {...register("name")}
          />
        </Field>

        <Field
          id="username"
          label="Username"
          error={errors.username?.message}
          hint="3–30 characters."
        >
          <Input
            id="username"
            autoComplete="username"
            placeholder="user@123"
            aria-invalid={Boolean(errors.username)}
            aria-describedby="username-message"
            {...register("username")}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-message" : undefined}
            {...register("email")}
          />
        </Field>

        <Field
          id="password"
          label="Password"
          error={errors.password?.message}
          hint="At least 8 characters."
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Create a password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby="password-message"
            {...register("password")}
          />
        </Field>

        <Field
          id="confirmPassword"
          label="Confirm password"
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-message" : undefined
            }
            {...register("confirmPassword")}
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          disabled={!isValid || isRegistering}
        >
          Create account
          {isRegistering ? (
            <Spinner className="size-4" label="Creating account" />
          ) : (
            <ArrowRight className="size-4" aria-hidden="true" />
          )}
        </Button>
      </form>

      <p className="mt-7 text-center text-[13px] text-muted-foreground">
        Already have an account?
        <Link
          to="/login"
          className="font-bold text-secondary-foreground underline-offset-4 transition hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
