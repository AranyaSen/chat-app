import "@/lib/api.interceptors";
import { lazy, Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLoader } from "@/components/feedback/AppLoader";
import { GuestRoute } from "@/components/routing/GuestRoute";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { AppBootstrap } from "./AppBootstrap";

const ConversationsPage = lazy(() =>
  import("@/pages/conversations/ConversationsPage").then((module) => ({
    default: module.ConversationsPage,
  })),
);
const LoginPage = lazy(() =>
  import("@/pages/login/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/notFound/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);
const RegisterPage = lazy(() =>
  import("@/pages/register/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);
const VerifyEmailPage = lazy(() =>
  import("@/pages/verifyEmail/VerifyEmailPage").then((module) => ({
    default: module.VerifyEmailPage,
  })),
);

export function App() {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <AppBootstrap>
          <Suspense fallback={<AppLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route
                path="/conversations"
                element={
                  <ProtectedRoute>
                    <ConversationsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppBootstrap>
      </NuqsAdapter>
    </BrowserRouter>
  );
}
