import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IssuesView.css';

const IssuesView = () => {
  console.log('IssuesView component is rendering!');
  
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    startDate: '',
    endDate: ''
  });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch issues based on filters
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      console.log('Fetching issues with params:', params.toString());
      const response = await axios.get(`/api/issues?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Issues response:', response.data);
      const issuesData = response.data.issues || [];
      console.log('Setting issues array:', issuesData);
      console.log('Issues count:', issuesData.length);
      setIssues(issuesData);
    } catch (error) {
      console.error('Error fetching issues:', error);
      console.error('Error details:', error.response?.data || error.message);
      if (error.response?.status === 403) {
        alert('Access denied. Only managers can view all issues.');
      } else {
        alert('Failed to fetch issues: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch issue details
  const fetchIssueDetails = async (issueId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/issues/${issueId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedIssue(response.data.issue);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching issue details:', error);
      alert('Failed to fetch issue details');
    }
  };

  // Update issue status
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      let resolutionNotes = '';
      if (newStatus === 'resolved') {
        resolutionNotes = prompt('Please provide resolution notes:');
        if (!resolutionNotes) return;
      }

      await axios.patch(
        `/api/issues/${issueId}/status`,
        { 
          status: newStatus,
          resolution_notes: resolutionNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Issue ${newStatus === 'resolved' ? 'resolved' : 'updated'} successfully`);
      setShowDetailModal(false);
      fetchIssues(); // Refresh the list
    } catch (error) {
      console.error('Error updating issue status:', error);
      alert('Failed to update issue status');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    console.log('IssuesView mounted, fetching issues...');
    fetchIssues();
  }, []);
  
  useEffect(() => {
    console.log('Filters changed, fetching issues with new filters:', filters);
    fetchIssues();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      startDate: '',
      endDate: ''
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'emergency': return 'priority-emergency';
      case 'urgent': return 'priority-urgent';
      case 'normal': return 'priority-normal';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="issues-view">
      <div className="issues-header">
        <h2>Reported Issues</h2>
        <div className="issues-summary">
          <span className="summary-item">
            Total: <strong>{issues.length}</strong>
          </span>
          <span className="summary-item">
            Open: <strong className="text-danger">{issues.filter(i => i.status === 'open').length}</strong>
          </span>
          <span className="summary-item">
            In Progress: <strong className="text-warning">{issues.filter(i => i.status === 'in_progress').length}</strong>
          </span>
          <span className="summary-item">
            Resolved: <strong className="text-success">{issues.filter(i => i.status === 'resolved').length}</strong>
          </span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="issues-filters">
        <div className="filter-group">
          <label>Status</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Priority</label>
          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priorities</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Issues Table */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">Loading issues...</div>
        </div>
      ) : issues.length === 0 ? (
        <div className="no-issues">
          <p>No issues found matching the selected filters.</p>
        </div>
      ) : (
        <div className="issues-table-container">
          <table className="issues-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Reported By</th>
                <th>Issue Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id}>
                  <td>#{issue.id}</td>
                  <td>
                    <div className="task-info">
                      <span className="task-code">{issue.task_code}</span>
                      <span className="task-title">{issue.task_title}</span>
                    </div>
                  </td>
                  <td>{issue.reported_by_name}</td>
                  <td className="issue-type">{issue.issue_type?.replace(/_/g, ' ')}</td>
                  <td>
                    <span className={`priority-badge ${getPriorityClass(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(issue.status)}`}>
                      {issue.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{formatDate(issue.created_at)}</td>
                  <td>
                    <button
                      className="action-btn view-btn"
                      onClick={() => fetchIssueDetails(issue.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue Detail Modal */}
      {showDetailModal && selectedIssue && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="issue-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Issue Details</h3>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="detail-section">
                <h4>Issue Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Issue ID:</label>
                    <span>#{selectedIssue.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedIssue.issue_type?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Priority:</label>
                    <span className={`priority-badge ${getPriorityClass(selectedIssue.priority)}`}>
                      {selectedIssue.priority}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${getStatusClass(selectedIssue.status)}`}>
                      {selectedIssue.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Reported By:</label>
                    <span>{selectedIssue.reported_by_name} ({selectedIssue.reported_by_phone})</span>
                  </div>
                  <div className="detail-item">
                    <label>Reported Date:</label>
                    <span>{formatDate(selectedIssue.created_at)}</span>
                  </div>
                  {selectedIssue.resolved_at && (
                    <>
                      <div className="detail-item">
                        <label>Resolved By:</label>
                        <span>{selectedIssue.resolved_by_name}</span>
                      </div>
                      <div className="detail-item">
                        <label>Resolved Date:</label>
                        <span>{formatDate(selectedIssue.resolved_at)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Description</h4>
                <p className="description-text">{selectedIssue.description}</p>
                {selectedIssue.requested_action && (
                  <>
                    <h4>Requested Action</h4>
                    <p className="action-text">{selectedIssue.requested_action}</p>
                  </>
                )}
              </div>

              <div className="detail-section">
                <h4>Related Task</h4>
                <div className="task-details">
                  <p><strong>Task Code:</strong> {selectedIssue.task_code}</p>
                  <p><strong>Title:</strong> {selectedIssue.task_title}</p>
                  <p><strong>Customer:</strong> {selectedIssue.customer_name} ({selectedIssue.customer_phone})</p>
                  <p><strong>Location:</strong> {selectedIssue.customer_address}</p>
                </div>
              </div>

              {selectedIssue.status !== 'resolved' && (
                <div className="modal-actions">
                  {selectedIssue.status === 'open' && (
                    <button
                      className="action-btn progress-btn"
                      onClick={() => updateIssueStatus(selectedIssue.id, 'in_progress')}
                      disabled={actionLoading}
                    >
                      Mark as In Progress
                    </button>
                  )}
                  <button
                    className="action-btn resolve-btn"
                    onClick={() => updateIssueStatus(selectedIssue.id, 'resolved')}
                    disabled={actionLoading}
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuesView;