// AdminDashboard.jsx
import { useState, useEffect } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // State for active section
  const [activeSection, setActiveSection] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalUsers: 45,
    electricians: 32,
    managers: 10,
    admins: 3,
    activeJobs: 24,
    completedToday: 18,
    pendingJobs: 6,
    systemHealth: 98.5,
  });

  // Users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      role: "Electrician",
      status: "Active",
      phone: "+94 77 123 4567",
      joinDate: "2023-05-15",
      tasksCompleted: 145,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "Manager",
      status: "Active",
      phone: "+94 77 234 5678",
      joinDate: "2023-03-10",
      tasksAssigned: 89,
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.w@company.com",
      role: "Electrician",
      status: "Active",
      phone: "+94 77 345 6789",
      joinDate: "2023-08-22",
      tasksCompleted: 78,
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.d@company.com",
      role: "Admin",
      status: "Active",
      phone: "+94 77 456 7890",
      joinDate: "2023-01-05",
      lastLogin: "2024-01-15",
    },
    {
      id: 5,
      name: "James Brown",
      email: "james.b@company.com",
      role: "Electrician",
      status: "Inactive",
      phone: "+94 77 567 8901",
      joinDate: "2023-09-18",
      tasksCompleted: 52,
    },
  ]);

  // Recent activities
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "task_completed",
      user: "John Smith",
      action: "completed task #1234",
      time: "10 minutes ago",
      icon: "✅",
    },
    {
      id: 2,
      type: "user_login",
      user: "Sarah Johnson",
      action: "logged into the system",
      time: "25 minutes ago",
      icon: "🔐",
    },
    {
      id: 3,
      type: "task_assigned",
      user: "Mike Wilson",
      action: "was assigned task #1235",
      time: "1 hour ago",
      icon: "📋",
    },
    {
      id: 4,
      type: "report_generated",
      user: "System",
      action: "generated monthly performance report",
      time: "2 hours ago",
      icon: "📊",
    },
    {
      id: 5,
      type: "user_added",
      user: "Admin",
      action: "added new electrician Tom Lee",
      time: "3 hours ago",
      icon: "👤",
    },
  ]);

  // Reports configuration
  const [reports] = useState([
    {
      id: 1,
      name: "User Performance Report",
      description:
        "Detailed analysis of user productivity and task completion rates",
      icon: "📊",
      color: "#3498db",
    },
    {
      id: 2,
      name: "System Usage Report",
      description:
        "Login patterns, peak hours, and system resource utilization",
      icon: "📈",
      color: "#2ecc71",
    },
    {
      id: 3,
      name: "Task Analytics Report",
      description:
        "Task distribution, completion times, and efficiency metrics",
      icon: "📋",
      color: "#f39c12",
    },
    {
      id: 4,
      name: "Financial Summary",
      description: "Revenue, costs, and profitability analysis by job type",
      icon: "💰",
      color: "#e74c3c",
    },
    {
      id: 5,
      name: "Customer Satisfaction",
      description: "Feedback scores, complaints, and service quality metrics",
      icon: "⭐",
      color: "#9b59b6",
    },
    {
      id: 6,
      name: "Security Audit Log",
      description:
        "Failed login attempts, permission changes, and security events",
      icon: "🔒",
      color: "#34495e",
    },
  ]);

  // Form state for new user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Electrician",
    password: "",
  });

  // Handle form changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle add user
  const handleAddUser = (e) => {
    e.preventDefault();

    const newUser = {
      id: users.length + 1,
      ...formData,
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
      tasksCompleted: 0,
    };

    setUsers([...users, newUser]);
    setShowModal(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Electrician",
      password: "",
    });

    // Show success message
    alert("User added successfully!");
  };

  // Handle user actions
  const handleUserAction = (userId, action) => {
    if (action === "toggle") {
      setUsers(
        users.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: user.status === "Active" ? "Inactive" : "Active",
              }
            : user
        )
      );
    } else if (action === "delete") {
      if (confirm("Are you sure you want to delete this user?")) {
        setUsers(users.filter((user) => user.id !== userId));
      }
    } else if (action === "edit") {
      const user = users.find((u) => u.id === userId);
      setSelectedItem(user);
      setModalType("editUser");
      setShowModal(true);
    }
  };

  // Handle generate report
  const handleGenerateReport = (reportId) => {
    const report = reports.find((r) => r.id === reportId);
    alert(`Generating ${report.name}...`);

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: "report_generated",
      user: "Admin",
      action: `generated ${report.name}`,
      time: "Just now",
      icon: "📊",
    };
    setActivities([newActivity, ...activities]);
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/login";
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
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="stat-box info">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h3>{stats.electricians}</h3>
                  <p>Electricians</p>
                </div>
              </div>

              <div className="stat-box warning">
                <div className="stat-icon">👨‍💼</div>
                <div className="stat-content">
                  <h3>{stats.managers}</h3>
                  <p>Managers</p>
                </div>
              </div>

              <div className="stat-box success">
                <div className="stat-icon">🛠️</div>
                <div className="stat-content">
                  <h3>{stats.activeJobs}</h3>
                  <p>Active Jobs</p>
                </div>
              </div>

              <div className="stat-box primary">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>{stats.completedToday}</h3>
                  <p>Completed Today</p>
                </div>
              </div>

              <div className="stat-box danger">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>{stats.pendingJobs}</h3>
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
                <button onClick={() => setActiveSection("system")}>
                  ⚙️ System Settings
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
                      {user.name
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
                    <h3>{user.name}</h3>
                    <p className="user-role">{user.role}</p>
                    <p className="user-email">📧 {user.email}</p>
                    <p className="user-phone">📱 {user.phone}</p>
                    <p className="user-date">📅 Joined: {user.joinDate}</p>

                    {user.role === "Electrician" && (
                      <p className="user-tasks">
                        ✅ Tasks: {user.tasksCompleted || 0}
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

      case "system":
        return (
          <div className="system-section">
            <h2>System Settings</h2>

            <div className="settings-grid">
              <div className="setting-card">
                <h3>🔒 Security Settings</h3>
                <ul>
                  <li>
                    Password Policy: <strong>Strong</strong>
                  </li>
                  <li>
                    Session Timeout: <strong>30 minutes</strong>
                  </li>
                  <li>
                    Two-Factor Auth: <strong>Enabled</strong>
                  </li>
                  <li>
                    Failed Login Attempts: <strong>5</strong>
                  </li>
                </ul>
                <button>Configure Security</button>
              </div>

              <div className="setting-card">
                <h3>📧 Email Configuration</h3>
                <ul>
                  <li>
                    SMTP Server: <strong>mail.company.com</strong>
                  </li>
                  <li>
                    Port: <strong>587</strong>
                  </li>
                  <li>
                    Encryption: <strong>TLS</strong>
                  </li>
                  <li>
                    Status: <strong className="text-success">Connected</strong>
                  </li>
                </ul>
                <button>Update Email Settings</button>
              </div>

              <div className="setting-card">
                <h3>💾 Database</h3>
                <ul>
                  <li>
                    Type: <strong>PostgreSQL</strong>
                  </li>
                  <li>
                    Size: <strong>2.4 GB</strong>
                  </li>
                  <li>
                    Last Backup: <strong>Today 3:00 AM</strong>
                  </li>
                  <li>
                    Auto-backup: <strong>Enabled</strong>
                  </li>
                </ul>
                <button>Backup Now</button>
              </div>

              <div className="setting-card">
                <h3>⚡ System Health</h3>
                <div className="health-meter">
                  <div
                    className="health-bar"
                    style={{ width: `${stats.systemHealth}%` }}
                  >
                    {stats.systemHealth}%
                  </div>
                </div>
                <ul>
                  <li>
                    CPU Usage: <strong>45%</strong>
                  </li>
                  <li>
                    Memory: <strong>62%</strong>
                  </li>
                  <li>
                    Disk Space: <strong>38% used</strong>
                  </li>
                </ul>
                <button>View Details</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <h2>ElectricianMS</h2>
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

          <button
            className={`nav-item ${activeSection === "system" ? "active" : ""}`}
            onClick={() => setActiveSection("system")}
          >
            <span>⚙️</span> System
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

      {/* Modal */}
      {showModal && (
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
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                  required
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
                  />
                </div>
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
    </div>
  );
};

export default AdminDashboard;
