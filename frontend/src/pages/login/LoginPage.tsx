import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/login/components/LoginForm";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
