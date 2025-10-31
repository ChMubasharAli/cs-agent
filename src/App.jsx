import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  Home,
  LoginPage,
  NotFoundPage,
  Tickets,
  Unauthorized,
  Users,
} from "./pages";
import TicketDetails from "./components/TicketDetails";
import Calls from "./pages/admin/Calls";
import CallDetails from "./components/CallsDetails";
import AgentCalls from "./pages/agents/AgentCalls";

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
        <Route path="calls/:id" element={<CallDetails />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes  */}

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="agents" element={<Agents />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="tickets/:id" element={<TicketDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="inbound" element={<Calls type="inbound" />} />
            <Route path="outbound" element={<Calls type="outbound" />} />
          </Route>
        </Route>

        {/* Agents Routes  */}

        <Route element={<AgentProtectedRoute />}>
          <Route path="/agent" element={<AgentLayout />}>
            <Route index element={<AgentDashboard />} />
            <Route path="tickets" element={<AgentTickets />} />
            <Route path="tickets/:id" element={<TicketDetails />} />
            <Route path="calls" element={<AgentCalls />} />
          </Route>
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
