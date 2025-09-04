// File: /src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import SystemLogs from "./pages/SystemLogs";
import Settings from "./pages/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import AdminLayout from "./layouts/AdminLayout";
import AdminUsersPage from "./pages/Users";
import AdminContentPage from "./pages/Content";

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const tokenExpiry = Number(localStorage.getItem("token_expiry") || 0);
  const isExpired = token && tokenExpiry && Date.now() > tokenExpiry;

  if (isExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user");
  }

  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick
        draggable
        pauseOnHover
        bodyClassName="text-sm"
        theme="dark"
      />
      <Routes>
        <Route
          path="/"
          element={
            user && token && !isExpired ? (
              user.role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/welcome" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Admin Layout with Nested Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="system-logs" element={<SystemLogs />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="settings" element={<Settings />} />
          {/* You can add more nested admin routes like users, content etc */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
