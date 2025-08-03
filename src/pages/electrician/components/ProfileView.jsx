// components/ProfileView.jsx
import React from "react";

const ProfileView = ({ userInfo, stats }) => {
  return (
    <div className="profile-section">
      <h2>My Profile</h2>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {userInfo.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "E"}
          </div>
          <div className="profile-info">
            <h3>{userInfo.name || "Electrician"}</h3>
            <p>Employee ID: {userInfo.id || "N/A"}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-group">
            <label>Email</label>
            <p>{userInfo.email || "Not provided"}</p>
          </div>
          <div className="detail-group">
            <label>Phone</label>
            <p>{userInfo.phone || "Not provided"}</p>
          </div>
          <div className="detail-group">
            <label>Role</label>
            <p>{userInfo.role || "Electrician"}</p>
          </div>
          <div className="detail-group">
            <label>Total Tasks Completed</label>
            <p>{stats.totalCompleted}</p>
          </div>
          <div className="detail-group">
            <label>Join Date</label>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="skills-section">
          <h4>My Skills</h4>
          <div className="skills-list">
            <span className="skill">Residential Wiring</span>
            <span className="skill">Commercial Installation</span>
            <span className="skill">Emergency Repairs</span>
            <span className="skill">Solar Panel Installation</span>
            <span className="skill">Safety Inspection</span>
          </div>
        </div>

        <div className="certifications">
          <h4>Certifications</h4>
          <ul>
            <li>Certified Electrician - Level 3</li>
            <li>Safety Standards Certificate</li>
            <li>Emergency Response Training</li>
          </ul>
        </div>
      </div>

      {/* Performance Overview */}
    </div>
  );
};

export default ProfileView;
