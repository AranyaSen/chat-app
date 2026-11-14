import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  MailCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { Spinner } from "@/components/ui/spinner";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/cn";

const steps = [
  "Open the verification email we sent.",
  "Click the verification link inside.",
  "Return here and sign in to your account.",
];

export function VerifyEmailView() {
  const [token] = useQueryState("token");
  const [queryUsername] = useQueryState("username");
  const pending = useAuthStore((state) => state.pendingVerification);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearPendingVerification = useAuthStore(
    (state) => state.clearPendingVerification,
  );

  const {
    data,
    isPending,
    isError,
    mutate: verifyEmail,
  } = useMutation({
    mutationFn: authApi.verifyEmail,
    retry: false,
  });
  const startedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token || startedTokenRef.current === token) return;

    startedTokenRef.current = token;
    verifyEmail(token);
  }, [token, verifyEmail]);

  useEffect(() => {
    if (!data) return;

    clearPendingVerification();

    if (user && !user.is_verified) {
      updateUser({ is_verified: true });
    }
  }, [data, clearPendingVerification, updateUser, user]);

  const username = queryUsername ?? pending?.username;
  const email = pending?.email;

  if (token) {
    return (
      <div className="mx-auto w-full max-w-[23rem] animate-rise">
        <div
          className={cn(
            "mb-6 flex size-14 items-center justify-center rounded-2xl border shadow-[0_16px_30px_-22px_rgba(43,34,81,0.5)]",
            isError
              ? "border-destructive/15 bg-destructive/[0.06] text-destructive"
              : "border-white/80 bg-white/65 text-secondary-foreground",
          )}
        >
          {isPending ? (
            <Spinner className="size-6" label="Verifying email" />
          ) : isError ? (
            <CircleAlert className="size-6" aria-hidden="true" />
          ) : (
            <MailCheck className="size-6" aria-hidden="true" />
          )}
        </div>

        {isPending ? (
          <>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.05em] text-foreground">
              Verifying your email
            </h1>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              Give us a moment while we confirm your link.
            </p>
          </>
        ) : isError ? (
          <>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.05em] text-foreground">
              That link didn't work
            </h1>

            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              Verification links are single-use. Sign in again from an
              unverified account to request a fresh one.
            </p>
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-6 w-full",
              )}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </>
        ) : data ? (
          <>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-success-foreground/10 bg-success px-2.5 py-1 text-[11px] font-bold text-success-foreground">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Verified
            </span>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.05em] text-foreground">
              You're all set,
              <span className="font-serif text-[34px] font-normal italic text-secondary-foreground">
                {data.data.name.split(" ")[0]}.
              </span>
            </h1>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              Your email is confirmed. Sign in to continue.
            </p>
            <Link
              to={`/login?verified=1&username=${encodeURIComponent(data.data.username)}`}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-6 w-full",
              )}
            >
              Continue to sign in
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[23rem] animate-rise">
      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-white/80 bg-white/65 text-secondary-foreground shadow-[0_16px_30px_-22px_rgba(43,34,81,0.5)]">
        <MailCheck className="size-6" aria-hidden="true" />
      </div>

      <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-secondary-foreground/80">
        One last step
      </p>
      <h1 className="mt-2 text-[31px] font-extrabold leading-[1.05] tracking-[-0.05em] text-foreground">
        Check your
        <span className="font-serif text-[36px] font-normal italic text-secondary-foreground">
          inbox.
        </span>
      </h1>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
        We sent a verification link to
        {email ? (
          <span className="font-semibold text-foreground/80">{email}</span>
        ) : (
          "the email on your account"
        )}
        . Open it to activate your account.
      </p>

      {username ? (
        <div className="glass-surface mt-5 flex items-center gap-3 rounded-2xl px-3.5 py-3">
          <Avatar name={username} size="sm" />
          <div className="min-w-0">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-bold text-foreground">
              @{username}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Waiting for verification
            </p>
          </div>
        </div>
      ) : null}

      <ol className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary/75 text-[10px] font-extrabold text-secondary-foreground">
              {index + 1}
            </span>
            <span className="text-[12.5px] leading-relaxed text-muted-foreground">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <Link
        to="/login"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "mt-7 w-full",
        )}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to sign in
      </Link>

      <p className="mt-4 text-center text-[11.5px] leading-relaxed text-muted-foreground/75">
        Need a fresh link? Sign in again with your unverified account and we'll
        send another.
      </p>
    </div>
  );
}
