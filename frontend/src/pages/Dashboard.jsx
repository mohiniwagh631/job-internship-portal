import {
  LayoutDashboard,
  UserRound,
  FileText,
  Bookmark,
  Bell,
  LogOut,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  ArrowUpRight,
  Menu,
  X,
  GraduationCap,
  Code2,
  Phone,
  Mail,
  Clock,
  XCircle,
  MapPin,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import "../styles/dashboard.css";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [user, setUser] = useState(null);

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [applicationsLoading, setApplicationsLoading] =
    useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = getToken();

      // No token = not logged in
      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      try {
        setLoading(true);
        setError("");

        // =================================================
        // 1. GET USER PROFILE
        // =================================================

        const profileResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/profile`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const profileData =
          await profileResponse.json();

        // Token invalid / expired
        if (
          profileResponse.status === 401
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login", {
            replace: true,
          });

          return;
        }

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message ||
              "Unable to load profile"
          );
        }

        // =================================================
        // REAL USER FROM MONGODB
        // =================================================

        const loggedInUser =
          profileData.user;

        setUser(loggedInUser);

        // Update localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(loggedInUser)
        );

        // =================================================
        // 2. GET MY APPLICATIONS
        // =================================================

        setApplicationsLoading(true);

        try {
          const applicationResponse =
            await fetch(
              `${process.env.REACT_APP_API_URL}/api/applications/my`,
              {
                method: "GET",

                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            );

          const applicationData =
            await applicationResponse.json();

          if (
            applicationResponse.status ===
            401
          ) {
            localStorage.removeItem(
              "token"
            );

            localStorage.removeItem(
              "user"
            );

            navigate("/login", {
              replace: true,
            });

            return;
          }

          if (!applicationResponse.ok) {
            console.error(
              "Application API error:",
              applicationData.message
            );

            setApplications([]);

          } else {
            setApplications(
              applicationData.applications ||
                []
            );
          }

        } catch (applicationError) {
          console.error(
            "Application fetch error:",
            applicationError
          );

          setApplications([]);

        } finally {
          setApplicationsLoading(false);
        }

      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error.message ||
            "Unable to load dashboard"
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login", {
          replace: true,
        });

      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const isActive = (path) => {
    if (location.pathname === path) {
      return "active";
    }

    return "";
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setApplications([]);

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // USER INITIAL
  // =====================================================

  const getInitial = () => {
    if (
      !user ||
      !user.name ||
      user.name.trim() === ""
    ) {
      return "U";
    }

    return user.name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  // =====================================================
  // PROFILE COMPLETION
  // =====================================================

  const calculateProfileCompletion = () => {
    if (!user) {
      return 0;
    }

    let completed = 0;

    const total = 5;

    if (
      user.name &&
      user.name.trim()
    ) {
      completed++;
    }

    if (
      user.phone &&
      user.phone.trim()
    ) {
      completed++;
    }

    if (
      user.education &&
      user.education.trim()
    ) {
      completed++;
    }

    if (
      Array.isArray(user.skills) &&
      user.skills.length > 0
    ) {
      completed++;
    }

    if (
      user.experience &&
      user.experience.trim()
    ) {
      completed++;
    }

    return Math.round(
      (completed / total) * 100
    );
  };

  const profileCompletion =
    calculateProfileCompletion();

  // =====================================================
  // APPLICATION COUNTS
  // =====================================================

  const appliedCount =
    applications.length;

  const shortlistedCount =
    applications.filter(
      (application) =>
        application.status ===
        "Shortlisted"
    ).length;

  const interviewCount =
    applications.filter(
      (application) =>
        application.status ===
        "Interview"
    ).length;

  const selectedCount =
    applications.filter(
      (application) =>
        application.status ===
        "Selected"
    ).length;

  const rejectedCount =
    applications.filter(
      (application) =>
        application.status ===
        "Rejected"
    ).length;

  const inProgressCount =
    applications.filter(
      (application) =>
        application.status ===
          "Applied" ||
        application.status ===
          "Shortlisted" ||
        application.status ===
          "Interview"
    ).length;

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    if (!status) {
      return "";
    }

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="candidate-dashboard">

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >

          <h2>
            Loading your dashboard...
          </h2>

          <p>
            Please wait while we load
            your profile.
          </p>

        </div>

      </main>
    );
  }

  // =====================================================
  // DASHBOARD UI
  // =====================================================

  return (
    <main className="candidate-dashboard">

      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <div className="mobile-dashboard-header">

        <button
          className="dashboard-menu-button"
          onClick={() =>
            setSidebarOpen(true)
          }
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link
          to="/"
          className="dashboard-mobile-logo"
        >
          Job<span>Hub</span>
        </Link>

        <button
          className="mobile-notification-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

      </div>

      {/* =================================================
          OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="dashboard-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`candidate-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        {/* LOGO */}

        <div className="dashboard-logo-wrapper">

          <Link
            to="/"
            className="dashboard-logo"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            Job<span>Hub</span>
          </Link>

          <button
            className="sidebar-close-button"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

        </div>

        {/* USER PROFILE */}

        <div
          className="sidebar-profile"
          onClick={() =>
            goTo("/profile")
          }
          style={{
            cursor: "pointer",
          }}
        >

          <div className="sidebar-avatar">
            {getInitial()}
          </div>

          <div>

            <strong>
              {user?.name ||
                "Job Seeker"}
            </strong>

            <span>
              Job Seeker
            </span>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="dashboard-navigation">

          <p className="navigation-title">
            MENU
          </p>

          {/* DASHBOARD */}

          <button
            type="button"
            className={`dashboard-nav-link ${isActive(
              "/dashboard"
            )}`}
            onClick={() =>
              goTo("/dashboard")
            }
          >
            <LayoutDashboard
              size={19}
            />

            <span>
              Dashboard
            </span>
          </button>

          {/* PROFILE */}

          <button
            type="button"
            className={`dashboard-nav-link ${isActive(
              "/profile"
            )}`}
            onClick={() =>
              goTo("/profile")
            }
          >
            <UserRound
              size={19}
            />

            <span>
              My Profile
            </span>
          </button>

          {/* APPLICATIONS */}

          <button
            type="button"
            className={`dashboard-nav-link ${isActive(
              "/applications"
            )}`}
            onClick={() =>
              goTo("/applications")
            }
          >
            <FileText
              size={19}
            />

            <span>
              Applications
            </span>
          </button>

          {/* SAVED JOBS */}

          

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className="sidebar-find-jobs"
            onClick={() =>
              goTo("/jobs")
            }
          >
            <BriefcaseBusiness
              size={18}
            />

            Find Jobs
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-logout"
          >
            <LogOut size={18} />

            Logout
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="candidate-dashboard-content">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="dashboard-topbar">

          <div>

            <p>
              Candidate Dashboard
            </p>

            <h1>
              Welcome back,{" "}
              {user?.name ||
                "Job Seeker"}{" "}
              👋
            </h1>

          </div>

          <div className="dashboard-topbar-actions">

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            <button
              type="button"
              className="topbar-profile"
              onClick={() =>
                goTo("/profile")
              }
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >

              <div className="topbar-avatar">
                {getInitial()}
              </div>

              <div>

                <strong>
                  {user?.name ||
                    "Job Seeker"}
                </strong>

                <span>
                  Job Seeker
                </span>

              </div>

            </button>

          </div>

        </header>

        {/* ERROR */}

        {error && (
          <div
            style={{
              padding: "14px 18px",
              marginBottom: "20px",
              borderRadius: "10px",
              background:
                "rgba(239,68,68,0.1)",
              border:
                "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            PROFILE COMPLETION
        ================================================= */}

        <section className="profile-completion-card">

          <div className="profile-completion-content">

            <div className="profile-completion-icon">
              <UserRound size={22} />
            </div>

            <div>

              <p className="completion-label">
                PROFILE COMPLETION
              </p>

              <h2>
                {profileCompletion === 100
                  ? "Your profile is complete!"
                  : "Make your profile stand out"}
              </h2>

              <p className="completion-description">
                {profileCompletion === 100
                  ? "Your JobHub profile is ready for recruiters."
                  : "Complete your profile to improve your chances of getting noticed by recruiters."}
              </p>

            </div>

          </div>

          <div className="profile-completion-progress">

            <div className="completion-percentage">

              <strong>
                {profileCompletion}%
              </strong>

              <span>
                Complete
              </span>

            </div>

            <div className="completion-bar">

              <div
                className="completion-bar-fill"
                style={{
                  width: `${profileCompletion}%`,
                }}
              />

            </div>

            {profileCompletion < 100 && (
              <button
                type="button"
                onClick={() =>
                  goTo("/profile")
                }
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                Complete Profile
                <ArrowUpRight
                  size={16}
                />
              </button>
            )}

          </div>

        </section>

        {/* =================================================
            APPLICATION OVERVIEW
        ================================================= */}

        <section className="dashboard-section-block">

          <div className="dashboard-section-title">

            <div>

              <h2>
                Application Overview
              </h2>

              <p>
                Track your job application
                activity.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                goTo("/applications")
              }
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              View Applications
              <ArrowUpRight
                size={16}
              />
            </button>

          </div>

          <div className="application-stat-grid">

            {/* APPLIED */}

            <div className="application-stat-card">

              <div className="application-stat-icon blue">
                <FileText size={21} />
              </div>

              <div>

                <span>
                  Applied Jobs
                </span>

                <strong>
                  {applicationsLoading
                    ? "..."
                    : appliedCount}
                </strong>

              </div>

              <small className="stat-growth">
                {appliedCount === 0
                  ? "No applications yet"
                  : `${appliedCount} application${
                      appliedCount > 1
                        ? "s"
                        : ""
                    } submitted`}
              </small>

            </div>

            {/* INTERVIEWS */}

            <div className="application-stat-card">

              <div className="application-stat-icon purple">
                <CalendarCheck
                  size={21}
                />
              </div>

              <div>

                <span>
                  Interviews
                </span>

                <strong>
                  {applicationsLoading
                    ? "..."
                    : interviewCount}
                </strong>

              </div>

              <small className="stat-growth">
                {interviewCount === 0
                  ? "No interviews yet"
                  : `${interviewCount} interview${
                      interviewCount > 1
                        ? "s"
                        : ""
                    }`}
              </small>

            </div>

            {/* SHORTLISTED */}

            <div className="application-stat-card">

              <div className="application-stat-icon green">
                <CheckCircle2
                  size={21}
                />
              </div>

              <div>

                <span>
                  Shortlisted
                </span>

                <strong>
                  {applicationsLoading
                    ? "..."
                    : shortlistedCount}
                </strong>

              </div>

              <small className="stat-growth">
                {shortlistedCount === 0
                  ? "No shortlisted jobs"
                  : `${shortlistedCount} shortlisted`}
              </small>

            </div>

            {/* SAVED */}

            <div className="application-stat-card">

              <div className="application-stat-icon orange">
                <Bookmark
                  size={21}
                />
              </div>

              <div>

                <span>
                  Saved Jobs
                </span>

                <strong>
                  0
                </strong>

              </div>

              <small className="stat-growth">
                Start saving jobs
              </small>

            </div>

          </div>

        </section>

        {/* =================================================
            APPLICATION STATUS
        ================================================= */}

        {applications.length > 0 && (
          <section className="dashboard-section-block">

            <div className="dashboard-section-title">

              <div>

                <h2>
                  Application Status
                </h2>

                <p>
                  Overview of your current
                  application progress.
                </p>

              </div>

            </div>

            <div className="application-stat-grid">

              <div className="application-stat-card">

                <div className="application-stat-icon green">
                  <CheckCircle2
                    size={21}
                  />
                </div>

                <div>

                  <span>
                    Selected
                  </span>

                  <strong>
                    {selectedCount}
                  </strong>

                </div>

              </div>

              <div className="application-stat-card">

                <div className="application-stat-icon orange">
                  <Clock size={21} />
                </div>

                <div>

                  <span>
                    In Progress
                  </span>

                  <strong>
                    {inProgressCount}
                  </strong>

                </div>

              </div>

              <div className="application-stat-card">

                <div className="application-stat-icon blue">
                  <FileText
                    size={21}
                  />
                </div>

                <div>

                  <span>
                    Total
                  </span>

                  <strong>
                    {appliedCount}
                  </strong>

                </div>

              </div>

              <div className="application-stat-card">

                <div className="application-stat-icon purple">
                  <XCircle
                    size={21}
                  />
                </div>

                <div>

                  <span>
                    Rejected
                  </span>

                  <strong>
                    {rejectedCount}
                  </strong>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            YOUR PROFILE
        ================================================= */}

        <section className="dashboard-section-block">

          <div className="dashboard-section-title">

            <div>

              <h2>
                Your Profile
              </h2>

              <p>
                Your current information
                from JobHub.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                goTo("/profile")
              }
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              Edit Profile
              <ArrowUpRight
                size={16}
              />
            </button>

          </div>

          <div className="application-stat-grid">

            {/* NAME */}

            <div className="application-stat-card">

              <div className="application-stat-icon blue">
                <UserRound
                  size={21}
                />
              </div>

              <div>

                <span>
                  Full Name
                </span>

                <strong>
                  {user?.name ||
                    "Not added"}
                </strong>

              </div>

            </div>

            {/* EMAIL */}

            <div className="application-stat-card">

              <div className="application-stat-icon purple">
                <Mail size={21} />
              </div>

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {user?.email ||
                    "Not added"}
                </strong>

              </div>

            </div>

            {/* PHONE */}

            <div className="application-stat-card">

              <div className="application-stat-icon green">
                <Phone size={21} />
              </div>

              <div>

                <span>
                  Phone
                </span>

                <strong>
                  {user?.phone ||
                    "Not added"}
                </strong>

              </div>

            </div>

            {/* EDUCATION */}

            <div className="application-stat-card">

              <div className="application-stat-icon orange">
                <GraduationCap
                  size={21}
                />
              </div>

              <div>

                <span>
                  Education
                </span>

                <strong>
                  {user?.education ||
                    "Not added"}
                </strong>

              </div>

            </div>

            {/* EXPERIENCE */}

            <div className="application-stat-card">

              <div className="application-stat-icon blue">
                <BriefcaseBusiness
                  size={21}
                />
              </div>

              <div>

                <span>
                  Experience
                </span>

                <strong>
                  {user?.experience ||
                    "Not added"}
                </strong>

              </div>

            </div>

            {/* SKILLS */}

            <div className="application-stat-card">

              <div className="application-stat-icon purple">
                <Code2 size={21} />
              </div>

              <div>

                <span>
                  Skills
                </span>

                <strong>
                  {Array.isArray(
                    user?.skills
                  )
                    ? user.skills.length
                    : 0}
                </strong>

              </div>

              <small className="stat-growth">
                {Array.isArray(
                  user?.skills
                ) &&
                user.skills.length > 0
                  ? user.skills.join(
                      ", "
                    )
                  : "No skills added"}
              </small>

            </div>

          </div>

        </section>

        {/* =================================================
            RECENT APPLICATIONS
        ================================================= */}

        <section className="dashboard-section-block">

          <div className="dashboard-section-title">

            <div>

              <h2>
                Recent Applications
              </h2>

              <p>
                Your recently submitted
                applications.
              </p>

            </div>

            {applications.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  goTo("/applications")
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: "5px",
                }}
              >
                View All
                <ArrowUpRight
                  size={16}
                />
              </button>
            )}

          </div>

          {applicationsLoading ? (

            <div
              className="dashboard-empty-state"
              style={{
                padding:
                  "45px 20px",
                textAlign:
                  "center",
              }}
            >
              <p>
                Loading applications...
              </p>
            </div>

          ) : applications.length === 0 ? (

            <div
              className="dashboard-empty-state"
              style={{
                padding:
                  "45px 20px",
                textAlign:
                  "center",
                borderRadius:
                  "14px",
              }}
            >

              <div
                style={{
                  width: "54px",
                  height: "54px",
                  margin:
                    "0 auto 15px",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  borderRadius:
                    "14px",
                }}
              >
                <FileText
                  size={25}
                />
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Start exploring jobs
                and apply to
                opportunities that
                match your skills.
              </p>

              <button
                type="button"
                onClick={() =>
                  goTo("/jobs")
                }
                style={{
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: "7px",
                  marginTop:
                    "18px",
                  background:
                    "none",
                  border: "none",
                  color:
                    "inherit",
                  cursor:
                    "pointer",
                }}
              >
                Browse Jobs
                <ArrowUpRight
                  size={16}
                />
              </button>

            </div>

          ) : (

            <div className="dashboard-recent-applications">

              {applications
                .slice(0, 3)
                .map(
                  (application) => (

                    <div
                      className="dashboard-application-item"
                      key={
                        application._id
                      }
                    >

                      <div className="dashboard-application-logo">

                        {application.job
                          ?.companyLogo ? (

                          <img
                            src={
                              application
                                .job
                                .companyLogo
                            }
                            alt=""
                          />

                        ) : (

                          application.job
                            ?.company
                            ?.charAt(0)
                            .toUpperCase()

                        )}

                      </div>

                      <div className="dashboard-application-info">

                        <h3>
                          {application.job
                            ?.title ||
                            "Job"}
                        </h3>

                        <p>
                          {application.job
                            ?.company ||
                            "Company"}
                        </p>

                        <span>

                          <MapPin
                            size={14}
                          />

                          {application.job
                            ?.location ||
                            "Location"}

                          <span>
                            •
                          </span>

                          <CalendarCheck
                            size={14}
                          />

                          {formatDate(
                            application.createdAt
                          )}

                        </span>

                      </div>

                      <span
                        className={`status-badge ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                    </div>

                  )
                )}

            </div>

          )}

        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section className="dashboard-job-cta">

          <div>

            <span>
              READY FOR YOUR NEXT
              OPPORTUNITY?
            </span>

            <h2>
              Discover jobs that
              match your skills.
            </h2>

            <p>
              Explore opportunities
              from top companies and
              take the next step in
              your career.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              goTo("/jobs")
            }
            style={{
              display:
                "inline-flex",
              alignItems:
                "center",
              gap: "7px",
              cursor: "pointer",
            }}
          >
            Browse Jobs
            <ArrowUpRight
              size={18}
            />
          </button>

        </section>

      </section>

    </main>
  );
}

export default Dashboard;