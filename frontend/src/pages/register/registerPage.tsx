import { AuthLayout } from "@/features/auth/components/authLayout";
import { RegisterForm } from "@/features/register/components/registerForm";

export function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
