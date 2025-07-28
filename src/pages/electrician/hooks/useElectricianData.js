// hooks/useElectricianData.js
import { useState, useEffect } from "react";
import electricianService from "../services/electricianService";

export const useElectricianData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [todayTasks, setTodayTasks] = useState([]);
  const [taskHistory, setTaskHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await electricianService.getDashboardStats();
      if (response.success) {
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
      }
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
      const response = await electricianService.getTodayTasks(today);

      if (response.success) {
        const transformedTasks = electricianService.transformTasks(
          response.data
        );
        setTodayTasks(transformedTasks);

        // Update stats based on actual tasks
        const pendingCount = transformedTasks.filter(
          (t) => t.status === "Pending" || t.status === "Assigned"
        ).length;
        const inProgressCount = transformedTasks.filter(
          (t) => t.status === "In Progress"
        ).length;
        const completedCount = transformedTasks.filter(
          (t) => t.status === "Completed"
        ).length;

        setStats((prevStats) => ({
          ...prevStats,
          todayTasks: transformedTasks.length,
          pendingToday: pendingCount,
          inProgress: inProgressCount,
          completedToday: completedCount,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch task history
  const fetchTaskHistory = async () => {
    try {
      const response = await electricianService.getAllTasks();
      if (response.success) {
        const history = electricianService.transformTaskHistory(response.data);
        setTaskHistory(history);
      }
    } catch (err) {
      console.error("Failed to fetch task history:", err);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await electricianService.getNotifications();
      if (response.success) {
        const transformedNotifications =
          electricianService.transformNotifications(response.data);
        setNotifications(transformedNotifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus, additionalData = {}) => {
    try {
      const response = await electricianService.updateTaskStatus(
        taskId,
        newStatus
      );

      if (newStatus === "Completed" && additionalData.completionNotes) {
        await electricianService.completeTask(taskId, additionalData);
      }

      // Refresh data
      await fetchTodayTasks();
      await fetchDashboardStats();

      return {
        success: true,
        message: `Task ${
          newStatus === "In Progress" ? "started" : "updated"
        } successfully!`,
      };
    } catch (err) {
      console.error("Failed to update task:", err);
      throw new Error("Failed to update task status: " + err.message);
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      await electricianService.markNotificationRead(notificationId);
      setNotifications(
        notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, unread: false } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchTodayTasks(),
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

  return {
    loading,
    error,
    stats,
    todayTasks,
    taskHistory,
    notifications,
    userInfo,
    fetchDashboardStats,
    fetchTodayTasks,
    fetchTaskHistory,
    fetchNotifications,
    updateTaskStatus,
    markNotificationRead,
    setError,
  };
};
