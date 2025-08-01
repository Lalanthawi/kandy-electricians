// components/ReportModal.jsx - Beautiful UI Design
import React from "react";

const ReportModal = ({ reportData, setShowReportModal, stats, activities }) => {
  // Calculate real user statistics from the data
  const calculateUserStats = () => {
    if (!reportData || !reportData.userStats) {
      return {
        activeUsers: 0,
        inactiveUsers: 0,
        totalUsers: stats.totalUsers || 0,
      };
    }

    const activeUsers = reportData.userStats.filter(
      (u) => u.status === "Active"
    ).length;
    const inactiveUsers = reportData.userStats.filter(
      (u) => u.status === "Inactive"
    ).length;

    return {
      activeUsers,
      inactiveUsers,
      totalUsers: activeUsers + inactiveUsers,
    };
  };

  const userStats = calculateUserStats();

  // Download report as HTML
  const downloadReport = () => {
    const reportContent = document.getElementById("report-content-to-download");
    const style = document.getElementById("report-styles").innerHTML;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>System Usage Report - ${new Date().toLocaleDateString()}</title>
        <style>
          ${style}
          body { margin: 20px; font-family: Arial, sans-serif; }
          .modal-overlay, .modal-header button, .modal-actions { display: none !important; }
        </style>
      </head>
      <body>
        ${reportContent.outerHTML}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `System_Usage_Report_${
      new Date().toISOString().split("T")[0]
    }.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Render report content
  const renderReportContent = () => {
    if (!reportData) return null;

    return (
      <div
        id="report-content-to-download"
        className="report-content system-usage-report"
      >
        <div className="report-header">
          <div className="header-logo">
            <div className="logo-circle">⚡</div>
            <div className="company-info">
              <h1>Kandy Electricians</h1>
              <p>Task Management System</p>
            </div>
          </div>
          <div className="report-title">
            <h2>System Usage Report</h2>
            <p className="report-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="report-section">
          <div className="section-header">
            <h3>📊 User Management Overview</h3>
            <div className="section-line"></div>
          </div>

          <div className="stats-grid">
            <div className="stat-card total-users">
              <div className="stat-icon-wrapper">
                <div className="stat-icon">👥</div>
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Users</p>
                <h4 className="stat-value">{stats.totalUsers || 0}</h4>
              </div>
              <div className="stat-decoration"></div>
            </div>

            <div className="stat-card admins">
              <div className="stat-icon-wrapper">
                <div className="stat-icon">👨‍💼</div>
              </div>
              <div className="stat-info">
                <p className="stat-label">Administrators</p>
                <h4 className="stat-value">{stats.admins || 0}</h4>
              </div>
              <div className="stat-decoration"></div>
            </div>

            <div className="stat-card managers">
              <div className="stat-icon-wrapper">
                <div className="stat-icon">📋</div>
              </div>
              <div className="stat-info">
                <p className="stat-label">Managers</p>
                <h4 className="stat-value">{stats.managers || 0}</h4>
              </div>
              <div className="stat-decoration"></div>
            </div>

            <div className="stat-card electricians">
              <div className="stat-icon-wrapper">
                <div className="stat-icon">⚡</div>
              </div>
              <div className="stat-info">
                <p className="stat-label">Electricians</p>
                <h4 className="stat-value">{stats.electricians || 0}</h4>
              </div>
              <div className="stat-decoration"></div>
            </div>
          </div>

          <div className="status-distribution">
            <h4>User Status Distribution</h4>
            <div className="distribution-content">
              <div className="distribution-stats">
                <div className="distribution-item">
                  <div className="distribution-label">
                    <span className="status-dot active"></span>
                    <span>Active Users</span>
                  </div>
                  <span className="distribution-value">
                    {userStats.activeUsers}
                  </span>
                </div>
                <div className="distribution-item">
                  <div className="distribution-label">
                    <span className="status-dot inactive"></span>
                    <span>Inactive Users</span>
                  </div>
                  <span className="distribution-value">
                    {userStats.inactiveUsers}
                  </span>
                </div>
              </div>
              <div className="distribution-chart">
                <div className="chart-bar">
                  <div
                    className="chart-fill active-fill"
                    style={{
                      width: `${
                        userStats.totalUsers > 0
                          ? (userStats.activeUsers / userStats.totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  >
                    <span className="chart-percentage">
                      {userStats.totalUsers > 0
                        ? Math.round(
                            (userStats.activeUsers / userStats.totalUsers) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="chart-bar">
                  <div
                    className="chart-fill inactive-fill"
                    style={{
                      width: `${
                        userStats.totalUsers > 0
                          ? (userStats.inactiveUsers / userStats.totalUsers) *
                            100
                          : 0
                      }%`,
                    }}
                  >
                    <span className="chart-percentage">
                      {userStats.totalUsers > 0
                        ? Math.round(
                            (userStats.inactiveUsers / userStats.totalUsers) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="report-section">
          <div className="section-header">
            <h3>🔐 Login Activity Summary</h3>
            <div className="section-line"></div>
          </div>

          <div className="activity-metrics">
            <div className="metric-card">
              <div className="metric-icon">📈</div>
              <div className="metric-info">
                <h5>{reportData.loginActivity?.length || 0}</h5>
                <p>Total Logins</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">👤</div>
              <div className="metric-info">
                <h5>
                  {reportData.loginActivity
                    ? new Set(reportData.loginActivity.map((a) => a.user_id))
                        .size
                    : 0}
                </h5>
                <p>Unique Users</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">📅</div>
              <div className="metric-info">
                <h5>30</h5>
                <p>Days Period</p>
              </div>
            </div>
          </div>

          <div className="activity-table-container">
            <h4>Recent Login Activity</h4>
            <table className="elegant-table">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th style={{ width: "25%" }}>User</th>
                  <th style={{ width: "15%" }}>Role</th>
                  <th style={{ width: "30%" }}>Login Time</th>
                  <th style={{ width: "25%" }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {(reportData.loginActivity || [])
                  .slice(0, 30)
                  .map((activity, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-small">
                            {(activity.user_name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span>{activity.user_name || "Unknown"}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`role-pill ${(
                            activity.role || "electrician"
                          ).toLowerCase()}`}
                        >
                          {activity.role || "Electrician"}
                        </span>
                      </td>
                      <td className="time-cell">
                        {new Date(activity.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="ip-cell">
                        {activity.ip_address || "N/A"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="report-section">
          <div className="section-header">
            <h3>📈 Account Activity Summary</h3>
            <div className="section-line"></div>
          </div>

          <div className="activity-cards three-column">
            <div className="activity-stat-card new-registrations">
              <div className="activity-stat-header">
                <div className="activity-stat-icon">👤</div>
                <h5>New Registrations</h5>
              </div>
              <div className="activity-stat-value">
                {reportData.accountActivity?.newRegistrations || 0}
              </div>
              <div className="activity-stat-period">This Month</div>
              <div className="activity-stat-bg"></div>
            </div>

            <div className="activity-stat-card password-resets">
              <div className="activity-stat-header">
                <div className="activity-stat-icon">🔑</div>
                <h5>Password Resets</h5>
              </div>
              <div className="activity-stat-value">
                {reportData.accountActivity?.passwordResets || 0}
              </div>
              <div className="activity-stat-period">This Month</div>
              <div className="activity-stat-bg"></div>
            </div>

            <div className="activity-stat-card deleted-users">
              <div className="activity-stat-header">
                <div className="activity-stat-icon">🗑️</div>
                <h5>Deleted Users</h5>
              </div>
              <div className="activity-stat-value">
                {reportData.accountActivity?.deletedUsers || 0}
              </div>
              <div className="activity-stat-period">This Month</div>
              <div className="activity-stat-bg"></div>
            </div>
          </div>
        </div>

        <div className="report-footer">
          <p>Generated by Kandy Electricians Task Management System</p>
          <p>© {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
      <div
        className="modal-content report-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>System Usage Report</h2>
          <button
            className="close-btn"
            onClick={() => setShowReportModal(false)}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">{renderReportContent()}</div>

        <div className="modal-actions">
          <button
            className="btn-secondary"
            onClick={() => setShowReportModal(false)}
          >
            Close
          </button>
          <button className="btn-download" onClick={downloadReport}>
            <span>⬇</span> Download Report
          </button>
          <button className="btn-primary" onClick={() => window.print()}>
            <span>🖨️</span> Print Report
          </button>
        </div>
      </div>

      <style id="report-styles" jsx>{`
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .report-modal {
          background: white;
          width: 95%;
          max-width: 1200px;
          max-height: 90vh;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 24px;
          color: #1f2937;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          background: #ffffff;
        }

        .modal-actions {
          padding: 20px 32px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          background: #f9fafb;
        }

        .modal-actions button {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .btn-download {
          background: #10b981;
          color: white;
        }

        .btn-download:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        /* Report Content Styles */
        .report-content {
          padding: 40px;
          background: white;
          min-height: 100%;
        }

        .report-header {
          text-align: center;
          margin-bottom: 48px;
          padding-bottom: 32px;
          border-bottom: 2px solid #e5e7eb;
        }

        .header-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .logo-circle {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: white;
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
        }

        .company-info h1 {
          margin: 0;
          font-size: 28px;
          color: #1f2937;
          font-weight: 700;
        }

        .company-info p {
          margin: 4px 0 0;
          color: #6b7280;
          font-size: 16px;
        }

        .report-title h2 {
          margin: 0 0 8px;
          font-size: 36px;
          color: #111827;
          font-weight: 700;
        }

        .report-date {
          color: #6b7280;
          font-size: 16px;
          margin: 0;
        }

        /* Section Styles */
        .report-section {
          margin-bottom: 48px;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-header h3 {
          margin: 0 0 12px;
          font-size: 24px;
          color: #1f2937;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-line {
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, transparent);
          border-radius: 2px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #f9fafb;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }

        .stat-card.total-users {
          border-left: 4px solid #3b82f6;
        }
        .stat-card.admins {
          border-left: 4px solid #8b5cf6;
        }
        .stat-card.managers {
          border-left: 4px solid #ec4899;
        }
        .stat-card.electricians {
          border-left: 4px solid #f59e0b;
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .stat-icon {
          font-size: 28px;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          margin: 0 0 4px;
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          margin: 0;
          font-size: 32px;
          color: #1f2937;
          font-weight: 700;
        }

        .stat-decoration {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 80px;
          height: 80px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 50%;
        }

        /* Status Distribution */
        .status-distribution {
          background: #f9fafb;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .status-distribution h4 {
          margin: 0 0 20px;
          font-size: 18px;
          color: #1f2937;
          font-weight: 600;
        }

        .distribution-content {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .distribution-stats {
          flex: 1;
        }

        .distribution-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .distribution-item:last-child {
          border-bottom: none;
        }

        .distribution-label {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          color: #4b5563;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .status-dot.active {
          background: #10b981;
        }

        .status-dot.inactive {
          background: #ef4444;
        }

        .distribution-value {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .distribution-chart {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart-bar {
          height: 40px;
          background: #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        .chart-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 16px;
          transition: width 0.3s ease;
        }

        .active-fill {
          background: linear-gradient(90deg, #10b981, #059669);
        }

        .inactive-fill {
          background: linear-gradient(90deg, #ef4444, #dc2626);
        }

        .chart-percentage {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        /* Activity Metrics */
        .activity-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: linear-gradient(135deg, #f9fafb, #f3f4f6);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          text-align: center;
          transition: all 0.3s;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }

        .metric-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .metric-info h5 {
          margin: 0 0 4px;
          font-size: 28px;
          color: #1f2937;
          font-weight: 700;
        }

        .metric-info p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Table Styles */
        .activity-table-container {
          background: #f9fafb;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .activity-table-container h4 {
          margin: 0 0 20px;
          font-size: 18px;
          color: #1f2937;
          font-weight: 600;
        }

        .elegant-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .elegant-table thead {
          background: #f3f4f6;
        }

        .elegant-table th {
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e5e7eb;
        }

        .elegant-table td {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          color: #4b5563;
        }

        .elegant-table tbody tr:hover {
          background: #f9fafb;
        }

        .elegant-table tbody tr:last-child td {
          border-bottom: none;
        }

        .text-center {
          text-align: center;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-small {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .role-pill {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .role-pill.admin {
          background: #ddd6fe;
          color: #6b21a8;
        }

        .role-pill.manager {
          background: #fce7f3;
          color: #be185d;
        }

        .role-pill.electrician {
          background: #fed7aa;
          color: #c2410c;
        }

        .time-cell {
          color: #6b7280;
        }

        .ip-cell {
          font-family: monospace;
          color: #6b7280;
        }

        /* Activity Cards */
        .activity-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .activity-cards.three-column {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 768px) {
          .activity-cards.three-column {
            grid-template-columns: 1fr;
          }
        }

        .activity-stat-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          text-align: center;
        }

        .activity-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .activity-stat-card.new-registrations {
          border-top: 4px solid #10b981;
        }

        .activity-stat-card.password-resets {
          border-top: 4px solid #3b82f6;
        }

        .activity-stat-card.deleted-users {
          border-top: 4px solid #ef4444;
        }

        .activity-stat-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .activity-stat-icon {
          font-size: 24px;
        }

        .activity-stat-header h5 {
          margin: 0;
          font-size: 16px;
          color: #6b7280;
          font-weight: 500;
        }

        .activity-stat-value {
          font-size: 48px;
          font-weight: 700;
          color: #1f2937;
          margin: 16px 0;
        }

        .activity-stat-period {
          font-size: 14px;
          color: #6b7280;
          margin-top: 8px;
        }

        .activity-stat-bg {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 50%;
          z-index: 0;
        }

        /* Report Footer */
        .report-footer {
          text-align: center;
          padding: 32px;
          border-top: 2px solid #e5e7eb;
          margin-top: 48px;
          color: #6b7280;
        }

        .report-footer p {
          margin: 4px 0;
          font-size: 14px;
        }

        /* Print Styles */
        @media print {
          .modal-overlay,
          .modal-header button,
          .modal-actions {
            display: none !important;
          }

          .report-modal {
            max-width: 100% !important;
            width: 100% !important;
            max-height: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          .report-content {
            padding: 20px !important;
          }

          .stats-grid,
          .activity-cards {
            break-inside: avoid;
          }

          .report-section {
            page-break-inside: avoid;
          }

          .elegant-table {
            font-size: 12px !important;
          }

          .elegant-table th,
          .elegant-table td {
            padding: 8px !important;
          }

          @page {
            size: A4;
            margin: 15mm;
          }
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .report-content {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .distribution-content {
            flex-direction: column;
          }

          .activity-metrics {
            grid-template-columns: 1fr;
          }

          .elegant-table {
            font-size: 12px;
          }

          .elegant-table th,
          .elegant-table td {
            padding: 8px;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportModal;
