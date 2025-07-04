// ManagerDashboard.jsx
import { useState, useEffect } from "react";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  // State management
  const [activeView, setActiveView] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedElectrician, setSelectedElectrician] = useState("");

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalTasks: 156,
    assignedToday: 12,
    inProgress: 24,
    completed: 98,
    pending: 34,
    teamSize: 8,
    activeElectricians: 6,
    avgCompletionTime: "3.5 hrs",
  });

  // Tasks data
  const [tasks, setTasks] = useState([
    {
      id: "T001",
      title: "Fix electrical outlet - Main Office",
      customer: "ABC Company Ltd",
      address: "123 Galle Road, Kandy",
      priority: "High",
      status: "Pending",
      assignedTo: null,
      createdAt: "2024-01-15 09:00",
      dueDate: "2024-01-15 14:00",
      estimatedHours: 2,
      description: "Multiple outlets not working in the main office area",
    },
    {
      id: "T002",
      title: "Install new lighting system",
      customer: "Green Gardens Hotel",
      address: "45 Lake View Road, Kandy",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "John Smith",
      createdAt: "2024-01-15 08:30",
      dueDate: "2024-01-16 17:00",
      estimatedHours: 6,
      description: "Install LED lighting in the restaurant area",
    },
    {
      id: "T003",
      title: "Emergency repair - Power outage",
      customer: "Residence - Mr. Silva",
      address: "78 Temple Street, Kandy",
      priority: "High",
      status: "Assigned",
      assignedTo: "Mike Wilson",
      createdAt: "2024-01-15 10:30",
      dueDate: "2024-01-15 13:00",
      estimatedHours: 1.5,
      description: "Complete power outage in residential building",
    },
    {
      id: "T004",
      title: "Routine maintenance check",
      customer: "City Mall",
      address: "10 Main Street, Kandy",
      priority: "Low",
      status: "Completed",
      assignedTo: "Sarah Johnson",
      createdAt: "2024-01-14 14:00",
      dueDate: "2024-01-15 10:00",
      estimatedHours: 3,
      completedAt: "2024-01-15 09:45",
      description: "Monthly electrical system maintenance",
    },
  ]);

  // Electricians data
  const [electricians, setElectricians] = useState([
    {
      id: 1,
      name: "John Smith",
      status: "Available",
      currentTask: null,
      tasksToday: 3,
      tasksCompleted: 2,
      phone: "+94 77 123 4567",
      skills: ["Residential", "Commercial", "Emergency"],
      rating: 4.8,
    },
    {
      id: 2,
      name: "Mike Wilson",
      status: "On Task",
      currentTask: "T003",
      tasksToday: 4,
      tasksCompleted: 2,
      phone: "+94 77 234 5678",
      skills: ["Industrial", "Emergency", "Maintenance"],
      rating: 4.6,
    },
    {
      id: 3,
      name: "David Brown",
      status: "Available",
      currentTask: null,
      tasksToday: 2,
      tasksCompleted: 2,
      phone: "+94 77 345 6789",
      skills: ["Residential", "Solar", "Maintenance"],
      rating: 4.9,
    },
    {
      id: 4,
      name: "Tom Lee",
      status: "Break",
      currentTask: null,
      tasksToday: 3,
      tasksCompleted: 1,
      phone: "+94 77 456 7890",
      skills: ["Commercial", "Industrial"],
      rating: 4.5,
    },
    {
      id: 5,
      name: "Robert Chen",
      status: "On Task",
      currentTask: "T002",
      tasksToday: 2,
      tasksCompleted: 0,
      phone: "+94 77 567 8901",
      skills: ["Residential", "Emergency"],
      rating: 4.7,
    },
    {
      id: 6,
      name: "Peter Kumar",
      status: "Offline",
      currentTask: null,
      tasksToday: 0,
      tasksCompleted: 0,
      phone: "+94 77 678 9012",
      skills: ["Commercial", "Maintenance"],
      rating: 4.4,
    },
  ]);

  // Task form data
  const [taskForm, setTaskForm] = useState({
    title: "",
    customer: "",
    address: "",
    phone: "",
    priority: "Medium",
    dueDate: "",
    estimatedHours: "",
    description: "",
  });

  // Handle form changes
  const handleFormChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  // Create new task
  const handleCreateTask = (e) => {
    e.preventDefault();

    const newTask = {
      id: `T${String(tasks.length + 1).padStart(3, "0")}`,
      ...taskForm,
      status: "Pending",
      assignedTo: null,
      createdAt: new Date().toLocaleString(),
    };

    setTasks([newTask, ...tasks]);
    setShowModal(false);
    resetForm();
    alert("Task created successfully!");
  };

  // Assign task to electrician
  const handleAssignTask = (taskId, electricianName) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: "Assigned", assignedTo: electricianName }
          : task
      )
    );

    // Update electrician status
    setElectricians(
      electricians.map((elec) =>
        elec.name === electricianName
          ? { ...elec, status: "On Task", currentTask: taskId }
          : elec
      )
    );

    setShowModal(false);
    alert(`Task assigned to ${electricianName}`);
  };

  // Update task status
  const handleStatusUpdate = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Reset form
  const resetForm = () => {
    setTaskForm({
      title: "",
      customer: "",
      address: "",
      phone: "",
      priority: "Medium",
      dueDate: "",
      estimatedHours: "",
      description: "",
    });
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/login";
    }
  };

  // Calculate task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const assigned = tasks.filter((t) => t.status === "Assigned").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;

    return { total, pending, assigned, inProgress, completed };
  };

  // Render main content
  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>{stats.totalTasks}</h3>
                  <p>Total Tasks</p>
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.completed}</h3>
                  <p>Completed</p>
                </div>
              </div>

              <div className="stat-card orange">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{stats.inProgress}</h3>
                  <p>In Progress</p>
                </div>
              </div>

              <div className="stat-card red">
                <div className="stat-icon">🔔</div>
                <div className="stat-info">
                  <h3>{stats.pending}</h3>
                  <p>Pending</p>
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-icon">👷</div>
                <div className="stat-info">
                  <h3>{stats.activeElectricians}</h3>
                  <p>Active Team</p>
                </div>
              </div>

              <div className="stat-card teal">
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
                        <span className="task-id">{task.id}</span>
                        <span
                          className={`priority ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <h4>{task.title}</h4>
                      <p>
                        {task.customer} • {task.address}
                      </p>
                      <div className="task-footer">
                        <span
                          className={`status ${task.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {task.status}
                        </span>
                        <span className="due-date">Due: {task.dueDate}</span>
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
                      <td>{task.id}</td>
                      <td>
                        <div className="task-title">
                          <strong>{task.title}</strong>
                          <small>{task.address}</small>
                        </div>
                      </td>
                      <td>{task.customer}</td>
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
                      <td>{task.assignedTo || "-"}</td>
                      <td>{task.dueDate}</td>
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
                      ⭐ {electrician.rating}
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
                      <span>Completed</span>
                      <strong>{electrician.tasksCompleted}</strong>
                    </div>
                  </div>

                  <div className="skills">
                    {electrician.skills.map((skill, index) => (
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
                <button className="generate-btn">Generate Report</button>
              </div>

              <div className="report-card">
                <div className="report-icon">📈</div>
                <h3>Team Performance</h3>
                <p>Individual and team productivity metrics</p>
                <button className="generate-btn">Generate Report</button>
              </div>

              <div className="report-card">
                <div className="report-icon">⏰</div>
                <h3>Task Timeline Analysis</h3>
                <p>Average completion times and delays</p>
                <button className="generate-btn">Generate Report</button>
              </div>

              <div className="report-card">
                <div className="report-icon">👥</div>
                <h3>Customer Feedback</h3>
                <p>Service quality and customer satisfaction</p>
                <button className="generate-btn">Generate Report</button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <h3>This Week's Performance</h3>
              <div className="stats-row">
                <div className="stat-item">
                  <h4>156</h4>
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
                        name="customer"
                        value={taskForm.customer}
                        onChange={handleFormChange}
                        required
                        placeholder="Customer or company name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number*</label>
                      <input
                        type="tel"
                        name="phone"
                        value={taskForm.phone}
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
                      name="address"
                      value={taskForm.address}
                      onChange={handleFormChange}
                      required
                      placeholder="Full address"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Due Date*</label>
                      <input
                        type="datetime-local"
                        name="dueDate"
                        value={taskForm.dueDate}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Estimated Hours*</label>
                      <input
                        type="number"
                        name="estimatedHours"
                        value={taskForm.estimatedHours}
                        onChange={handleFormChange}
                        required
                        step="0.5"
                        min="0.5"
                        placeholder="2.5"
                      />
                    </div>
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
                    {selectedTask.customer} • {selectedTask.address}
                  </p>
                  <div className="task-meta">
                    <span
                      className={`priority ${selectedTask.priority.toLowerCase()}`}
                    >
                      {selectedTask.priority} Priority
                    </span>
                    <span>Due: {selectedTask.dueDate}</span>
                    <span>Est: {selectedTask.estimatedHours} hours</span>
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
                              {electrician.rating}
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
