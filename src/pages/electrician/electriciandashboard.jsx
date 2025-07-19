// ElectricianDashboard.jsx
import { useState, useEffect } from "react";
import "./ElectricianDashboard.css";
import { useNavigate } from "react-router-dom";

// API configuration
const API_URL = "http://localhost:5001/api";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error("API request failed");
  }

  return response.json();
};

const ElectricianDashboard = () => {
  const navigate = useNavigate();

  // State management
  const [activeView, setActiveView] = useState("today");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("user") || "{}");

  // Dashboard statistics from API
  const [stats, setStats] = useState({
    todayTasks: 0,
    completedToday: 0,
    inProgress: 0,
    pendingToday: 0,
    totalCompleted: 0,
    thisMonth: 0,
    completedThisMonth: 0,
    avgRating: 0,
    onTimeRate: 0,
  });

  // Tasks from API
  const [todayTasks, setTodayTasks] = useState([]);
  const [taskHistory, setTaskHistory] = useState([]);

  // Notifications from API
  const [notifications, setNotifications] = useState([]);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await apiRequest("/dashboard/stats");
      setStats({
        todayTasks: response.data.todayTasks || 0,
        completedToday: response.data.completedToday || 0,
        inProgress: response.data.inProgress || 0,
        pendingToday: response.data.pendingToday || 0,
        totalCompleted: response.data.totalCompleted || 0,
        thisMonth: response.data.thisMonth || 0,
        completedThisMonth: response.data.completedThisMonth || 0,
        avgRating: response.data.avgRating || 0,
        onTimeRate: response.data.onTimeRate || 0,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    }
  };

  // Fetch today's tasks
  const fetchTodayTasks = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const response = await apiRequest(`/tasks?date=${today}`);

      // Transform API data to match component structure
      const transformedTasks = response.data.map((task) => ({
        id: task.task_code,
        taskId: task.id,
        title: task.title,
        customer: task.customer_name,
        address: task.customer_address,
        phone: task.customer_phone,
        priority: task.priority,
        status: task.status,
        scheduledTime: `${formatTime(task.scheduled_time_start)} - ${formatTime(
          task.scheduled_time_end
        )}`,
        estimatedHours: task.estimated_hours,
        description: task.description || "",
        materials: [], // This could be fetched from task details
        startTime: task.actual_start_time
          ? formatTime(task.actual_start_time)
          : null,
        completedTime: task.actual_end_time
          ? formatTime(task.actual_end_time)
          : null,
        rating: task.rating,
        feedback: task.feedback,
        completionNotes: task.completion_notes,
        additionalCharges: task.additional_charges,
      }));

      setTodayTasks(transformedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load today's tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch task history
  const fetchTaskHistory = async () => {
    try {
      // Fetch all tasks (not just today's)
      const response = await apiRequest("/tasks");

      // Filter completed tasks and transform for history view
      const completedTasks = response.data
        .filter((task) => task.status === "Completed")
        .map((task) => ({
          id: task.task_code,
          taskId: task.id,
          date: new Date(task.scheduled_date).toISOString().split("T")[0],
          title: task.title,
          customer: task.customer_name,
          status: task.status,
          rating: task.rating || 0,
          earnings: task.additional_charges || 0, // In real app, this would be calculated
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20); // Show last 20 completed tasks

      setTaskHistory(completedTasks);
    } catch (err) {
      console.error("Failed to fetch task history:", err);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await apiRequest("/dashboard/notifications");
      setNotifications(
        response.data.map((notif) => ({
          id: notif.id,
          type: notif.type,
          message: notif.message,
          time: getRelativeTime(notif.created_at),
          unread: !notif.is_read,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to get relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // seconds

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchTodayTasks(),
        fetchTaskHistory(),
        fetchNotifications(),
      ]);
    };

    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchTodayTasks();
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Update task status in backend
  const updateTaskStatus = async (taskId, newStatus, additionalData = {}) => {
    try {
      await apiRequest(`/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      // If completing task, send completion data
      if (newStatus === "Completed" && additionalData.completionNotes) {
        await apiRequest(`/tasks/${taskId}/complete`, {
          method: "POST",
          body: JSON.stringify({
            completion_notes: additionalData.completionNotes,
            materials_used: additionalData.materialsUsed || "",
            additional_charges:
              parseFloat(additionalData.additionalCharges) || 0,
          }),
        });
      }

      // Refresh data
      await fetchTodayTasks();
      await fetchDashboardStats();

      setShowModal(false);
      alert(
        `Task ${
          newStatus === "In Progress" ? "started" : "updated"
        } successfully!`
      );
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to update task status. Please try again.");
    }
  };

  // Start task
  const handleStartTask = async (task) => {
    await updateTaskStatus(task.taskId, "In Progress");
  };

  // Complete task
  const handleCompleteTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const completionData = {
      completionNotes: formData.get("notes"),
      materialsUsed: formData.get("materials"),
      additionalCharges: formData.get("charges"),
    };

    await updateTaskStatus(selectedTask.taskId, "Completed", completionData);
  };

  // Handle report issue
  const handleReportIssue = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      // In a real app, you'd have an endpoint for reporting issues
      // For now, we'll log it as an activity
      await apiRequest("/dashboard/activities", {
        method: "POST",
        body: JSON.stringify({
          action: "Issue Reported",
          description: `${formData.get("issueType")} - ${formData.get(
            "description"
          )}`,
        }),
      });

      alert("Issue reported successfully!");
      setShowModal(false);
    } catch (err) {
      alert("Failed to report issue. Please try again.");
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      await apiRequest(`/dashboard/notifications/${notificationId}/read`, {
        method: "PATCH",
      });

      // Update local state
      setNotifications(
        notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, unread: false } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const total = stats.todayTasks;
    const completed = stats.completedToday;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return todayTasks.filter((task) => task.status === status);
  };

  // Render main content
  const renderContent = () => {
    if (loading && activeView === "today") {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      );
    }

    if (error && activeView === "today") {
      return (
        <div className="error-container">
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchTodayTasks();
              fetchDashboardStats();
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeView) {
      case "today":
        return (
          <>
            {/* Today's Overview */}
            <div className="overview-section">
              <h2>Today's Overview</h2>
              <div className="date-display">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-header">
                  <span>Daily Progress</span>
                  <span>
                    {stats.completedToday} of {stats.todayTasks} tasks completed
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="quick-stats">
                <div className="stat-box">
                  <div className="stat-value">{stats.todayTasks}</div>
                  <div className="stat-label">Today's Tasks</div>
                </div>
                <div className="stat-box success">
                  <div className="stat-value">{stats.completedToday}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-box warning">
                  <div className="stat-value">{stats.inProgress}</div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-box info">
                  <div className="stat-value">{stats.pendingToday}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
            </div>

            {/* Task Categories */}
            <div className="task-categories">
              {/* Pending Tasks */}
              <div className="task-category">
                <h3>🔔 Pending Tasks</h3>
                <div className="task-list">
                  {getTasksByStatus("Pending").length === 0 &&
                  getTasksByStatus("Assigned").length === 0 ? (
                    <p className="no-tasks">No pending tasks</p>
                  ) : (
                    [
                      ...getTasksByStatus("Pending"),
                      ...getTasksByStatus("Assigned"),
                    ].map((task) => (
                      <div key={task.id} className="task-card pending">
                        <div className="task-header">
                          <span className="task-id">{task.id}</span>
                          <span
                            className={`priority ${task.priority.toLowerCase()}`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>

                        <h4>{task.title}</h4>
                        <p className="customer-info">
                          <strong>{task.customer}</strong>
                          <br />
                          📍 {task.address}
                          <br />
                          📞 {task.phone}
                        </p>

                        <div className="task-time">
                          <span>🕐 {task.scheduledTime}</span>
                          <span>⏱️ {task.estimatedHours} hours</span>
                        </div>

                        <div className="task-actions">
                          <button
                            className="btn-start"
                            onClick={() => handleStartTask(task)}
                          >
                            Start Task
                          </button>
                          <button
                            className="btn-details"
                            onClick={() => {
                              setSelectedTask(task);
                              setModalType("taskDetails");
                              setShowModal(true);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* In Progress */}
              <div className="task-category">
                <h3>⚡ In Progress</h3>
                <div className="task-list">
                  {getTasksByStatus("In Progress").length === 0 ? (
                    <p className="no-tasks">No tasks in progress</p>
                  ) : (
                    getTasksByStatus("In Progress").map((task) => (
                      <div key={task.id} className="task-card in-progress">
                        <div className="task-header">
                          <span className="task-id">{task.id}</span>
                          <span className="status-badge in-progress">
                            In Progress
                          </span>
                        </div>

                        <h4>{task.title}</h4>
                        <p className="customer-info">
                          <strong>{task.customer}</strong>
                          <br />
                          📍 {task.address}
                        </p>

                        <div className="task-time">
                          <span>
                            🕐 Started: {task.startTime || "Just now"}
                          </span>
                        </div>

                        <div className="task-actions">
                          <button
                            className="btn-complete"
                            onClick={() => {
                              setSelectedTask(task);
                              setModalType("completeTask");
                              setShowModal(true);
                            }}
                          >
                            Complete Task
                          </button>
                          <button
                            className="btn-issue"
                            onClick={() => {
                              setSelectedTask(task);
                              setModalType("reportIssue");
                              setShowModal(true);
                            }}
                          >
                            Report Issue
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Completed */}
              <div className="task-category">
                <h3>✅ Completed Today</h3>
                <div className="task-list">
                  {getTasksByStatus("Completed").length === 0 ? (
                    <p className="no-tasks">No completed tasks today</p>
                  ) : (
                    getTasksByStatus("Completed").map((task) => (
                      <div key={task.id} className="task-card completed">
                        <div className="task-header">
                          <span className="task-id">{task.id}</span>
                          <span className="status-badge completed">
                            Completed
                          </span>
                        </div>

                        <h4>{task.title}</h4>
                        <p className="customer-info">
                          <strong>{task.customer}</strong>
                          <br />
                          📍 {task.address}
                        </p>

                        <div className="task-time">
                          <span>
                            ✅ Completed: {task.completedTime || "Today"}
                          </span>
                        </div>

                        {task.rating && (
                          <div className="task-rating">
                            <span>Rating: {"⭐".repeat(task.rating)}</span>
                            {task.feedback && (
                              <p className="feedback">"{task.feedback}"</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case "history":
        return (
          <div className="history-section">
            <h2>Task History</h2>

            {/* Summary Stats */}
            <div className="summary-stats">
              <div className="stat-card">
                <h3>{stats.totalCompleted}</h3>
                <p>Total Completed</p>
              </div>
              <div className="stat-card">
                <h3>{stats.completedThisMonth}</h3>
                <p>This Month</p>
              </div>
              <div className="stat-card">
                <h3>{Math.round(stats.completedThisMonth / 4)}</h3>
                <p>This Week</p>
              </div>
              <div className="stat-card">
                <h3>{stats.avgRating.toFixed(1)} ⭐</h3>
                <p>Average Rating</p>
              </div>
            </div>

            {/* History Table */}
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Task ID</th>
                    <th>Description</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {taskHistory.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No task history available
                      </td>
                    </tr>
                  ) : (
                    taskHistory.map((task) => (
                      <tr key={task.id}>
                        <td>{task.date}</td>
                        <td>{task.id}</td>
                        <td>{task.title}</td>
                        <td>{task.customer}</td>
                        <td>
                          <span className="status-badge completed">
                            {task.status}
                          </span>
                        </td>
                        <td>
                          {task.rating > 0 ? "⭐".repeat(task.rating) : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Monthly Summary */}
            <div className="monthly-summary">
              <h3>Monthly Performance</h3>
              <div className="performance-grid">
                <div className="performance-item">
                  <h4>Tasks Completed</h4>
                  <p>{stats.completedThisMonth}</p>
                </div>
                <div className="performance-item">
                  <h4>On-Time Rate</h4>
                  <p>{stats.onTimeRate}%</p>
                </div>
                <div className="performance-item">
                  <h4>Customer Satisfaction</h4>
                  <p>{stats.avgRating.toFixed(1)}/5.0</p>
                </div>
                <div className="performance-item">
                  <h4>Active Days</h4>
                  <p>{Math.round(stats.completedThisMonth / 3)}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="profile-section">
            <h2>My Profile</h2>

            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {userInfo.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "E"}
                </div>
                <div className="profile-info">
                  <h3>{userInfo.name || "Electrician"}</h3>
                  <p>Employee ID: {userInfo.id || "N/A"}</p>
                  <p>⭐ {stats.avgRating.toFixed(1)} Rating</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-group">
                  <label>Email</label>
                  <p>{userInfo.email || "Not provided"}</p>
                </div>
                <div className="detail-group">
                  <label>Phone</label>
                  <p>{userInfo.phone || "Not provided"}</p>
                </div>
                <div className="detail-group">
                  <label>Role</label>
                  <p>{userInfo.role || "Electrician"}</p>
                </div>
                <div className="detail-group">
                  <label>Total Tasks Completed</label>
                  <p>{stats.totalCompleted}</p>
                </div>
              </div>

              <div className="skills-section">
                <h4>My Skills</h4>
                <div className="skills-list">
                  <span className="skill">Residential Wiring</span>
                  <span className="skill">Commercial Installation</span>
                  <span className="skill">Emergency Repairs</span>
                  <span className="skill">Solar Panel Installation</span>
                  <span className="skill">Safety Inspection</span>
                </div>
              </div>

              <div className="certifications">
                <h4>Certifications</h4>
                <ul>
                  <li>Certified Electrician - Level 3</li>
                  <li>Safety Standards Certificate</li>
                  <li>Emergency Response Training</li>
                </ul>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="performance-overview">
              <h3>Performance Overview</h3>
              <div className="metrics-grid">
                <div className="metric">
                  <h4>This Month</h4>
                  <div className="metric-value">{stats.completedThisMonth}</div>
                  <p>Tasks Completed</p>
                </div>
                <div className="metric">
                  <h4>On-Time Rate</h4>
                  <div className="metric-value">{stats.onTimeRate}%</div>
                  <p>Punctuality</p>
                </div>
                <div className="metric">
                  <h4>Avg Rating</h4>
                  <div className="metric-value">
                    {stats.avgRating.toFixed(1)}
                  </div>
                  <p>Customer Satisfaction</p>
                </div>
                <div className="metric">
                  <h4>Response Time</h4>
                  <div className="metric-value">15 min</div>
                  <p>Average</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="electrician-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Electrician Dashboard</h1>
          <p>Welcome back, {userInfo.name || "Electrician"}</p>
        </div>
        <div className="header-right">
          <button
            className="notification-btn"
            onClick={() => {
              // In a real app, this would open a notifications panel
              notifications.forEach((notif) => {
                if (notif.unread) markNotificationRead(notif.id);
              });
            }}
          >
            🔔
            {notifications.filter((n) => n.unread).length > 0 && (
              <span className="notification-badge">
                {notifications.filter((n) => n.unread).length}
              </span>
            )}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeView === "today" ? "active" : ""}`}
          onClick={() => setActiveView("today")}
        >
          📅 Today's Tasks
        </button>
        <button
          className={`nav-btn ${activeView === "history" ? "active" : ""}`}
          onClick={() => {
            setActiveView("history");
            if (taskHistory.length === 0) fetchTaskHistory();
          }}
        >
          📊 Task History
        </button>
        <button
          className={`nav-btn ${activeView === "profile" ? "active" : ""}`}
          onClick={() => setActiveView("profile")}
        >
          👤 My Profile
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">{renderContent()}</main>

      {/* Modals */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Task Details Modal */}
            {modalType === "taskDetails" && selectedTask && (
              <>
                <div className="modal-header">
                  <h2>Task Details</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-body">
                  <div className="task-detail-section">
                    <h3>{selectedTask.title}</h3>
                    <span
                      className={`priority ${selectedTask.priority.toLowerCase()}`}
                    >
                      {selectedTask.priority} Priority
                    </span>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Customer</label>
                      <p>{selectedTask.customer}</p>
                    </div>
                    <div className="detail-item">
                      <label>Address</label>
                      <p>{selectedTask.address}</p>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <p>{selectedTask.phone}</p>
                    </div>
                    <div className="detail-item">
                      <label>Scheduled Time</label>
                      <p>{selectedTask.scheduledTime}</p>
                    </div>
                  </div>

                  <div className="description-section">
                    <label>Description</label>
                    <p>
                      {selectedTask.description || "No description provided"}
                    </p>
                  </div>

                  {selectedTask.materials &&
                    selectedTask.materials.length > 0 && (
                      <div className="materials-section">
                        <label>Required Materials</label>
                        <ul>
                          {selectedTask.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                <div className="modal-footer">
                  <button onClick={() => setShowModal(false)}>Close</button>
                  {(selectedTask.status === "Pending" ||
                    selectedTask.status === "Assigned") && (
                    <button
                      className="btn-primary"
                      onClick={() => handleStartTask(selectedTask)}
                    >
                      Start Task
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Complete Task Modal */}
            {modalType === "completeTask" && selectedTask && (
              <>
                <div className="modal-header">
                  <h2>Complete Task</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCompleteTask}>
                  <div className="form-group">
                    <label>Task</label>
                    <p>{selectedTask.title}</p>
                  </div>

                  <div className="form-group">
                    <label>Completion Notes</label>
                    <textarea
                      name="notes"
                      rows="4"
                      placeholder="Add any notes about the completed work..."
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Materials Used</label>
                    <textarea
                      name="materials"
                      rows="3"
                      placeholder="List any materials used..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Additional Charges (if any)</label>
                    <input
                      type="number"
                      name="charges"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div className="modal-footer">
                    <button type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Complete Task
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Report Issue Modal */}
            {modalType === "reportIssue" && selectedTask && (
              <>
                <div className="modal-header">
                  <h2>Report Issue</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleReportIssue}>
                  <div className="form-group">
                    <label>Task</label>
                    <p>{selectedTask.title}</p>
                  </div>

                  <div className="form-group">
                    <label>Issue Type</label>
                    <select name="issueType" required>
                      <option value="">Select issue type</option>
                      <option value="access">Cannot access location</option>
                      <option value="materials">Materials not available</option>
                      <option value="scope">Work scope changed</option>
                      <option value="safety">Safety concerns</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      rows="4"
                      placeholder="Describe the issue in detail..."
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Action Required</label>
                    <select name="action" required>
                      <option value="">Select action</option>
                      <option value="reschedule">Reschedule task</option>
                      <option value="assistance">Need assistance</option>
                      <option value="manager">Contact manager</option>
                    </select>
                  </div>

                  <div className="modal-footer">
                    <button type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Report Issue
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricianDashboard;
