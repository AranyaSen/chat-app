import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { VerifyEmailView } from "@/features/auth/components/VerifyEmailView";

export function VerifyEmailPage() {
  return (
    <AuthLayout>
      <VerifyEmailView />
    </AuthLayout>
  );
}
