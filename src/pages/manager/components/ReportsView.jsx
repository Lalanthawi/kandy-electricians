// components/manager/ReportsView.jsx
import React, { useState } from "react";
import ReportModal from "./ReportModal";

const ReportsView = ({ onGenerateReport }) => {
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReportData, setModalReportData] = useState(null);
  const [modalReportType, setModalReportType] = useState(null);

  const reports = [
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
      console.log('Report generated:', result);
      console.log('Report data:', result.data);
      console.log('ReportsView - Report generated:', reportType, result);
      setGeneratedReport({ type: reportType, data: result.data });
      
      // Process data for modal
      const processedData = processReportData(reportType, result.data);
      console.log('ReportsView - Processed data for modal:', processedData);
      
      // Ensure data is set before opening modal
      if (processedData) {
        console.log('Setting modal data:', processedData);
        console.log('Setting modal type:', reportType);
        setModalReportData(processedData);
        setModalReportType(reportType);
        // Small delay to ensure state is updated
        setTimeout(() => {
          console.log('Opening modal with data:', processedData);
          setIsModalOpen(true);
        }, 50);
      } else {
        console.error('No processed data available for modal');
      }
    } catch (error) {
      console.error('ReportsView - Error generating report:', error);
      alert(error.message);
      setGeneratedReport(null);
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (type, data) => {
    console.log('processReportData - type:', type, 'data:', data);
    console.log('processReportData - data keys:', data ? Object.keys(data) : 'null');
    console.log('processReportData - data.analytics:', data?.analytics);
    
    if (type === 'user_performance') {
      const performance = data.performance || [];
      const summary = data.summary || {};
      console.log('processReportData - performance:', performance);
      console.log('processReportData - summary:', summary);
      
      const workloadDistribution = performance.map(user => ({
        name: user.full_name,
        taskCount: user.total_tasks || 0
      }));

      return {
        teamSummary: {
          totalElectricians: summary.total_electricians || performance.length,
          totalTasksHandled: summary.total_tasks_assigned || 0,
          totalCompleted: summary.total_completed || 0,
          overallCompletionRate: summary.total_tasks_assigned > 0 
            ? (summary.total_completed / summary.total_tasks_assigned) * 100 
            : 0
        },
        workloadDistribution
      };
    }
    
    console.error('processReportData - Unknown report type:', type);
    return null;
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

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          console.log('Modal closed');
        }}
        reportType={'team_performance'}
        reportData={modalReportData}
      />
    </div>
  );
};

export default ReportsView;
