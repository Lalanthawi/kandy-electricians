// components/UserModal.jsx
import { usersService } from "../../../services/users";

const UserModal = ({
  modalType,
  formData,
  setFormData,
  setShowModal,
  loadDashboardData,
}) => {
  // Available skills for dropdown
  const availableSkills = [
    "Residential Wiring",
    "Commercial Installation",
    "Industrial Wiring",
    "Emergency Repairs",
    "Solar Installation",
    "Maintenance",
    "Safety Inspection",
    "Panel Upgrades",
    "LED Lighting",
    "Smart Home Systems",
  ];

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle skills selection
  const handleSkillsChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({
      ...formData,
      skills: selectedOptions,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        ...formData,
        skills: formData.skills.join(", "),
      };

      const response = await usersService.create(userData);

      if (response.success) {
        await loadDashboardData();
        setShowModal(false);
        resetForm();
        alert("User added successfully!");
      }
    } catch (error) {
      alert("Error adding user: " + error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      full_name: "",
      phone: "",
      role: "Electrician",
      employee_code: "",
      skills: [],
      certifications: "",
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modalType === "addUser" ? "Add New User" : "Edit User"}</h2>
          <button className="close-btn" onClick={() => setShowModal(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee Code (Auto-generated)</label>
            <input
              type="text"
              name="employee_code"
              value={formData.employee_code}
              readOnly
              style={{ backgroundColor: "#f0f0f0" }}
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleFormChange}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="+94 XX XXX XXXX"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              required
            >
              <option value="Electrician">Electrician</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {modalType === "addUser" && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                required
                placeholder="Enter password"
                minLength="6"
              />
            </div>
          )}

          {formData.role === "Electrician" && (
            <>
              <div className="form-group">
                <label>Skills (Hold Ctrl/Cmd to select multiple)</label>
                <select
                  multiple
                  name="skills"
                  value={formData.skills}
                  onChange={handleSkillsChange}
                  size="6"
                  style={{ height: "120px" }}
                >
                  {availableSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <small>Selected: {formData.skills.join(", ") || "None"}</small>
              </div>

              <div className="form-group">
                <label>Certifications</label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleFormChange}
                  placeholder="Level 3 Certified, Safety Standards"
                />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {modalType === "addUser" ? "Add User" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
