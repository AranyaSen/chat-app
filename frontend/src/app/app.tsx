import { lazy, Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLoader } from "@/components/feedback/appLoader";
import { GuestRoute } from "@/components/routing/guestRoute";
import { ProtectedRoute } from "@/components/routing/protectedRoute";
import { AppBootstrap } from "./AppBootstrap";

const ConversationsPage = lazy(() =>
  import("@/pages/conversations/conversationsPage").then((module) => ({
    default: module.ConversationsPage,
  })),
);
const LoginPage = lazy(() =>
  import("@/pages/login/loginPage").then((module) => ({
    default: module.LoginPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/notFound/notFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);
const RegisterPage = lazy(() =>
  import("@/pages/register/registerPage").then((module) => ({
    default: module.RegisterPage,
  })),
);
const VerifyEmailPage = lazy(() =>
  import("@/pages/verifyEmail/verifyEmailPage").then((module) => ({
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
