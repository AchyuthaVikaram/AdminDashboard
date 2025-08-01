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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  const user = localStorage.getItem("user");

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
            user ? (
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
          {/* You can add more nested admin routes like users, logs etc */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
