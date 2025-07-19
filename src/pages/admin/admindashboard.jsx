// AdminDashboard.jsx
import { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboard";
import { usersService } from "../../services/users";
import { authService } from "../../services/auth";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // State for active section
  const [activeSection, setActiveSection] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Available skills for dropdown
  const availableSkills = [
    "Residential Wiring",
    "Commercial Installation",
    "Industrial Wiring",
    "Emergency Repairs",
    "Solar Installation",
    "Maintenance",
    "Safety Inspection",
    "Panel Upgrades",
    "LED Lighting",
    "Smart Home Systems",
  ];

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    electricians: 0,
    managers: 0,
    admins: 0,
    activeJobs: 0,
    completedToday: 0,
    pendingJobs: 0,
    systemHealth: 98.5,
  });

  // Users data
  const [users, setUsers] = useState([]);

  // Recent activities
  const [activities, setActivities] = useState([]);

  // Reports configuration - Only 3 reports as requested
  const [reports] = useState([
    {
      id: 1,
      name: "User Performance Report",
      type: "user_performance",
      description:
        "Detailed analysis of user productivity and task completion rates",
      icon: "📊",
      color: "#3498db",
    },
    {
      id: 2,
      name: "System Usage Report",
      type: "system_usage",
      description:
        "Login patterns, peak hours, and system resource utilization",
      icon: "📈",
      color: "#2ecc71",
    },
    {
      id: 3,
      name: "Task Analytics Report",
      type: "task_analytics",
      description:
        "Task distribution, completion times, and efficiency metrics",
      icon: "📋",
      color: "#f39c12",
    },
  ]);

  // Form state for new user
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "Electrician",
    employee_code: "",
    skills: [],
    certifications: "",
  });

  // Password reset form
  const [resetPasswordData, setResetPasswordData] = useState({
    userId: null,
    newPassword: "",
    confirmPassword: "",
  });

  // Generate employee code
  const generateEmployeeCode = (role) => {
    const prefix =
      role === "Electrician" ? "ELC" : role === "Manager" ? "MGR" : "ADM";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  // Load data when component mounts
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Generate employee code when role changes
  useEffect(() => {
    if (modalType === "addUser" && formData.role) {
      setFormData((prev) => ({
        ...prev,
        employee_code: generateEmployeeCode(formData.role),
      }));
    }
  }, [formData.role, modalType]);

  // Function to load all dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load dashboard stats
      const statsResponse = await dashboardService.getStats();
      if (statsResponse.success) {
        setStats({
          ...statsResponse.data,
          systemHealth: 98.5,
        });
      }

      // Load users (excluding deleted ones)
      const usersResponse = await usersService.getAll();
      if (usersResponse.success) {
        setUsers(
          usersResponse.data.filter((user) => user.status !== "Deleted")
        );
      }

      // Load recent activities
      const activitiesResponse = await dashboardService.getActivities();
      if (activitiesResponse.success) {
        const formattedActivities = activitiesResponse.data
          .slice(0, 10)
          .map((activity) => ({
            id: activity.id,
            type: activity.action.toLowerCase().includes("login")
              ? "user_login"
              : activity.action.toLowerCase().includes("task")
              ? "task"
              : activity.action.toLowerCase().includes("user")
              ? "user_added"
              : "report_generated",
            user: activity.user_name || "System",
            action: activity.description || activity.action,
            time: formatTimeAgo(new Date(activity.created_at)),
            icon: getActivityIcon(activity.action),
          }));
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format time
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  // Helper function to get activity icon
  const getActivityIcon = (action) => {
    if (action.toLowerCase().includes("login")) return "🔐";
    if (action.toLowerCase().includes("task")) return "📋";
    if (action.toLowerCase().includes("user")) return "👤";
    if (action.toLowerCase().includes("report")) return "📊";
    if (action.toLowerCase().includes("password")) return "🔑";
    return "📌";
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle skills selection
  const handleSkillsChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({
      ...formData,
      skills: selectedOptions,
    });
  };

  // Handle add user
  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        ...formData,
        skills: formData.skills.join(", "),
      };

      const response = await usersService.create(userData);

      if (response.success) {
        await loadDashboardData();
        setShowModal(false);
        setFormData({
          username: "",
          email: "",
          password: "",
          full_name: "",
          phone: "",
          role: "Electrician",
          employee_code: generateEmployeeCode("Electrician"),
          skills: [],
          certifications: "",
        });
        alert("User added successfully!");
      }
    } catch (error) {
      alert("Error adding user: " + error.message);
    }
  };

  // Handle user actions
  const handleUserAction = async (userId, action) => {
    try {
      if (action === "toggle") {
        const response = await usersService.toggleStatus(userId);
        if (response.success) {
          await loadDashboardData();
        }
      } else if (action === "delete") {
        if (
          confirm(
            "Are you sure you want to delete this user? This action cannot be undone."
          )
        ) {
          const response = await usersService.delete(userId);
          if (response.success) {
            alert("User deleted successfully!");
            await loadDashboardData();
          }
        }
      } else if (action === "edit") {
        const user = users.find((u) => u.id === userId);
        setSelectedItem(user);
        setFormData({
          ...user,
          skills: user.skills ? user.skills.split(", ") : [],
          password: "", // Don't populate password
        });
        setModalType("editUser");
        setShowModal(true);
      } else if (action === "resetPassword") {
        setResetPasswordData({
          userId: userId,
          newPassword: "",
          confirmPassword: "",
        });
        setModalType("resetPassword");
        setShowModal(true);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      const response = await usersService.resetPassword(
        resetPasswordData.userId,
        resetPasswordData.newPassword
      );

      if (response.success) {
        alert("Password reset successfully!");
        setShowModal(false);
        setResetPasswordData({
          userId: null,
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      alert("Error resetting password: " + error.message);
    }
  };

  // Handle generate report
  const handleGenerateReport = async (reportId) => {
    try {
      const report = reports.find((r) => r.id === reportId);

      const response = await dashboardService.generateReport({
        report_type: report.type,
        start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
      });

      if (response.success && response.data) {
        setReportData({
          ...response.data,
          reportName: report.name,
          reportType: report.type,
        });
        setShowReportModal(true);
      }
    } catch (error) {
      alert("Error generating report: " + error.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      authService.logout();
    }
  };

  // Render report modal content
  const renderReportContent = () => {
    if (!reportData) return null;

    switch (reportData.reportType) {
      case "user_performance":
        return (
          <div className="report-content">
            <h3>User Performance Report</h3>
            <div className="report-summary">
              <p>Period: {new Date().toLocaleDateString()}</p>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Tasks Completed</th>
                  <th>Avg Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.performance?.map((user, index) => (
                  <tr key={index}>
                    <td>{user.full_name}</td>
                    <td>{user.role || "Electrician"}</td>
                    <td>{user.completed_tasks || 0}</td>
                    <td>
                      {user.avg_rating
                        ? parseFloat(user.avg_rating).toFixed(1)
                        : "N/A"}
                    </td>
                    <td>
                      {user.overall_rating
                        ? parseFloat(user.overall_rating).toFixed(1)
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "system_usage":
        return (
          <div className="report-content">
            <h3>System Usage Report</h3>
            <div className="report-stats">
              <div className="stat-item">
                <h4>Total Users</h4>
                <p>{stats.totalUsers}</p>
              </div>
              <div className="stat-item">
                <h4>Active Today</h4>
                <p>
                  {activities.filter((a) => a.type === "user_login").length}
                </p>
              </div>
              <div className="stat-item">
                <h4>System Health</h4>
                <p>{stats.systemHealth}%</p>
              </div>
            </div>
            <h4>Recent Login Activity</h4>
            <ul>
              {activities
                .filter((a) => a.type === "user_login")
                .slice(0, 10)
                .map((activity, index) => (
                  <li key={index}>
                    {activity.user} - {activity.time}
                  </li>
                ))}
            </ul>
          </div>
        );

      case "task_analytics":
        return (
          <div className="report-content">
            <h3>Task Analytics Report</h3>
            <div className="report-summary">
              {reportData.analytics && (
                <div className="analytics-grid">
                  <div className="analytics-item">
                    <h4>Total Tasks</h4>
                    <p>{reportData.analytics.total_tasks || 0}</p>
                  </div>
                  <div className="analytics-item">
                    <h4>Completed</h4>
                    <p>{reportData.analytics.completed || 0}</p>
                  </div>
                  <div className="analytics-item">
                    <h4>Cancelled</h4>
                    <p>{reportData.analytics.cancelled || 0}</p>
                  </div>
                  <div className="analytics-item">
                    <h4>Avg Duration</h4>
                    <p>
                      {reportData.analytics.avg_duration
                        ? `${parseFloat(
                            reportData.analytics.avg_duration
                          ).toFixed(1)} hrs`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="analytics-item">
                    <h4>High Priority</h4>
                    <p>{reportData.analytics.high_priority || 0}</p>
                  </div>
                  <div className="analytics-item">
                    <h4>Medium Priority</h4>
                    <p>{reportData.analytics.medium_priority || 0}</p>
                  </div>
                  <div className="analytics-item">
                    <h4>Low Priority</h4>
                    <p>{reportData.analytics.low_priority || 0}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render main content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            {/* Stats Overview */}
            <div className="stats-container">
              <div className="stat-box primary">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>{stats.totalUsers || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="stat-box info">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h3>{stats.electricians || 0}</h3>
                  <p>Electricians</p>
                </div>
              </div>

              <div className="stat-box warning">
                <div className="stat-icon">👨‍💼</div>
                <div className="stat-content">
                  <h3>{stats.managers || 0}</h3>
                  <p>Managers</p>
                </div>
              </div>

              <div className="stat-box success">
                <div className="stat-icon">🛠️</div>
                <div className="stat-content">
                  <h3>{stats.totalTasks || 0}</h3>
                  <p>Total Tasks</p>
                </div>
              </div>

              <div className="stat-box primary">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>{stats.completedTasks || 0}</h3>
                  <p>Completed</p>
                </div>
              </div>

              <div className="stat-box danger">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>{stats.pendingTasks || 0}</h3>
                  <p>Pending</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      employee_code: generateEmployeeCode(formData.role),
                    });
                    setModalType("addUser");
                    setShowModal(true);
                  }}
                >
                  ➕ Add New User
                </button>
                <button onClick={() => handleGenerateReport(1)}>
                  📊 Generate Report
                </button>
                <button onClick={() => setActiveSection("users")}>
                  👥 Manage Users
                </button>
                <button onClick={() => setActiveSection("reports")}>
                  📈 View Reports
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p>
                        <strong>{activity.user}</strong> {activity.action}
                      </p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case "users":
        return (
          <div className="users-section">
            <div className="section-header">
              <h2>User Management</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  setFormData({
                    username: "",
                    email: "",
                    password: "",
                    full_name: "",
                    phone: "",
                    role: "Electrician",
                    employee_code: generateEmployeeCode("Electrician"),
                    skills: [],
                    certifications: "",
                  });
                  setModalType("addUser");
                  setShowModal(true);
                }}
              >
                ➕ Add New User
              </button>
            </div>

            <div className="users-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-header">
                    <div className="user-avatar">
                      {user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="user-status">
                      <span className={`status ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>

                  <div className="user-info">
                    <h3>{user.full_name}</h3>
                    <p className="user-role">{user.role}</p>
                    <p className="user-email">📧 {user.email}</p>
                    <p className="user-phone">📱 {user.phone || "N/A"}</p>
                    <p className="user-date">
                      📅 Joined:{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    {user.employee_code && (
                      <p className="user-code">🆔 Code: {user.employee_code}</p>
                    )}
                    {user.role === "Electrician" &&
                      user.total_tasks_completed !== undefined && (
                        <p className="user-tasks">
                          ✅ Tasks: {user.total_tasks_completed}
                        </p>
                      )}
                  </div>

                  <div className="user-actions">
                    <button onClick={() => handleUserAction(user.id, "edit")}>
                      Edit
                    </button>
                    <button onClick={() => handleUserAction(user.id, "toggle")}>
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleUserAction(user.id, "resetPassword")}
                      className="btn-warning"
                    >
                      Reset Password
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleUserAction(user.id, "delete")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="reports-section">
            <h2>System Reports</h2>
            <p className="section-description">
              Generate comprehensive reports for system analysis and decision
              making
            </p>

            <div className="reports-grid">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="report-card"
                  style={{ borderLeft: `4px solid ${report.color}` }}
                >
                  <div className="report-icon" style={{ color: report.color }}>
                    {report.icon}
                  </div>
                  <div className="report-content">
                    <h3>{report.name}</h3>
                    <p>{report.description}</p>
                  </div>
                  <button
                    className="generate-btn"
                    onClick={() => handleGenerateReport(report.id)}
                  >
                    Generate
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading dashboard: {error}</p>
        <button onClick={loadDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <h2>Admin Panel</h2>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveSection("overview")}
          >
            <span>🏠</span> Dashboard
          </button>

          <button
            className={`nav-item ${activeSection === "users" ? "active" : ""}`}
            onClick={() => setActiveSection("users")}
          >
            <span>👥</span> Users
          </button>

          <button
            className={`nav-item ${
              activeSection === "reports" ? "active" : ""
            }`}
            onClick={() => setActiveSection("reports")}
          >
            <span>📊</span> Reports
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">AD</div>
            <div>
              <p className="admin-name">Admin User</p>
              <p className="admin-email">admin@company.com</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <h1>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
          <div className="header-actions">
            <button className="notification-btn">
              🔔 <span className="badge">3</span>
            </button>
            <span className="current-time">{new Date().toLocaleString()}</span>
          </div>
        </header>

        <div className="content-wrapper">{renderContent()}</div>
      </main>

      {/* Add/Edit User Modal */}
      {showModal && modalType !== "resetPassword" && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === "addUser" ? "Add New User" : "Edit User"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Employee Code (Auto-generated)</label>
                <input
                  type="text"
                  name="employee_code"
                  value={formData.employee_code}
                  readOnly
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="+94 XX XXX XXXX"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Electrician">Electrician</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {modalType === "addUser" && (
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter password"
                    minLength="6"
                  />
                </div>
              )}

              {formData.role === "Electrician" && (
                <>
                  <div className="form-group">
                    <label>Skills (Hold Ctrl/Cmd to select multiple)</label>
                    <select
                      multiple
                      name="skills"
                      value={formData.skills}
                      onChange={handleSkillsChange}
                      size="6"
                      style={{ height: "120px" }}
                    >
                      {availableSkills.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                    <small>
                      Selected: {formData.skills.join(", ") || "None"}
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Certifications</label>
                    <input
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleFormChange}
                      placeholder="Level 3 Certified, Safety Standards"
                    />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {modalType === "addUser" ? "Add User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showModal && modalType === "resetPassword" && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset User Password</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  placeholder="Enter new password"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  placeholder="Confirm new password"
                  minLength="6"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="modal-content report-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{reportData?.reportName}</h2>
              <button
                className="close-btn"
                onClick={() => setShowReportModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">{renderReportContent()}</div>

            <div className="modal-actions">
              <button onClick={() => setShowReportModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => window.print()}>
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
