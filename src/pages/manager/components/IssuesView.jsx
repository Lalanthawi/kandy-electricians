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
          <div className="issue-detail-modal enhanced-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header enhanced">
              <div className="header-content">
                <div className="header-icon">
                  <span className={`icon-badge ${getPriorityClass(selectedIssue.priority)}`}>
                    {selectedIssue.priority === 'emergency' ? '🚨' : 
                     selectedIssue.priority === 'urgent' ? '⚠️' : '📋'}
                  </span>
                </div>
                <div className="header-text">
                  <h3>Issue #{selectedIssue.id} - {selectedIssue.issue_type?.replace(/_/g, ' ')}</h3>
                  <p className="header-subtitle">
                    Reported by {selectedIssue.reported_by_name} on {formatDate(selectedIssue.created_at)}
                  </p>
                </div>
              </div>
              <button className="close-btn enhanced" onClick={() => setShowDetailModal(false)}>
                <span>✕</span>
              </button>
            </div>
            
            <div className="modal-content enhanced">
              {/* Status Banner */}
              <div className={`status-banner ${getStatusClass(selectedIssue.status)}`}>
                <div className="status-info">
                  <span className="status-icon">
                    {selectedIssue.status === 'open' ? '🔴' : 
                     selectedIssue.status === 'in_progress' ? '🟡' : '🟢'}
                  </span>
                  <span className="status-text">
                    Status: <strong>{selectedIssue.status.replace(/_/g, ' ').toUpperCase()}</strong>
                  </span>
                </div>
                {selectedIssue.resolved_at && (
                  <div className="resolution-info">
                    Resolved by {selectedIssue.resolved_by_name} on {formatDate(selectedIssue.resolved_at)}
                  </div>
                )}
              </div>

              {/* Main Details Grid */}
              <div className="detail-section enhanced">
                <div className="section-header">
                  <h4>📋 Issue Details</h4>
                  <div className="section-line"></div>
                </div>
                <div className="detail-cards">
                  <div className="detail-card">
                    <div className="card-icon">🎯</div>
                    <div className="card-content">
                      <label>Priority Level</label>
                      <span className={`priority-badge large ${getPriorityClass(selectedIssue.priority)}`}>
                        {selectedIssue.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="detail-card">
                    <div className="card-icon">🏷️</div>
                    <div className="card-content">
                      <label>Issue Type</label>
                      <span className="detail-value">{selectedIssue.issue_type?.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                  <div className="detail-card">
                    <div className="card-icon">👷</div>
                    <div className="card-content">
                      <label>Reported By</label>
                      <span className="detail-value">{selectedIssue.reported_by_name}</span>
                      <span className="detail-sub">{selectedIssue.reported_by_phone}</span>
                    </div>
                  </div>
                  <div className="detail-card">
                    <div className="card-icon">📅</div>
                    <div className="card-content">
                      <label>Timeline</label>
                      <span className="detail-value">
                        {Math.floor((new Date() - new Date(selectedIssue.created_at)) / (1000 * 60 * 60 * 24))} days ago
                      </span>
                      <span className="detail-sub">{formatDate(selectedIssue.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="detail-section enhanced">
                <div className="section-header">
                  <h4>📝 Issue Description</h4>
                  <div className="section-line"></div>
                </div>
                <div className="description-box">
                  <p>{selectedIssue.description}</p>
                </div>
                {selectedIssue.requested_action && (
                  <>
                    <div className="section-header mt-3">
                      <h4>🎬 Requested Action</h4>
                      <div className="section-line"></div>
                    </div>
                    <div className="action-box">
                      <p>{selectedIssue.requested_action}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Related Task Section */}
              <div className="detail-section enhanced">
                <div className="section-header">
                  <h4>🔗 Related Task Information</h4>
                  <div className="section-line"></div>
                </div>
                <div className="task-info-card">
                  <div className="task-header">
                    <span className="task-badge">{selectedIssue.task_code}</span>
                    <h5>{selectedIssue.task_title}</h5>
                  </div>
                  <div className="task-details-grid">
                    <div className="task-detail">
                      <span className="detail-icon">👤</span>
                      <div>
                        <label>Customer</label>
                        <p>{selectedIssue.customer_name}</p>
                        <span className="sub-text">{selectedIssue.customer_phone}</span>
                      </div>
                    </div>
                    <div className="task-detail">
                      <span className="detail-icon">📍</span>
                      <div>
                        <label>Location</label>
                        <p>{selectedIssue.customer_address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Notes Section */}
              {selectedIssue.resolution_notes && (
                <div className="detail-section enhanced">
                  <div className="section-header">
                    <h4>✅ Resolution Notes</h4>
                    <div className="section-line"></div>
                  </div>
                  <div className="resolution-box">
                    <p>{selectedIssue.resolution_notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedIssue.status !== 'resolved' && (
                <div className="modal-actions enhanced">
                  <button
                    className="action-btn cancel-btn"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Cancel
                  </button>
                  <div className="action-group">
                    {selectedIssue.status === 'open' && (
                      <button
                        className="action-btn progress-btn enhanced"
                        onClick={() => updateIssueStatus(selectedIssue.id, 'in_progress')}
                        disabled={actionLoading}
                      >
                        <span>🔄</span> Start Working
                      </button>
                    )}
                    <button
                      className="action-btn resolve-btn enhanced"
                      onClick={() => updateIssueStatus(selectedIssue.id, 'resolved')}
                      disabled={actionLoading}
                    >
                      <span>✅</span> Mark as Resolved
                    </button>
                  </div>
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