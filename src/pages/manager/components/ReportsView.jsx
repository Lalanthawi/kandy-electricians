// components/manager/ReportsView.jsx
import React, { useState } from "react";

const ReportsView = ({ onGenerateReport }) => {
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);

  const reports = [
    {
      id: "task_analytics",
      icon: "📊",
      title: "Daily Task Report",
      description: "Summary of today's task assignments and completions",
      color: "blue",
    },
    {
      id: "user_performance",
      icon: "📈",
      title: "Team Performance",
      description: "Individual and team productivity metrics",
      color: "green",
    },
  ];

  const handleGenerateReport = async (reportType) => {
    setLoading(true);
    setActiveReport(reportType);
    try {
      const result = await onGenerateReport(reportType);
      setGeneratedReport({ type: reportType, data: result.data });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTaskAnalyticsReport = (data) => {
    if (!data || !data.analytics) return <p>No data available</p>;

    const analytics = data.analytics[0] || {};

    return (
      <div className="report-display">
        <h3>📊 Daily Task Analytics Report</h3>
        <div className="report-summary">
          <div className="summary-grid">
            <div className="summary-card">
              <h4>Total Tasks</h4>
              <p className="value">{analytics.total_tasks || 0}</p>
            </div>
            <div className="summary-card success">
              <h4>Completed</h4>
              <p className="value">{analytics.completed || 0}</p>
              <p className="percentage">
                {analytics.total_tasks > 0
                  ? `${Math.round(
                      (analytics.completed / analytics.total_tasks) * 100
                    )}%`
                  : "0%"}
              </p>
            </div>
            <div className="summary-card warning">
              <h4>Average Duration</h4>
              <p className="value">
                {Math.round(analytics.avg_duration || 0)} hrs
              </p>
            </div>
            <div className="summary-card error">
              <h4>Cancelled</h4>
              <p className="value">{analytics.cancelled || 0}</p>
            </div>
          </div>

          <div className="priority-breakdown">
            <h4>Priority Breakdown</h4>
            <div className="priority-stats">
              <div className="priority-item high">
                <span>High Priority</span>
                <strong>{analytics.high_priority || 0}</strong>
              </div>
              <div className="priority-item medium">
                <span>Medium Priority</span>
                <strong>{analytics.medium_priority || 0}</strong>
              </div>
              <div className="priority-item low">
                <span>Low Priority</span>
                <strong>{analytics.low_priority || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUserPerformanceReport = (data) => {
    if (!data || !data.performance) return <p>No data available</p>;

    return (
      <div className="report-display">
        <h3>📈 Team Performance Report</h3>
        <div className="performance-table">
          <table>
            <thead>
              <tr>
                <th>Electrician</th>
                <th>Employee Code</th>
                <th>Total Tasks</th>
                <th>Completed</th>
                <th>Completion Rate</th>
                <th>Avg Rating</th>
                <th>Overall Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.performance.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    No performance data available
                  </td>
                </tr>
              ) : (
                data.performance.map((user, index) => (
                  <tr key={index}>
                    <td>{user.full_name}</td>
                    <td>{user.employee_code}</td>
                    <td>{user.total_tasks || 0}</td>
                    <td>{user.completed_tasks || 0}</td>
                    <td>
                      {user.total_tasks > 0
                        ? `${Math.round(
                            (user.completed_tasks / user.total_tasks) * 100
                          )}%`
                        : "0%"}
                    </td>
                    <td>
                      {user.avg_rating
                        ? `${parseFloat(user.avg_rating).toFixed(1)} ⭐`
                        : "N/A"}
                    </td>
                    <td>
                      {user.overall_rating
                        ? `${parseFloat(user.overall_rating).toFixed(1)} ⭐`
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="performance-summary">
          <h4>Team Summary</h4>
          <div className="summary-stats">
            <div className="stat">
              <span>Total Team Members</span>
              <strong>{data.performance.length}</strong>
            </div>
            <div className="stat">
              <span>Total Tasks Completed</span>
              <strong>
                {data.performance.reduce(
                  (sum, user) => sum + (user.completed_tasks || 0),
                  0
                )}
              </strong>
            </div>
            <div className="stat">
              <span>Average Team Rating</span>
              <strong>
                {data.performance.length > 0
                  ? (
                      data.performance.reduce(
                        (sum, user) =>
                          sum + parseFloat(user.overall_rating || 0),
                        0
                      ) /
                      data.performance.filter((u) => u.overall_rating).length
                    ).toFixed(1)
                  : "0.0"}{" "}
                ⭐
              </strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomerSatisfactionReport = (data) => {
    if (!data || !data.satisfaction) return <p>No data available</p>;

    const satisfaction = data.satisfaction[0] || {};

    return (
      <div className="report-display">
        <h3>⭐ Customer Satisfaction Report</h3>
        <div className="satisfaction-summary">
          <div className="rating-overview">
            <h4>Average Rating</h4>
            <p className="big-rating">
              {parseFloat(satisfaction.avg_rating || 0).toFixed(1)} ⭐
            </p>
            <p className="total-ratings">
              Based on {satisfaction.total_ratings || 0} ratings
            </p>
          </div>

          <div className="rating-breakdown">
            <h4>Rating Distribution</h4>
            <div className="rating-bars">
              <div className="rating-bar">
                <span>5 Stars</span>
                <div className="bar">
                  <div
                    className="fill five-star"
                    style={{
                      width: `${
                        satisfaction.total_ratings > 0
                          ? (satisfaction.five_star /
                              satisfaction.total_ratings) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span>{satisfaction.five_star || 0}</span>
              </div>
              <div className="rating-bar">
                <span>4 Stars</span>
                <div className="bar">
                  <div
                    className="fill four-star"
                    style={{
                      width: `${
                        satisfaction.total_ratings > 0
                          ? (satisfaction.four_star /
                              satisfaction.total_ratings) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span>{satisfaction.four_star || 0}</span>
              </div>
              <div className="rating-bar">
                <span>3 Stars & Below</span>
                <div className="bar">
                  <div
                    className="fill three-star"
                    style={{
                      width: `${
                        satisfaction.total_ratings > 0
                          ? (satisfaction.three_or_below /
                              satisfaction.total_ratings) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span>{satisfaction.three_or_below || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    if (!generatedReport) return null;

    switch (generatedReport.type) {
      case "task_analytics":
        return renderTaskAnalyticsReport(generatedReport.data);
      case "user_performance":
        return renderUserPerformanceReport(generatedReport.data);
      case "customer_satisfaction":
        return renderCustomerSatisfactionReport(generatedReport.data);
      default:
        return (
          <div className="report-content">
            <pre>{JSON.stringify(generatedReport.data, null, 2)}</pre>
          </div>
        );
    }
  };

  return (
    <div className="reports-view">
      <h2>Reports & Analytics</h2>

      <div className="reports-grid">
        {reports.map((report) => (
          <div key={report.id} className={`report-card ${report.color}`}>
            <div className="report-icon">{report.icon}</div>
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <button
              className="generate-btn"
              onClick={() => handleGenerateReport(report.id)}
              disabled={loading && activeReport === report.id}
            >
              {loading && activeReport === report.id
                ? "Generating..."
                : "Generate Report"}
            </button>
          </div>
        ))}
      </div>

      {generatedReport && (
        <div className="report-results">{renderReport()}</div>
      )}
    </div>
  );
};

export default ReportsView;
