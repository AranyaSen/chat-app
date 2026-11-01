import { AuthLayout } from "@/features/auth/components/authLayout";
import { VerifyEmailView } from "@/features/auth/components/verifyEmailView";

export function VerifyEmailPage() {
  return (
    <AuthLayout>
      <VerifyEmailView />
    </AuthLayout>
  );
}
