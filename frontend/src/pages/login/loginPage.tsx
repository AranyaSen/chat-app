import { AuthLayout } from "@/features/auth/components/authLayout";
import { LoginForm } from "@/features/login/components/loginForm";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
