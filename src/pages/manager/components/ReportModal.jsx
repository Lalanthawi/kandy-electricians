import React from 'react';

const ReportModal = ({ isOpen, onClose, reportType, reportData }) => {
  // Detailed debug logging
  console.log('Modal Props:', { isOpen, reportType, reportData });
  console.log('Modal Props JSON:', JSON.stringify({ isOpen, reportType, reportData }, null, 2));
  
  if (!isOpen) return null;

  // More detailed logging

  const formatTime = (hours) => {
    if (hours === null || hours === undefined || hours === '') return '0 hrs';
    const numHours = parseFloat(hours);
    if (isNaN(numHours)) return '0 hrs';
    return `${numHours.toFixed(1)} hrs`;
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || value === '') return '0%';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '0%';
    return `${numValue.toFixed(1)}%`;
  };

  const formatRating = (rating) => {
    if (rating === null || rating === undefined || rating === '') return '0.0';
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return '0.0';
    return numRating.toFixed(2);
  };

  const downloadReport = () => {
    const date = new Date().toISOString().split('T')[0];
    const fileName = `Team_Performance_Report_${date}.html`;
    const reportContent = renderTeamPerformanceReportHTML();
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fileName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
    h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    h2 { color: #374151; margin-top: 30px; }
    .section { margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
    .item { background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; }
    .label { color: #6b7280; font-size: 14px; }
    .value { font-size: 24px; font-weight: bold; color: #111827; margin-top: 5px; }
    .success { color: #10b981; }
    .warning { color: #f59e0b; }
    .danger { color: #ef4444; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    tr:hover { background: #f9fafb; }
    .chart-bar { background: #e5e7eb; height: 24px; border-radius: 4px; margin: 10px 0; }
    .chart-fill { background: #3b82f6; height: 100%; border-radius: 4px; }
  </style>
</head>
<body>
  ${reportContent}
  <p style="margin-top: 40px; color: #6b7280; font-size: 14px;">
    Generated on ${new Date().toLocaleString()}
  </p>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  const renderTeamPerformanceReportHTML = () => {
    const { teamSummary, workloadDistribution } = reportData || {};
    return `
      <h1>Team Performance Report</h1>
      <div class="section">
        <h2>Team Summary</h2>
        <div class="grid">
          <div class="item">
            <div class="label">Total Active Electricians</div>
            <div class="value">${teamSummary?.totalElectricians || 0}</div>
          </div>
          <div class="item">
            <div class="label">Total Tasks Handled</div>
            <div class="value">${teamSummary?.totalTasksHandled || 0}</div>
          </div>
          <div class="item">
            <div class="label">Total Completed Tasks</div>
            <div class="value success">${teamSummary?.totalCompleted || 0}</div>
          </div>
          <div class="item">
            <div class="label">Overall Completion Rate</div>
            <div class="value success">${formatPercentage(teamSummary?.overallCompletionRate)}</div>
          </div>
        </div>
      </div>
      ${workloadDistribution && workloadDistribution.length > 0 ? `
      <div class="section">
        <h2>Workload Distribution</h2>
        ${workloadDistribution.map(item => {
          const maxTasks = Math.max(...workloadDistribution.map(w => w.taskCount));
          const percentage = maxTasks > 0 ? (item.taskCount / maxTasks * 100) : 0;
          return `
            <div style="margin: 10px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${item.name}</span>
                <span>${item.taskCount} tasks</span>
              </div>
              <div class="chart-bar">
                <div class="chart-fill" style="width: ${percentage}%;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ` : ''}
    `;
  };


  const renderTeamPerformanceReport = () => {
    console.log('renderTeamPerformanceReport - reportData:', reportData);
    const { teamSummary, workloadDistribution } = reportData || {};
    console.log('renderTeamPerformanceReport - extracted data:', { teamSummary, workloadDistribution });
    
    return (
      <>
        <h2 className="report-modal-title">Team Performance Report</h2>
        
        <div className="report-section">
          <h3 className="report-section-title">Team Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Active Electricians</span>
              <span className="summary-value">{teamSummary?.totalElectricians || 0}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Tasks Handled</span>
              <span className="summary-value">{teamSummary?.totalTasksHandled || 0}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Completed Tasks</span>
              <span className="summary-value success">{teamSummary?.totalCompleted || 0}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Overall Completion Rate</span>
              <span className="summary-value success">{formatPercentage(teamSummary?.overallCompletionRate)}</span>
            </div>
          </div>
        </div>

        {workloadDistribution && (
          <div className="report-section">
            <h3 className="report-section-title">Workload Distribution</h3>
            <div className="workload-chart">
              {workloadDistribution.map((item, index) => (
                <div key={index} className="workload-item">
                  <span className="workload-name">{item.name}</span>
                  <div className="workload-bar-container">
                    <div 
                      className="workload-bar" 
                      style={{ width: `${(item.taskCount / Math.max(...workloadDistribution.map(w => w.taskCount))) * 100}%` }}
                    >
                      <span className="workload-count">{item.taskCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <button className="report-modal-close" onClick={onClose}>×</button>
        
        <div className="report-modal-content">
          {!reportData ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p>Loading report data...</p>
            </div>
          ) : (
            <>
              {console.log('Rendering report - reportType:', reportType)}
              {reportType === 'team_performance' ? renderTeamPerformanceReport() : (
                <div>Unknown report type: {reportType}</div>
              )}
            </>
          )}
        </div>

        <div className="report-modal-footer">
          <button className="print-button" onClick={downloadReport}>
            Download Report
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;