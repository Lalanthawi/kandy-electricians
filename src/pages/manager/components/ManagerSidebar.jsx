// components/manager/ManagerSidebar.jsx
import React from "react";

const ManagerSidebar = ({ activeView, onViewChange, userInfo, onLogout }) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "tasks", label: "Tasks", icon: "📋" },
    { id: "team", label: "Team", icon: "👥" },
    { id: "reports", label: "Reports", icon: "📈" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">⚡</span>
        <h2>Manager Portal</h2>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? "active" : ""}`}
            onClick={() => onViewChange(item.id)}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="manager-info">
          <div className="manager-avatar">
            {userInfo.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "MG"}
          </div>
          <div>
            <p className="manager-name">{userInfo.name || "Manager"}</p>
            <p className="manager-email">
              {userInfo.email || "manager@company.com"}
            </p>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default ManagerSidebar;
