// components/Reports.jsx
import { dashboardService } from "../../../services/dashboard";

const Reports = ({ setReportData, setShowReportModal }) => {
  // Reports configuration
  const reports = [
    {
      id: 1,
      name: "User Performance Report",
      type: "user_performance",
      description:
        "Detailed analysis of user productivity and task completion rates",
      icon: "📊",
      color: "#3498db",
    },
    {
      id: 2,
      name: "System Usage Report",
      type: "system_usage",
      description:
        "Login patterns, peak hours, and system resource utilization",
      icon: "📈",
      color: "#2ecc71",
    },
    {
      id: 3,
      name: "Task Analytics Report",
      type: "task_analytics",
      description:
        "Task distribution, completion times, and efficiency metrics",
      icon: "📋",
      color: "#f39c12",
    },
  ];

  // Handle generate report
  const handleGenerateReport = async (reportId) => {
    try {
      const report = reports.find((r) => r.id === reportId);

      const response = await dashboardService.generateReport({
        report_type: report.type,
        start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
      });

      if (response.success && response.data) {
        setReportData({
          ...response.data,
          reportName: report.name,
          reportType: report.type,
        });
        setShowReportModal(true);
      }
    } catch (error) {
      alert("Error generating report: " + error.message);
    }
  };

  return (
    <div className="reports-section">
      <h2>System Reports</h2>
      <p className="section-description">
        Generate comprehensive reports for system analysis and decision making
      </p>

      <div className="reports-grid">
        {reports.map((report) => (
          <div
            key={report.id}
            className="report-card"
            style={{ borderLeft: `4px solid ${report.color}` }}
          >
            <div className="report-icon" style={{ color: report.color }}>
              {report.icon}
            </div>
            <div className="report-content">
              <h3>{report.name}</h3>
              <p>{report.description}</p>
            </div>
            <button
              className="generate-btn"
              onClick={() => handleGenerateReport(report.id)}
            >
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
