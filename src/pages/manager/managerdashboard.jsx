// ManagerDashboard.jsx - Refactored Version
import React, { useState } from "react";
import { useManagerData } from "./hooks/useManagerData";
import ManagerSidebar from "./components/ManagerSidebar";
import StatsCards from "./components/StatsCards";
import TaskManagementView from "./components/TaskManagementView";
import TeamView from "./components/TeamView";
import ReportsView from "./components/ReportsView";
import RecentTasks from "./components/RecentTasks";
// Removed TeamStatus import
import CreateTaskModal from "./components/modals/CreateTaskModal";
import AssignTaskModal from "./components/modals/AssignTaskModal";
import ViewTaskModal from "./components/modals/ViewTaskModal";
import EditTaskModal from "./components/modals/EditTaskModal";
import ViewProfileModal from "./components/modals/ViewProfileModal";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  // State management
  const [activeView, setActiveView] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedElectrician, setSelectedElectrician] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Use custom hook for data management
  const {
    loading,
    error,
    stats,
    tasks,
    filteredTasks,
    electricians,
    activities,
    activeFilter,
    userInfo,
    filterTasks,
    createTask,
    assignTask,
    updateTaskStatus,
    updateTask,
    generateReport,
  } = useManagerData();

  // Modal handlers
  const openModal = (type, data = null) => {
    setModalType(type);
    if (type === "assignTask") {
      setSelectedTask(data);
    } else if (type === "assignToElectrician") {
      setSelectedElectrician(data);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedTask(null);
    setSelectedElectrician(null);
  };

  // Task handlers
  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      alert(result.message);
    }
  };

  const handleAssignTask = async (taskId, electricianId) => {
    const result = await assignTask(taskId, electricianId);
    if (result.success) {
      alert(result.message);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    const result = await updateTask(taskId, taskData);
    if (result.success) {
      alert(result.message);
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    openModal("viewTask");
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalType("editTask");
    setShowModal(true);
  };

  const handleViewProfile = (electrician) => {
    setSelectedElectrician(electrician);
    setShowProfileModal(true);
  };

  // Removed handleAssignToElectrician handler

  // Logout handler
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  // Render content based on active view
  const renderContent = () => {
    if (loading && !tasks.length) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      );
    }

    switch (activeView) {
      case "overview":
        return (
          <div className="overview-content">
            <StatsCards stats={stats} />

            <div className="overview-sections">
              {/* Quick Actions Section */}
              <div className="quick-actions-section">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button
                    className="action-btn primary"
                    onClick={() => openModal("createTask")}
                  >
                    <i className="fas fa-plus"></i>
                    Create New Task
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setActiveView("tasks")}
                  >
                    <i className="fas fa-list"></i>
                    View All Tasks
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => setActiveView("team")}
                  >
                    <i className="fas fa-users"></i>
                    Manage Team
                  </button>
                </div>
              </div>

              {/* Recent Tasks Section */}
              <div className="recent-tasks-section">
                <RecentTasks tasks={tasks} onViewTask={handleViewTask} />
              </div>
            </div>
          </div>
        );

      case "tasks":
        return (
          <TaskManagementView
            tasks={tasks}
            filteredTasks={filteredTasks}
            activeFilter={activeFilter}
            onFilterChange={filterTasks}
            onCreateTask={() => openModal("createTask")}
            onAssignTask={(task) => openModal("assignTask", task)}
            onViewTask={handleViewTask}
            onEditTask={handleEditTask}
          />
        );

      case "team":
        return (
          <TeamView
            electricians={electricians}
            onViewProfile={handleViewProfile}
          />
        );

      case "reports":
        return <ReportsView onGenerateReport={generateReport} />;

      default:
        return null;
    }
  };

  return (
    <div className="manager-dashboard">
      <ManagerSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        userInfo={userInfo}
        onLogout={handleLogout}
      />

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
              🔔 <span className="badge">{activities.length}</span>
            </button>
            <button
              className="quick-task-btn"
              onClick={() => openModal("createTask")}
            >
              + Quick Task
            </button>
          </div>
        </header>

        <div className="content-wrapper">
          {error && <div className="error-message">{error}</div>}
          {renderContent()}
        </div>
      </main>

      {/* Modals */}
      {showModal && modalType === "createTask" && (
        <CreateTaskModal onClose={closeModal} onCreate={handleCreateTask} />
      )}

      {showModal && modalType === "assignTask" && selectedTask && (
        <AssignTaskModal
          task={selectedTask}
          electricians={electricians}
          onClose={closeModal}
          onAssign={handleAssignTask}
        />
      )}

      {showModal && modalType === "viewTask" && selectedTask && (
        <ViewTaskModal
          task={selectedTask}
          onClose={closeModal}
          onEdit={handleEditTask}
        />
      )}

      {showModal && modalType === "editTask" && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={closeModal}
          onUpdate={handleUpdateTask}
        />
      )}

      {/* View Profile Modal */}
      {showProfileModal && selectedElectrician && (
        <ViewProfileModal
          electrician={selectedElectrician}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedElectrician(null);
          }}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
