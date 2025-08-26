import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  AdminLayout,
  AdminProtectedRoute,
  AgentLayout,
  AgentProtectedRoute,
  LoginProtectedRoute,
} from "./components";
import {
  AdminDashboard,
  AgentDashboard,
  Agents,
  AgentTickets,
  AgentUsers,
  Home,
  LoginPage,
  NotFoundPage,
  Tickets,
  Unauthorized,
  Users,
} from "./pages";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes  */}
        <Route
          path="/login"
          element={
            <LoginProtectedRoute>
              <LoginPage />
            </LoginProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes  */}

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="agents" element={<Agents />} />
            <Route path="users" element={<Users />} />
            <Route path="tickets" element={<Tickets />} />
          </Route>
        </Route>

        {/* Agents Routes  */}

        <Route element={<AgentProtectedRoute />}>
          <Route path="/agent" element={<AgentLayout />}>
            <Route index element={<AgentDashboard />} />
            <Route path="tickets" element={<AgentTickets />} />
            <Route path="users" element={<AgentUsers />} />
          </Route>
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
