import { AuthLayout } from "@/features/auth/components/authLayout";
import { LoginForm } from "@/features/auth/components/loginForm";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
