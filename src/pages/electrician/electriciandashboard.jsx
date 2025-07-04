// ElectricianDashboard.jsx
import { useState, useEffect } from "react";
import "./ElectricianDashboard.css";

const ElectricianDashboard = () => {
  // State management
  const [activeView, setActiveView] = useState("today");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  // User info (would come from auth/context in real app)
  const [userInfo] = useState({
    name: "John Smith",
    id: "ELC001",
    email: "john.smith@company.com",
    phone: "+94 77 123 4567",
    rating: 4.8,
    joinDate: "2023-05-15",
  });

  // Dashboard statistics
  const [stats, setStats] = useState({
    todayTasks: 5,
    completedToday: 2,
    inProgress: 1,
    totalCompleted: 145,
    thisWeek: 18,
    thisMonth: 72,
    avgRating: 4.8,
    onTimeRate: 96,
  });

  // Today's tasks
  const [todayTasks, setTodayTasks] = useState([
    {
      id: "T001",
      title: "Fix electrical outlet - Main Office",
      customer: "ABC Company Ltd",
      address: "123 Galle Road, Kandy",
      phone: "+94 77 987 6543",
      priority: "High",
      status: "Pending",
      scheduledTime: "09:00 AM - 11:00 AM",
      estimatedHours: 2,
      description:
        "Multiple outlets not working in the main office area. Need to check wiring and replace faulty outlets.",
      materials: ["Outlets x3", "Wire nuts", "Electrical tape"],
    },
    {
      id: "T003",
      title: "Emergency repair - Power outage",
      customer: "Residence - Mr. Silva",
      address: "78 Temple Street, Kandy",
      phone: "+94 77 456 7890",
      priority: "High",
      status: "In Progress",
      scheduledTime: "11:30 AM - 01:00 PM",
      estimatedHours: 1.5,
      startTime: "11:45 AM",
      description:
        "Complete power outage in residential building. Suspected main breaker issue.",
      materials: ["Circuit breaker", "Testing equipment"],
    },
    {
      id: "T005",
      title: "Install new ceiling fan",
      customer: "Ms. Perera",
      address: "45 Lake Road, Kandy",
      phone: "+94 77 234 5678",
      priority: "Medium",
      status: "Completed",
      scheduledTime: "02:00 PM - 03:30 PM",
      estimatedHours: 1.5,
      completedTime: "03:15 PM",
      description:
        "Install ceiling fan in master bedroom. Customer has already purchased the fan.",
      materials: ["Mounting bracket", "Wire connectors"],
      rating: 5,
      feedback: "Excellent work! Very professional.",
    },
    {
      id: "T007",
      title: "Routine maintenance check",
      customer: "Green Gardens Hotel",
      address: "10 Hotel Street, Kandy",
      phone: "+94 77 345 6789",
      priority: "Low",
      status: "Pending",
      scheduledTime: "04:00 PM - 06:00 PM",
      estimatedHours: 2,
      description:
        "Monthly electrical system maintenance. Check all main panels and emergency lighting.",
      materials: ["Testing equipment", "Replacement bulbs"],
    },
    {
      id: "T008",
      title: "Fix outdoor lighting",
      customer: "City Mall",
      address: "55 Main Street, Kandy",
      phone: "+94 77 567 8901",
      priority: "Medium",
      status: "Completed",
      scheduledTime: "07:00 AM - 08:30 AM",
      estimatedHours: 1.5,
      completedTime: "08:15 AM",
      description: "Repair outdoor security lighting in parking area.",
      materials: ["LED bulbs x4", "Photocell sensor"],
      rating: 4,
      feedback: "Good service, arrived on time.",
    },
  ]);

  // Task history
  const [taskHistory, setTaskHistory] = useState([
    {
      id: "T100",
      date: "2024-01-14",
      title: "Install power outlets",
      customer: "Tech Solutions Ltd",
      status: "Completed",
      rating: 5,
      earnings: 8500,
    },
    {
      id: "T099",
      date: "2024-01-14",
      title: "Emergency repair",
      customer: "Mr. Fernando",
      status: "Completed",
      rating: 5,
      earnings: 5500,
    },
    {
      id: "T098",
      date: "2024-01-13",
      title: "LED lighting upgrade",
      customer: "Sunshine Restaurant",
      status: "Completed",
      rating: 4,
      earnings: 12000,
    },
    {
      id: "T097",
      date: "2024-01-13",
      title: "Fix circuit breaker",
      customer: "Ms. Jayawardena",
      status: "Completed",
      rating: 5,
      earnings: 3500,
    },
  ]);

  // Notifications
  const [notifications] = useState([
    {
      id: 1,
      type: "task",
      message: "New task assigned: Emergency repair at Temple Street",
      time: "30 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "reminder",
      message: "Task T007 scheduled in 2 hours",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "rating",
      message: "Customer rated your service 5 stars",
      time: "2 hours ago",
      unread: false,
    },
  ]);

  // Update task status
  const updateTaskStatus = (taskId, newStatus, additionalData = {}) => {
    setTodayTasks(
      todayTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, status: newStatus, ...additionalData };

          // Update stats based on status change
          if (newStatus === "In Progress" && task.status !== "In Progress") {
            setStats((prev) => ({ ...prev, inProgress: prev.inProgress + 1 }));
          } else if (newStatus === "Completed" && task.status !== "Completed") {
            setStats((prev) => ({
              ...prev,
              completedToday: prev.completedToday + 1,
              inProgress: prev.inProgress - 1,
            }));
          }

          return updatedTask;
        }
        return task;
      })
    );

    setShowModal(false);
  };

  // Start task
  const handleStartTask = (task) => {
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    updateTaskStatus(task.id, "In Progress", { startTime: currentTime });
    alert(`Task "${task.title}" started at ${currentTime}`);
  };

  // Complete task
  const handleCompleteTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const completionData = {
      completedTime: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      completionNotes: formData.get("notes"),
      materialsUsed: formData.get("materials"),
      additionalCharges: formData.get("charges"),
    };

    updateTaskStatus(selectedTask.id, "Completed", completionData);
    alert("Task completed successfully!");
  };

  // Handle report issue
  const handleReportIssue = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    alert(
      `Issue reported: ${formData.get("issueType")} - ${formData.get(
        "description"
      )}`
    );
    setShowModal(false);
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const total = todayTasks.length;
    const completed = todayTasks.filter((t) => t.status === "Completed").length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Get task by status
  const getTasksByStatus = (status) => {
    return todayTasks.filter((task) => task.status === status);
  };

  // Render main content
  const renderContent = () => {
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
                  <div className="stat-value">
                    {stats.todayTasks - stats.completedToday - stats.inProgress}
                  </div>
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
                  {getTasksByStatus("Pending").map((task) => (
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
                  ))}
                </div>
              </div>

              {/* In Progress */}
              <div className="task-category">
                <h3>⚡ In Progress</h3>
                <div className="task-list">
                  {getTasksByStatus("In Progress").map((task) => (
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
                        <span>🕐 Started: {task.startTime}</span>
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
                  ))}
                </div>
              </div>

              {/* Completed */}
              <div className="task-category">
                <h3>✅ Completed Today</h3>
                <div className="task-list">
                  {getTasksByStatus("Completed").map((task) => (
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
                        <span>✅ Completed: {task.completedTime}</span>
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
                  ))}
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
                <h3>{stats.thisMonth}</h3>
                <p>This Month</p>
              </div>
              <div className="stat-card">
                <h3>{stats.thisWeek}</h3>
                <p>This Week</p>
              </div>
              <div className="stat-card">
                <h3>{stats.avgRating} ⭐</h3>
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
                    <th>Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {taskHistory.map((task) => (
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
                      <td>{"⭐".repeat(task.rating)}</td>
                      <td>Rs. {task.earnings.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Monthly Summary */}
            <div className="monthly-summary">
              <h3>Monthly Performance</h3>
              <div className="performance-grid">
                <div className="performance-item">
                  <h4>Tasks Completed</h4>
                  <p>{stats.thisMonth}</p>
                </div>
                <div className="performance-item">
                  <h4>On-Time Rate</h4>
                  <p>{stats.onTimeRate}%</p>
                </div>
                <div className="performance-item">
                  <h4>Customer Satisfaction</h4>
                  <p>{stats.avgRating}/5.0</p>
                </div>
                <div className="performance-item">
                  <h4>Total Earnings</h4>
                  <p>Rs. 125,500</p>
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
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="profile-info">
                  <h3>{userInfo.name}</h3>
                  <p>Employee ID: {userInfo.id}</p>
                  <p>⭐ {userInfo.rating} Rating</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-group">
                  <label>Email</label>
                  <p>{userInfo.email}</p>
                </div>
                <div className="detail-group">
                  <label>Phone</label>
                  <p>{userInfo.phone}</p>
                </div>
                <div className="detail-group">
                  <label>Join Date</label>
                  <p>{userInfo.joinDate}</p>
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
                  <div className="metric-value">{stats.thisMonth}</div>
                  <p>Tasks Completed</p>
                </div>
                <div className="metric">
                  <h4>On-Time Rate</h4>
                  <div className="metric-value">{stats.onTimeRate}%</div>
                  <p>Punctuality</p>
                </div>
                <div className="metric">
                  <h4>Avg Rating</h4>
                  <div className="metric-value">{stats.avgRating}</div>
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
          <p>Welcome back, {userInfo.name}</p>
        </div>
        <div className="header-right">
          <button className="notification-btn">
            🔔
            <span className="notification-badge">
              {notifications.filter((n) => n.unread).length}
            </span>
          </button>
          <button
            className="logout-btn"
            onClick={() => (window.location.href = "/login")}
          >
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
          onClick={() => setActiveView("history")}
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
                    <p>{selectedTask.description}</p>
                  </div>

                  <div className="materials-section">
                    <label>Required Materials</label>
                    <ul>
                      {selectedTask.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="modal-footer">
                  <button onClick={() => setShowModal(false)}>Close</button>
                  {selectedTask.status === "Pending" && (
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
