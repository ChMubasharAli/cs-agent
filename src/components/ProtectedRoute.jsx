import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Admin-specific routes
export const AdminProtectedRoute = () => {
  const { authStatus, userData, token } = useSelector((state) => state.auth);

  if (!authStatus || !userData || !token) {
    return <Navigate to={"/login"} replace />;
  }

  if (userData.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

// Agent-specific routes
export const AgentProtectedRoute = () => {
  const { authStatus, userData, token } = useSelector((state) => state.auth);

  if (!authStatus || !userData || !token) {
    return <Navigate to={"/login"} replace />;
  }

  if (userData.role !== "agent") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export const LoginProtectedRoute = ({ children }) => {
  const { authStatus, userData, token } = useSelector((state) => state.auth);
  if (authStatus && userData && token) {
    if (userData.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (userData.role === "agent") {
      return <Navigate to="/agent" replace />;
    }
  }

  return children; // agar login nahi hai to login page dikhao
};
