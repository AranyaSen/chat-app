import { AuthLayout } from "@/features/auth/components/authLayout";
import { RegisterForm } from "@/features/auth/components/registerForm";

export function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
