// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../src/pages/login/Loginpage";
import AdminDashboard from "../src/pages/admin/admindashboard";
import ManagerDashboard from "../src/pages/manager/managerdashboard";
import ElectricianDashboard from "../src/pages/electrician/electriciandashboard";
import { getToken, getUser } from "../src/services/api";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Auth Redirect Component - redirects to appropriate dashboard if logged in
const AuthRedirect = () => {
  const token = getToken();
  const user = getUser();

  if (token && user) {
    switch (user.role) {
      case "Admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "Manager":
        return <Navigate to="/manager/dashboard" replace />;
      case "Electrician":
        return <Navigate to="/electrician/dashboard" replace />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/electrician/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Electrician"]}>
              <ElectricianDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<AuthRedirect />} />
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      </Routes>
    </Router>
  );
}

export default App;
