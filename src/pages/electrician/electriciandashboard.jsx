// ElectricianDashboard.jsx - Refactored Version
import React, { useState } from "react";
import { useElectricianData } from "./hooks/useElectricianData";
import DashboardHeader from "./components/DashboardHeader";
import DashboardNav from "./components/DashboardNav";
import TodayTasksView from "./components/TodayTasksView";
import TaskHistoryView from "./components/TaskHistoryView";
import ProfileView from "./components/ProfileView";
import TaskDetailsModal from "./components/modals/TaskDetailsModal";
import CompleteTaskModal from "./components/modals/CompleteTaskModal";
import ReportIssueModal from "./components/modals/ReportIssueModal";
import "./ElectricianDashboard.css";

const ElectricianDashboard = () => {
  // State management
  const [activeView, setActiveView] = useState("today");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  // Use custom hook for data management
  const {
    loading,
    error,
    stats,
    todayTasks,
    taskHistory,
    notifications,
    userInfo,
    userProfile,
    fetchDashboardStats,
    fetchTodayTasks,
    fetchTaskHistory,
    updateTaskStatus,
    markNotificationRead,
    setError,
  } = useElectricianData();

  // Handle view change
  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === "history") {
      fetchTaskHistory();
    }
  };

  // Handle notifications click
  const handleNotificationsClick = () => {
    notifications.forEach((notif) => {
      if (notif.unread) markNotificationRead(notif.id);
    });
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  // Task action handlers
  const handleStartTask = async (task) => {
    try {
      const result = await updateTaskStatus(task.taskId, "In Progress");
      alert(result.message);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCompleteTask = async (task, completionData) => {
    try {
      const result = await updateTaskStatus(
        task.taskId,
        "Completed",
        completionData
      );
      setShowModal(false);
      alert(result.message);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReportIssue = async (task, issueData) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        task_id: task.taskId || task.id, // Use taskId which is the numeric ID
        issue_type: issueData.issueType,
        description: issueData.description,
        priority: issueData.priority || "normal",
        requested_action: issueData.action,
      };
      
      console.log("Reporting issue with payload:", payload);
      console.log("Task object:", task);
      
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Issue creation failed:", errorData);
        throw new Error(errorData.message || "Failed to report issue");
      }

      const result = await response.json();
      
      if (result.success) {
        alert("Issue reported successfully! Manager has been notified.");
        setShowModal(false);
        // Refresh data to update UI
        await fetchTodayTasks();
      } else {
        throw new Error(result.message || "Failed to report issue");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      alert(error.message || "Failed to report issue. Please try again.");
    }
  };

  // Modal handlers
  const openModal = (type, task = null) => {
    setModalType(type);
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setModalType("");
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    fetchTodayTasks();
    fetchDashboardStats();
  };

  // Render main content based on active view
  const renderContent = () => {
    switch (activeView) {
      case "today":
        return (
          <TodayTasksView
            stats={stats}
            todayTasks={todayTasks}
            onStartTask={handleStartTask}
            onCompleteTask={(task) => openModal("completeTask", task)}
            onViewDetails={(task) => openModal("taskDetails", task)}
            onReportIssue={(task) => openModal("reportIssue", task)}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />
        );

      case "history":
        return (
          <TaskHistoryView
            taskHistory={taskHistory}
            onRefresh={fetchTaskHistory}
          />
        );

      case "profile":
        return <ProfileView userInfo={userInfo} userProfile={userProfile} stats={stats} />;

      default:
        return null;
    }
  };

  return (
    <div className="electrician-dashboard">
      <DashboardHeader
        userInfo={userInfo}
        notifications={notifications}
        onNotificationClick={handleNotificationsClick}
        onLogout={handleLogout}
      />

      <DashboardNav activeView={activeView} onViewChange={handleViewChange} />

      <main className="dashboard-content">{renderContent()}</main>

      {/* Modals */}
      {showModal && modalType === "taskDetails" && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={closeModal}
          onStartTask={handleStartTask}
        />
      )}

      {showModal && modalType === "completeTask" && (
        <CompleteTaskModal
          task={selectedTask}
          onClose={closeModal}
          onComplete={handleCompleteTask}
        />
      )}

      {showModal && modalType === "reportIssue" && (
        <ReportIssueModal
          task={selectedTask}
          onClose={closeModal}
          onReport={handleReportIssue}
        />
      )}
    </div>
  );
};

export default ElectricianDashboard;
