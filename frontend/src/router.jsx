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

// Lazy load pages that might trigger tracking protection
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

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
      {
        path: "privacy",
        element: (
          <Suspense
            fallback={
              <div className='spinner-container'>
                <Spinner size='large' />
              </div>
            }
          >
            <PrivacyPolicy />
          </Suspense>
        ),
      },
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
