import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Mail,
  Lock,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/auth.css";

function Login() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  // Get redirect URL
  const redirect =
    searchParams.get("redirect");

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

    setError("");
  };

  // =====================================
  // LOGIN
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    if (
      !formData.email ||
      !formData.password
    ) {

      setError(
        "Please enter your email and password."
      );

      return;
    }

    try {

      setLoading(true);

      const response =
        await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.message ||
            "Invalid email or password."
        );

        return;
      }

      // =====================================
      // SAVE TOKEN
      // =====================================

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // =====================================
      // SUCCESS
      // =====================================

      setSuccess(
        `Welcome back, ${data.user.name}! Login successful.`
      );

      // =====================================
      // REDIRECT
      // =====================================

      setTimeout(() => {

        // If user came from Apply Now
        if (redirect) {

          navigate(redirect);

          return;
        }

        // Admin
        if (
          data.user.role ===
          "admin"
        ) {

          navigate(
            "/admin-dashboard"
          );

          return;
        }

        // Candidate
        navigate("/dashboard");

      }, 1000);

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================
  // CLOSE SUCCESS
  // =====================================

  const closeSuccess = () => {
    setSuccess("");
  };

  return (
    <>
      <Navbar />

      {/* =================================
          SUCCESS TOAST
      ================================= */}

      {success && (

        <div className="auth-toast auth-toast-success">

          <div className="auth-toast-icon">

            <CheckCircle2 size={22} />

          </div>

          <div className="auth-toast-content">

            <strong>
              Login Successful
            </strong>

            <span>
              {success}
            </span>

          </div>

          <button
            type="button"
            className="auth-toast-close"
            onClick={closeSuccess}
          >

            <X size={17} />

          </button>

        </div>

      )}

      <main className="auth-page">

        <div className="auth-background-glow"></div>

        <div className="auth-container">

          {/* =================================
              LEFT SIDE
          ================================= */}

          <div className="auth-intro">

            <div className="auth-brand-icon">

              <BriefcaseBusiness
                size={25}
              />

            </div>

            <span className="auth-eyebrow">
              WELCOME BACK
            </span>

            <h1>

              Continue your

              <span>
                {" "}career journey.
              </span>

            </h1>

            <p>

              Sign in to access your
              JobHub account, explore
              opportunities, track
              applications, and take the
              next step toward your career.

            </p>

            <div className="auth-benefits">

              <div>

                <span className="benefit-number">
                  01
                </span>

                <div>

                  <strong>
                    Discover opportunities
                  </strong>

                  <p>
                    Find jobs and internships
                    matching your skills.
                  </p>

                </div>

              </div>

              <div>

                <span className="benefit-number">
                  02
                </span>

                <div>

                  <strong>
                    Manage applications
                  </strong>

                  <p>
                    Keep track of your
                    applications in one place.
                  </p>

                </div>

              </div>

              <div>

                <span className="benefit-number">
                  03
                </span>

                <div>

                  <strong>
                    Build your career
                  </strong>

                  <p>
                    Connect with opportunities
                    from leading companies.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================
              LOGIN CARD
          ================================= */}

          <div className="auth-card">

            <div className="auth-card-header">

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to continue to
                your JobHub account.
              </p>

            </div>

            {/* ERROR */}

            {error && (

              <div className="auth-error">

                {error}

              </div>

            )}

            <form
              onSubmit={handleSubmit}
            >

              {/* EMAIL */}

              <div className="auth-form-group">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="auth-input-wrapper">

                  <Mail size={18} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="auth-form-group">

                <div className="auth-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <Link to="/forgot-password">
                    Forgot password?
                  </Link>

                </div>

                <div className="auth-input-wrapper">

                  <Lock size={18} />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                </div>

              </div>

              {/* REMEMBER */}

              <div className="auth-options">

                <label className="remember-me">

                  <input
                    type="checkbox"
                  />

                  <span>
                    Remember me
                  </span>

                </label>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {loading ? (

                  "Signing in..."

                ) : (

                  <>
                    Sign In
                    <ArrowRight
                      size={18}
                    />
                  </>

                )}

              </button>

            </form>

            {/* REGISTER */}

            <div className="auth-switch">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create an account
              </Link>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Login;