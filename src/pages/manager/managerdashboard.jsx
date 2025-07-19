// ManagerDashboard.jsx
import { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboard";
import { tasksService } from "../../services/tasks";
import { usersService } from "../../services/users";
import { authService } from "../../services/auth";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  // State management
  const [activeView, setActiveView] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedElectrician, setSelectedElectrician] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalTasks: 0,
    assignedToday: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
    teamSize: 0,
    activeElectricians: 0,
    avgCompletionTime: "0 hrs",
  });

  // Tasks data
  const [tasks, setTasks] = useState([]);

  // Electricians data
  const [electricians, setElectricians] = useState([]);

  // Task form data
  const [taskForm, setTaskForm] = useState({
    title: "",
    customer_name: "",
    customer_address: "",
    customer_phone: "",
    priority: "Medium",
    scheduled_date: "",
    scheduled_time_start: "",
    scheduled_time_end: "",
    estimated_hours: "",
    description: "",
    materials: [],
  });

  // Load data when component mounts
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);

    try {
      // Load stats
      const statsResponse = await dashboardService.getStats();
      if (statsResponse.success) {
        setStats({
          totalTasks: statsResponse.data.totalTasks || 0,
          assignedToday: statsResponse.data.assignedToday || 0,
          inProgress: statsResponse.data.inProgress || 0,
          completed: statsResponse.data.completed || 0,
          pending: statsResponse.data.pending || 0,
          teamSize: statsResponse.data.teamSize || 0,
          activeElectricians: statsResponse.data.activeElectricians || 0,
          avgCompletionTime: `${statsResponse.data.avgCompletionTime || 0} hrs`,
        });
      }

      // Load tasks
      const tasksResponse = await tasksService.getAll();
      if (tasksResponse.success) {
        setTasks(tasksResponse.data);
      }

      // Load electricians
      const electriciansResponse = await usersService.getElectricians();
      if (electriciansResponse.success) {
        const formattedElectricians = electriciansResponse.data.map((elec) => ({
          id: elec.id,
          name: elec.full_name,
          status:
            elec.current_tasks > 0
              ? "On Task"
              : elec.status === "Active"
              ? "Available"
              : "Offline",
          currentTask: null,
          tasksToday: elec.current_tasks || 0,
          tasksCompleted: elec.total_tasks_completed || 0,
          phone: elec.phone,
          skills: elec.skills
            ? elec.skills.split(",").map((s) => s.trim())
            : [],
          rating: parseFloat(elec.rating) || 0,
        }));
        setElectricians(formattedElectricians);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form changes
  const handleFormChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  // Create new task
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const response = await tasksService.create(taskForm);

      if (response.success) {
        // Reload tasks
        await loadDashboardData();

        setShowModal(false);
        resetForm();
        alert("Task created successfully!");
      }
    } catch (error) {
      alert("Error creating task: " + error.message);
    }
  };

  // Assign task to electrician
  const handleAssignTask = async (taskId, electricianName) => {
    try {
      const electrician = electricians.find((e) => e.name === electricianName);
      if (!electrician) {
        alert("Please select an electrician");
        return;
      }

      const response = await tasksService.assign(taskId, electrician.id);

      if (response.success) {
        await loadDashboardData();
        setShowModal(false);
        alert(`Task assigned to ${electricianName}`);
      }
    } catch (error) {
      alert("Error assigning task: " + error.message);
    }
  };

  // Update task status
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await tasksService.updateStatus(taskId, newStatus);

      if (response.success) {
        await loadDashboardData();
      }
    } catch (error) {
      alert("Error updating task: " + error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setTaskForm({
      title: "",
      customer_name: "",
      customer_address: "",
      customer_phone: "",
      priority: "Medium",
      scheduled_date: "",
      scheduled_time_start: "",
      scheduled_time_end: "",
      estimated_hours: "",
      description: "",
      materials: [],
    });
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      authService.logout();
    }
  };

  // Generate report
  const handleGenerateReport = async (reportType) => {
    try {
      const response = await dashboardService.generateReport({
        report_type: reportType,
        start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
      });

      if (response.success) {
        alert("Report generated successfully!");
      }
    } catch (error) {
      alert("Error generating report: " + error.message);
    }
  };

  // Render main content
  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return (
          <>
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-box blue">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>{stats.totalTasks}</h3>
                  <p>Total Tasks</p>
                </div>
              </div>

              <div className="stat-box green">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.completed}</h3>
                  <p>Completed</p>
                </div>
              </div>

              <div className="stat-box orange">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{stats.inProgress}</h3>
                  <p>In Progress</p>
                </div>
              </div>

              <div className="stat-box red">
                <div className="stat-icon">🔔</div>
                <div className="stat-info">
                  <h3>{stats.pending}</h3>
                  <p>Pending</p>
                </div>
              </div>

              <div className="stat-box purple">
                <div className="stat-icon">👷</div>
                <div className="stat-info">
                  <h3>{stats.activeElectricians}</h3>
                  <p>Active Team</p>
                </div>
              </div>

              <div className="stat-box teal">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <h3>{stats.avgCompletionTime}</h3>
                  <p>Avg Time</p>
                </div>
              </div>
            </div>

            {/* Quick Overview */}
            <div className="overview-grid">
              {/* Recent Tasks */}
              <div className="overview-card">
                <h3>Recent Tasks</h3>
                <div className="task-list">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="task-item">
                      <div className="task-header">
                        <span className="task-id">#{task.id}</span>
                        <span
                          className={`priority ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <h4>{task.title}</h4>
                      <p>
                        {task.customer_name} • {task.customer_address}
                      </p>
                      <div className="task-footer">
                        <span
                          className={`status ${task.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {task.status}
                        </span>
                        <span className="due-date">
                          Due:{" "}
                          {new Date(task.scheduled_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Status */}
              <div className="overview-card">
                <h3>Team Status</h3>
                <div className="team-status">
                  {electricians.map((electrician) => (
                    <div key={electrician.id} className="team-member">
                      <div className="member-info">
                        <div className="member-avatar">
                          {electrician.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h4>{electrician.name}</h4>
                          <p>
                            Tasks: {electrician.tasksCompleted}/
                            {electrician.tasksToday}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`member-status ${electrician.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {electrician.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case "tasks":
        return (
          <div className="tasks-view">
            <div className="view-header">
              <h2>Task Management</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  setModalType("createTask");
                  setShowModal(true);
                }}
              >
                + Create New Task
              </button>
            </div>

            {/* Task Filters */}
            <div className="task-filters">
              <button className="filter-btn active">All Tasks</button>
              <button className="filter-btn">Pending</button>
              <button className="filter-btn">Assigned</button>
              <button className="filter-btn">In Progress</button>
              <button className="filter-btn">Completed</button>
            </div>

            {/* Tasks Table */}
            <div className="tasks-table">
              <table>
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Title</th>
                    <th>Customer</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>#{task.id}</td>
                      <td>
                        <div className="task-title">
                          <strong>{task.title}</strong>
                          <small>{task.customer_address}</small>
                        </div>
                      </td>
                      <td>{task.customer_name}</td>
                      <td>
                        <span
                          className={`priority ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status ${task.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>{task.assigned_electrician || "-"}</td>
                      <td>
                        {new Date(task.scheduled_date).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {task.status === "Pending" && (
                            <button
                              className="btn-assign"
                              onClick={() => {
                                setSelectedTask(task);
                                setModalType("assignTask");
                                setShowModal(true);
                              }}
                            >
                              Assign
                            </button>
                          )}
                          <button className="btn-view">View</button>
                          <button className="btn-edit">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="team-view">
            <h2>Team Management</h2>

            <div className="team-grid">
              {electricians.map((electrician) => (
                <div key={electrician.id} className="electrician-card">
                  <div className="electrician-header">
                    <div className="electrician-avatar">
                      {electrician.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="electrician-rating">
                      ⭐ {electrician.rating.toFixed(1)}
                    </div>
                  </div>

                  <h3>{electrician.name}</h3>
                  <p className="electrician-phone">📱 {electrician.phone}</p>

                  <div className="electrician-status">
                    <span
                      className={`status ${electrician.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {electrician.status}
                    </span>
                    {electrician.currentTask && (
                      <span className="current-task">
                        Task: {electrician.currentTask}
                      </span>
                    )}
                  </div>

                  <div className="electrician-stats">
                    <div className="stat">
                      <span>Today</span>
                      <strong>
                        {electrician.tasksCompleted}/{electrician.tasksToday}
                      </strong>
                    </div>
                    <div className="stat">
                      <span>Total</span>
                      <strong>{electrician.tasksCompleted}</strong>
                    </div>
                  </div>

                  <div className="skills">
                    {electrician.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="electrician-actions">
                    <button>View Profile</button>
                    <button>Assign Task</button>
                    <button>Contact</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="reports-view">
            <h2>Reports & Analytics</h2>

            <div className="reports-grid">
              <div className="report-card">
                <div className="report-icon">📊</div>
                <h3>Daily Task Report</h3>
                <p>Summary of today's task assignments and completions</p>
                <button
                  className="generate-btn"
                  onClick={() => handleGenerateReport("task_analytics")}
                >
                  Generate Report
                </button>
              </div>

              <div className="report-card">
                <div className="report-icon">📈</div>
                <h3>Team Performance</h3>
                <p>Individual and team productivity metrics</p>
                <button
                  className="generate-btn"
                  onClick={() => handleGenerateReport("user_performance")}
                >
                  Generate Report
                </button>
              </div>

              <div className="report-card">
                <div className="report-icon">⏰</div>
                <h3>Task Timeline Analysis</h3>
                <p>Average completion times and delays</p>
                <button
                  className="generate-btn"
                  onClick={() => handleGenerateReport("task_analytics")}
                >
                  Generate Report
                </button>
              </div>

              <div className="report-card">
                <div className="report-icon">👥</div>
                <h3>Customer Feedback</h3>
                <p>Service quality and customer satisfaction</p>
                <button
                  className="generate-btn"
                  onClick={() => handleGenerateReport("customer_satisfaction")}
                >
                  Generate Report
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <h3>This Week's Performance</h3>
              <div className="stats-row">
                <div className="stat-item">
                  <h4>{stats.completed}</h4>
                  <p>Tasks Completed</p>
                </div>
                <div className="stat-item">
                  <h4>98%</h4>
                  <p>On-Time Delivery</p>
                </div>
                <div className="stat-item">
                  <h4>4.8</h4>
                  <p>Avg Rating</p>
                </div>
                <div className="stat-item">
                  <h4>24</h4>
                  <p>Active Customers</p>
                </div>
              </div>
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

  return (
    <div className="manager-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <h2>Manager Portal</h2>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${activeView === "overview" ? "active" : ""}`}
            onClick={() => setActiveView("overview")}
          >
            <span>📊</span> Overview
          </button>

          <button
            className={`nav-item ${activeView === "tasks" ? "active" : ""}`}
            onClick={() => setActiveView("tasks")}
          >
            <span>📋</span> Tasks
          </button>

          <button
            className={`nav-item ${activeView === "team" ? "active" : ""}`}
            onClick={() => setActiveView("team")}
          >
            <span>👥</span> Team
          </button>

          <button
            className={`nav-item ${activeView === "reports" ? "active" : ""}`}
            onClick={() => setActiveView("reports")}
          >
            <span>📈</span> Reports
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="manager-info">
            <div className="manager-avatar">MG</div>
            <div>
              <p className="manager-name">Manager User</p>
              <p className="manager-email">manager@company.com</p>
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
          <div>
            <h1>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
            <p className="date-time">
              {new Date().toLocaleDateString()} • Kandy Branch
            </p>
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              🔔 <span className="badge">5</span>
            </button>
            <button
              className="quick-task-btn"
              onClick={() => {
                setModalType("createTask");
                setShowModal(true);
              }}
            >
              + Quick Task
            </button>
          </div>
        </header>

        <div className="content-wrapper">{renderContent()}</div>
      </main>

      {/* Modals */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Create Task Modal */}
            {modalType === "createTask" && (
              <>
                <div className="modal-header">
                  <h2>Create New Task</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateTask}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Task Title*</label>
                      <input
                        type="text"
                        name="title"
                        value={taskForm.title}
                        onChange={handleFormChange}
                        required
                        placeholder="Brief description of the task"
                      />
                    </div>

                    <div className="form-group">
                      <label>Priority*</label>
                      <select
                        name="priority"
                        value={taskForm.priority}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Customer Name*</label>
                      <input
                        type="text"
                        name="customer_name"
                        value={taskForm.customer_name}
                        onChange={handleFormChange}
                        required
                        placeholder="Customer or company name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number*</label>
                      <input
                        type="tel"
                        name="customer_phone"
                        value={taskForm.customer_phone}
                        onChange={handleFormChange}
                        required
                        placeholder="+94 XX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address*</label>
                    <input
                      type="text"
                      name="customer_address"
                      value={taskForm.customer_address}
                      onChange={handleFormChange}
                      required
                      placeholder="Full address"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Scheduled Date*</label>
                      <input
                        type="date"
                        name="scheduled_date"
                        value={taskForm.scheduled_date}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Start Time*</label>
                      <input
                        type="time"
                        name="scheduled_time_start"
                        value={taskForm.scheduled_time_start}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>End Time*</label>
                      <input
                        type="time"
                        name="scheduled_time_end"
                        value={taskForm.scheduled_time_end}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Estimated Hours*</label>
                    <input
                      type="number"
                      name="estimated_hours"
                      value={taskForm.estimated_hours}
                      onChange={handleFormChange}
                      required
                      step="0.5"
                      min="0.5"
                      placeholder="2.5"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={taskForm.description}
                      onChange={handleFormChange}
                      rows="4"
                      placeholder="Detailed description of the work required..."
                    ></textarea>
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Create Task
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Assign Task Modal */}
            {modalType === "assignTask" && selectedTask && (
              <>
                <div className="modal-header">
                  <h2>Assign Task</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="task-details">
                  <h3>{selectedTask.title}</h3>
                  <p>
                    {selectedTask.customer_name} •{" "}
                    {selectedTask.customer_address}
                  </p>
                  <div className="task-meta">
                    <span
                      className={`priority ${selectedTask.priority.toLowerCase()}`}
                    >
                      {selectedTask.priority} Priority
                    </span>
                    <span>
                      Due:{" "}
                      {new Date(
                        selectedTask.scheduled_date
                      ).toLocaleDateString()}
                    </span>
                    <span>Est: {selectedTask.estimated_hours} hours</span>
                  </div>
                </div>

                <div className="electrician-list">
                  <h4>Select Electrician</h4>
                  {electricians
                    .filter((e) => e.status === "Available")
                    .map((electrician) => (
                      <div
                        key={electrician.id}
                        className={`electrician-option ${
                          selectedElectrician === electrician.name
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => setSelectedElectrician(electrician.name)}
                      >
                        <div className="electrician-info">
                          <div className="avatar">
                            {electrician.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h5>{electrician.name}</h5>
                            <p>
                              Tasks today: {electrician.tasksCompleted}/
                              {electrician.tasksToday} • Rating: ⭐{" "}
                              {electrician.rating.toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <div className="skills-mini">
                          {electrician.skills.slice(0, 2).map((skill, i) => (
                            <span key={i}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="modal-actions">
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                  <button
                    className="btn-primary"
                    disabled={!selectedElectrician}
                    onClick={() =>
                      handleAssignTask(selectedTask.id, selectedElectrician)
                    }
                  >
                    Assign Task
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
