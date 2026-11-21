import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { RegisterForm } from "@/features/register/components/RegisterForm";

export function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
