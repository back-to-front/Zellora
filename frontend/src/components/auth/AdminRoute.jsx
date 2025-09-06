import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  // If user is not authenticated or not an admin, redirect to login
  if (!user || !user.isAdmin) {
    return <Navigate to='/login' replace />;
  }

  // User is admin, render the protected component
  return children;
};

export default AdminRoute;
