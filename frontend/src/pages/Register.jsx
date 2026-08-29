import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  UserRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  // =====================================
  // FORM DATA
  // =====================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // =====================================
  // STATES
  // =====================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear messages when user starts typing
    setError("");
    setSuccess("");
  };

  // =====================================
  // REGISTER USER
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =====================================
    // VALIDATION
    // =====================================

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Password length
    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    // Password confirmation
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // =====================================
      // SEND DATA TO BACKEND
      // =====================================

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      // =====================================
      // BACKEND ERROR
      // =====================================

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      console.log(
        "Registration successful:",
        data
      );

      // =====================================
      // SUCCESS POPUP
      // =====================================

      setSuccess(
        "Your JobHub account has been created successfully."
      );

      // Make sure old login data is removed
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // =====================================
      // REDIRECT TO LOGIN
      // =====================================

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setError(
        error.message ||
          "Unable to register. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CLOSE SUCCESS POPUP
  // =====================================

  const closeSuccess = () => {
    setSuccess("");
  };

  // =====================================
  // UI
  // =====================================

  return (
    <>
      <Navbar />

      {/* =====================================
          REGISTRATION SUCCESS POPUP
      ===================================== */}

      {success && (
        <div className="auth-toast auth-toast-success">

          {/* Icon */}

          <div className="auth-toast-icon">
            <CheckCircle2 size={22} />
          </div>

          {/* Message */}

          <div className="auth-toast-content">

            <strong>
              Registration Successful
            </strong>

            <span>
              {success}
            </span>

          </div>

          {/* Close */}

          <button
            type="button"
            className="auth-toast-close"
            onClick={closeSuccess}
          >
            <X size={17} />
          </button>

        </div>
      )}

      {/* =====================================
          REGISTER PAGE
      ===================================== */}

      <main className="auth-page">

        <div className="auth-background-glow"></div>

        <div className="auth-container">

          {/* =================================
              LEFT SIDE
          ================================= */}

          <div className="auth-intro">

            <div className="auth-brand-icon">
              <BriefcaseBusiness size={25} />
            </div>

            <span className="auth-eyebrow">
              JOIN JOBHUB
            </span>

            <h1>
              Start building your
              <span> future today.</span>
            </h1>

            <p>
              Create your free JobHub account
              and discover thousands of jobs and
              internships designed to help you
              grow your career.
            </p>

            <div className="auth-benefits">

              {/* BENEFIT 01 */}

              <div>

                <span className="benefit-number">
                  01
                </span>

                <div>

                  <strong>
                    Access more opportunities
                  </strong>

                  <p>
                    Explore jobs from leading
                    companies and startups.
                  </p>

                </div>

              </div>

              {/* BENEFIT 02 */}

              <div>

                <span className="benefit-number">
                  02
                </span>

                <div>

                  <strong>
                    Create your profile
                  </strong>

                  <p>
                    Showcase your skills,
                    experience and career goals.
                  </p>

                </div>

              </div>

              {/* BENEFIT 03 */}

              <div>

                <span className="benefit-number">
                  03
                </span>

                <div>

                  <strong>
                    Apply with confidence
                  </strong>

                  <p>
                    Find relevant opportunities
                    and manage applications.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================
              REGISTER CARD
          ================================= */}

          <div className="auth-card register-card">

            <div className="auth-card-header">

              <h2>
                Create your account
              </h2>

              <p>
                Join JobHub and start exploring
                opportunities.
              </p>

            </div>

            {/* =================================
                ERROR MESSAGE
            ================================= */}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* =================================
                REGISTER FORM
            ================================= */}

            <form onSubmit={handleSubmit}>

              {/* FULL NAME */}

              <div className="auth-form-group">

                <label htmlFor="name">
                  Full name
                </label>

                <div className="auth-input-wrapper">

                  <UserRound size={18} />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="auth-form-group">

                <label htmlFor="register-email">
                  Email address
                </label>

                <div className="auth-input-wrapper">

                  <Mail size={18} />

                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="auth-form-group">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-input-wrapper">

                  <Lock size={18} />

                  <input
                    id="register-password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    minLength="6"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <span className="input-help">
                  Use at least 6 characters.
                </span>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="auth-form-group">

                <label htmlFor="confirm-password">
                  Confirm password
                </label>

                <div className="auth-input-wrapper">

                  <Lock size={18} />

                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    minLength="6"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* TERMS */}

              <label className="terms-checkbox">

                <input
                  type="checkbox"
                  required
                />

                <span>

                  I agree to the{" "}

                  <Link to="/">
                    Terms & Conditions
                  </Link>

                  {" "}and{" "}

                  <Link to="/">
                    Privacy Policy
                  </Link>

                  .

                </span>

              </label>

              {/* =================================
                  SUBMIT BUTTON
              ================================= */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

            {/* =================================
                LOGIN LINK
            ================================= */}

            <div className="auth-switch">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign in
              </Link>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Register;