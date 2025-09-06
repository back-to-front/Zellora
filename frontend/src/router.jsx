import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionDetail";
import EditQuestion from "./pages/EditQuestion";
import EditAnswer from "./pages/EditAnswer";
import Profile from "./pages/Profile";
import AskQuestion from "./pages/AskQuestion";
import TermsOfService from "./pages/TermsOfService";
import Spinner from "./components/ui/Spinner";
import Card from "./components/ui/Card";

// Define a simple Privacy Policy component directly here to avoid Brave shields blocking
const PrivacyPolicy = () => {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1rem" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1.5rem",
          color: "var(--color-primary)",
          textAlign: "center",
        }}
      >
        Privacy Policy
      </h1>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                color: "var(--color-primary)",
                marginBottom: "1rem",
                borderBottom: "1px solid var(--color-border)",
                paddingBottom: "0.5rem",
              }}
            >
              1. Introduction
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
              At Zellora, we respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, and safeguard your information when you use our
              platform.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                color: "var(--color-primary)",
                marginBottom: "1rem",
                borderBottom: "1px solid var(--color-border)",
                paddingBottom: "0.5rem",
              }}
            >
              2. Information We Collect
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
              We collect information that you provide directly to us, such as
              when you create an account, submit content, or contact us for
              support. This may include your name, email address, and any
              content you share on our platform.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                color: "var(--color-primary)",
                marginBottom: "1rem",
                borderBottom: "1px solid var(--color-border)",
                paddingBottom: "0.5rem",
              }}
            >
              3. How We Use Your Information
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
              We use the information we collect to provide and improve our
              services, communicate with you, ensure security, and comply with
              legal obligations.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                color: "var(--color-primary)",
                marginBottom: "1rem",
                borderBottom: "1px solid var(--color-border)",
                paddingBottom: "0.5rem",
              }}
            >
              4. Your Rights
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
              You have the right to access, update, or delete your personal
              information. You can manage your account settings or contact us
              directly for assistance with your privacy rights.
            </p>
          </section>

          <div
            style={{
              marginTop: "2rem",
              fontStyle: "italic",
              color: "var(--color-text-secondary)",
              textAlign: "right",
            }}
          >
            <p>Last updated: September 6, 2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Lazy load admin dashboard
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "ask",
        element: (
          <ProtectedRoute>
            <AskQuestion />
          </ProtectedRoute>
        ),
      },
      { path: "questions", element: <Questions /> },
      { path: "questions/:id", element: <QuestionDetail /> },
      {
        path: "questions/:id/edit",
        element: (
          <ProtectedRoute>
            <EditQuestion />
          </ProtectedRoute>
        ),
      },
      {
        path: "answers/:id/edit",
        element: (
          <ProtectedRoute>
            <EditAnswer />
          </ProtectedRoute>
        ),
      },
      { path: "terms", element: <TermsOfService /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Suspense
              fallback={
                <div className='spinner-container'>
                  <Spinner size='large' />
                </div>
              }
            >
              <AdminLayout />
            </Suspense>
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
