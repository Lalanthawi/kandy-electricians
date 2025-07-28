// components/manager/RecentTasks.jsx
import React from "react";

const RecentTasks = ({ tasks, onViewTask }) => {
  const recentTasks = tasks
    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
    .slice(0, 5);

  return (
    <div className="overview-card">
      <h3>Recent Tasks</h3>
      <div className="task-list">
        {recentTasks.length === 0 ? (
          <div className="no-data">No recent tasks</div>
        ) : (
          recentTasks.map((task) => (
            <div
              key={task.id}
              className="task-item"
              onClick={() => onViewTask(task)}
            >
              <div className="task-header">
                <span className="task-id">#{task.taskCode}</span>
                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
              <h4>{task.title}</h4>
              <p>
                {task.customerName} • {task.customerAddress}
              </p>
              <div className="task-footer">
                <span
                  className={`status ${task.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {task.status}
                </span>
                <span className="due-date">
                  Due: {new Date(task.scheduledDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTasks;
