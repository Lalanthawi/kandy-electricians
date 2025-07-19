// Login.jsx
import { useState } from "react";
import logo from "../../assets/logo.png"; // Update path if needed
import "./Login.css";
import { useNavigate } from "react-router-dom"; // If using React Router
import { authService } from "../../services/auth";

const Login = () => {
  const navigate = useNavigate(); // or use window.location.href
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Form state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );

      // Redirect based on user role
      switch (response.user.role) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Manager":
          navigate("/manager/dashboard");
          break;
        case "Electrician":
          navigate("/electrician/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      setErrors({
        general:
          error.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo" />

        {/* Title */}
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Please login to your account</p>

        {/* Error Message */}
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="footer-text">
          Don&apos;t have an account?
          <a href="mailto:admin@company.com"> Contact Admin</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
