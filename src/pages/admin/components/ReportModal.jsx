// components/ReportModal.jsx
const ReportModal = ({ reportData, setShowReportModal, stats, activities }) => {
  // Render report content based on type
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

  return (
    <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
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
  );
};

export default ReportModal;
