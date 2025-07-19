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

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      </Routes>
    </Router>
  );
}

export default App;
