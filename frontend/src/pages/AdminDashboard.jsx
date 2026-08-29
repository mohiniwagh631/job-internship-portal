import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  FileText,
  LogOut,
  Bell,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Menu,
  X,
  Search,
  RefreshCw,
  UserCheck,
  XCircle,
  CalendarDays,
  MapPin,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useMemo, useState } from "react";

import "../styles/adminDashboard.css";

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [refreshing, setRefreshing] =
    useState(false);

  // =====================================
  // GET ADMIN DATA
  // =====================================

  const storedUser =
    localStorage.getItem("user");

  let admin = {
    name: "Admin",
    email: "",
    role: "admin",
  };

  try {
    if (storedUser) {
      admin = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(
      "Unable to read admin data"
    );
  }

  const adminInitial =
    admin.name?.charAt(0)?.toUpperCase() ||
    "A";

  // =====================================
  // ACTIVE NAVIGATION
  // =====================================

  const isActive = (path) => {
    return location.pathname === path
      ? "active"
      : "";
  };

  // =====================================
  // FETCH DASHBOARD
  // =====================================

  const fetchDashboard = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load dashboard"
        );
      }

      setDashboardData(data);

    } catch (error) {

      console.error(
        "Admin Dashboard Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load dashboard"
      );

      if (
        error.message?.toLowerCase()
          .includes("token")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });
      }

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================
  // FETCH ON PAGE LOAD
  // =====================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================
  // APPLICATION FILTER
  // =====================================

  const filteredApplications =
    useMemo(() => {

      const applications =
        dashboardData?.recentApplications ||
        [];

      return applications.filter(
        (application) => {

          const candidateName =
            application.candidate?.name ||
            "";

          const candidateEmail =
            application.candidate?.email ||
            "";

          const jobTitle =
            application.job?.title ||
            "";

          const company =
            application.job?.company ||
            "";

          const searchText =
            `${candidateName} ${candidateEmail} ${jobTitle} ${company}`
              .toLowerCase();

          const matchesSearch =
            searchText.includes(
              search.toLowerCase().trim()
            );

          const matchesStatus =
            statusFilter === "All" ||
            application.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [
      dashboardData,
      search,
      statusFilter,
    ]);

  // =====================================
  // STATUS CLASS
  // =====================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Applied":
        return "status-applied";

      case "Shortlisted":
        return "status-shortlisted";

      case "Interview":
        return "status-interview";

      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      default:
        return "";
    }
  };

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <main className="admin-dashboard">

        <div className="admin-loading">

          <RefreshCw
            size={30}
            className="loading-icon"
          />

          <h2>
            Loading Admin Dashboard...
          </h2>

          <p>
            Fetching latest data from MongoDB.
          </p>

        </div>

      </main>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error && !dashboardData) {
    return (
      <main className="admin-dashboard">

        <div className="admin-error-page">

          <XCircle size={45} />

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              fetchDashboard()
            }
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  // =====================================
  // DATA
  // =====================================

  const statistics =
    dashboardData?.statistics || {};

  const applicationStats =
    dashboardData?.applicationStats || {};

  const recentJobs =
    dashboardData?.recentJobs || [];

  return (
    <main className="admin-dashboard">

      {/* =================================
          MOBILE HEADER
      ================================= */}

      <header className="admin-mobile-header">

        <button
          className="admin-menu-button"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          <Menu size={21} />
        </button>

        <Link
          to="/"
          className="admin-mobile-logo"
        >
          Job<span>Hub</span>
        </Link>

        <button
          className="admin-mobile-notification"
        >
          <Bell size={19} />
        </button>

      </header>


      {/* =================================
          OVERLAY
      ================================= */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* =================================
          SIDEBAR
      ================================= */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >

        <div className="admin-logo-wrapper">

          <Link
            to="/admin-dashboard"
            className="admin-logo"
          >
            Job<span>Hub</span>
          </Link>

          <button
            className="admin-sidebar-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={21} />
          </button>

        </div>


        {/* ADMIN PROFILE */}

        <div className="admin-profile">

          <div className="admin-avatar">
            {adminInitial}
          </div>

          <div>

            <strong>
              {admin.name || "Admin"}
            </strong>

            <span>
              Administrator
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="admin-navigation">

          <p className="admin-navigation-title">
            MAIN MENU
          </p>

          <Link
            to="/admin-dashboard"
            className={`admin-nav-link ${
              isActive(
                "/admin-dashboard"
              )
            }`}
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>


          <Link
            to="/admin/jobs"
            className={`admin-nav-link ${
              isActive("/admin/jobs")
            }`}
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <BriefcaseBusiness
              size={18}
            />
            Jobs & Internships
          </Link>


          <Link
            to="/admin/applications"
            className={`admin-nav-link ${
              isActive(
                "/admin/applications"
              )
            }`}
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <FileText size={18} />
            Applications
          </Link>


          <Link
            to="/admin/users"
            className={`admin-nav-link ${
              isActive(
                "/admin/users"
              )
            }`}
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Users size={18} />
            Users
          </Link>


          <p className="admin-navigation-title settings-title">
            MANAGEMENT
          </p>


          <Link
            to="/admin/applications"
            className="admin-nav-link"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <UserCheck size={18} />
            Review Applications
          </Link>

        </nav>


        {/* LOGOUT */}

        <div className="admin-sidebar-bottom">

          <button
            onClick={handleLogout}
            className="admin-logout-button"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>


      {/* =================================
          MAIN CONTENT
      ================================= */}

      <section className="admin-main-content">


        {/* =================================
            TOP BAR
        ================================= */}

        <header className="admin-topbar">

          <div className="admin-welcome">

            <span className="admin-page-label">
              ADMIN DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              {admin.name || "Admin"} 👋
            </h1>

            <p>
              Monitor your JobHub platform
              and manage everything from here.
            </p>

          </div>


          <div className="admin-topbar-right">

            <button
              className="admin-notification-button"
            >
              <Bell size={20} />
              <span />
            </button>


            <div className="admin-topbar-profile">

              <div className="admin-topbar-avatar">
                {adminInitial}
              </div>

              <div>

                <strong>
                  {admin.name || "Admin"}
                </strong>

                <span>
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* =================================
            ERROR MESSAGE
        ================================= */}

        {error && (
          <div className="admin-dashboard-error">
            {error}
          </div>
        )}


        {/* =================================
            STATISTICS
        ================================= */}

        <section className="admin-stats-grid">


          {/* TOTAL USERS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon users">
              <Users size={22} />
            </div>

            <div className="admin-stat-content">

              <span>
                Total Users
              </span>

              <strong>
                {statistics.totalUsers || 0}
              </strong>

              <small>
                Registered candidates
              </small>

            </div>

          </div>


          {/* TOTAL JOBS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon jobs">
              <BriefcaseBusiness
                size={22}
              />
            </div>

            <div className="admin-stat-content">

              <span>
                Total Jobs
              </span>

              <strong>
                {statistics.totalJobs || 0}
              </strong>

              <small>
                {statistics.activeJobs || 0} active
              </small>

            </div>

          </div>


          {/* APPLICATIONS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon applications">
              <FileText size={22} />
            </div>

            <div className="admin-stat-content">

              <span>
                Applications
              </span>

              <strong>
                {statistics.totalApplications ||
                  0}
              </strong>

              <small>
                Total received
              </small>

            </div>

          </div>


          {/* SELECTED */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon selected">
              <CheckCircle2
                size={22}
              />
            </div>

            <div className="admin-stat-content">

              <span>
                Selected
              </span>

              <strong>
                {statistics.selectedCandidates ||
                  0}
              </strong>

              <small>
                Successful candidates
              </small>

            </div>

          </div>

        </section>


        {/* =================================
            APPLICATION ANALYTICS
        ================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <span className="section-label">
                ANALYTICS
              </span>

              <h2>
                Application Overview
              </h2>

              <p>
                Current application status
                distribution.
              </p>

            </div>

            <button
              className="admin-refresh-button"
              onClick={() =>
                fetchDashboard(true)
              }
              disabled={refreshing}
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>


          <div className="analytics-grid">


            {/* STATUS CARDS */}

            <div className="analytics-status-grid">

              <div className="analytics-status-card">

                <Clock3 size={18} />

                <div>
                  <span>
                    Applied
                  </span>

                  <strong>
                    {applicationStats.Applied ||
                      0}
                  </strong>
                </div>

              </div>


              <div className="analytics-status-card">

                <UserCheck size={18} />

                <div>
                  <span>
                    Shortlisted
                  </span>

                  <strong>
                    {applicationStats.Shortlisted ||
                      0}
                  </strong>
                </div>

              </div>


              <div className="analytics-status-card">

                <CalendarDays size={18} />

                <div>
                  <span>
                    Interview
                  </span>

                  <strong>
                    {applicationStats.Interview ||
                      0}
                  </strong>
                </div>

              </div>


              <div className="analytics-status-card">

                <CheckCircle2 size={18} />

                <div>
                  <span>
                    Selected
                  </span>

                  <strong>
                    {applicationStats.Selected ||
                      0}
                  </strong>
                </div>

              </div>


              <div className="analytics-status-card">

                <XCircle size={18} />

                <div>
                  <span>
                    Rejected
                  </span>

                  <strong>
                    {applicationStats.Rejected ||
                      0}
                  </strong>
                </div>

              </div>

            </div>


            {/* SIMPLE BAR CHART */}

            <div className="application-chart">

              <div className="chart-header">

                <div>
                  <strong>
                    Application Statistics
                  </strong>

                  <span>
                    Status breakdown
                  </span>
                </div>

              </div>


              <div className="chart-bars">

                {[
                  {
                    label: "Applied",
                    value:
                      applicationStats.Applied ||
                      0,
                  },
                  {
                    label: "Shortlisted",
                    value:
                      applicationStats.Shortlisted ||
                      0,
                  },
                  {
                    label: "Interview",
                    value:
                      applicationStats.Interview ||
                      0,
                  },
                  {
                    label: "Selected",
                    value:
                      applicationStats.Selected ||
                      0,
                  },
                  {
                    label: "Rejected",
                    value:
                      applicationStats.Rejected ||
                      0,
                  },
                ].map((item) => {

                  const total =
                    statistics.totalApplications ||
                    1;

                  const width =
                    Math.min(
                      (item.value /
                        total) *
                        100,
                      100
                    );

                  return (
                    <div
                      className="chart-row"
                      key={item.label}
                    >

                      <div className="chart-label">
                        <span>
                          {item.label}
                        </span>

                        <strong>
                          {item.value}
                        </strong>
                      </div>

                      <div className="chart-track">

                        <div
                          className="chart-bar"
                          style={{
                            width:
                              `${width}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

        </section>


        {/* =================================
            RECENT APPLICATIONS
        ================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <span className="section-label">
                APPLICATIONS
              </span>

              <h2>
                Recent Applications
              </h2>

              <p>
                Review the latest candidate
                applications.
              </p>

            </div>

            <Link
              to="/admin/applications"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>

          </div>


          {/* SEARCH / FILTER */}

          <div className="application-filter-bar">

            <div className="application-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search candidate, email, job or company..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Applied">
                Applied
              </option>

              <option value="Shortlisted">
                Shortlisted
              </option>

              <option value="Interview">
                Interview
              </option>

              <option value="Selected">
                Selected
              </option>

              <option value="Rejected">
                Rejected
              </option>

            </select>

          </div>


          {/* APPLICATION TABLE */}

          <div className="admin-table-wrapper">

            <div className="admin-table-header">

              <span>
                Candidate
              </span>

              <span>
                Opportunity
              </span>

              <span>
                Applied
              </span>

              <span>
                Status
              </span>

              <span>
                Action
              </span>

            </div>


            {filteredApplications.length ===
            0 ? (

              <div className="admin-empty-state">

                <FileText size={30} />

                <p>
                  No applications found.
                </p>

              </div>

            ) : (

              filteredApplications.map(
                (application) => (

                  <div
                    className="admin-application-row"
                    key={
                      application._id
                    }
                  >

                    {/* CANDIDATE */}

                    <div className="admin-candidate">

                      <div className="candidate-avatar">

                        {application
                          .candidate
                          ?.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "U"}

                      </div>

                      <div>

                        <strong>
                          {application
                            .candidate
                            ?.name ||
                            "Unknown"}
                        </strong>

                        <span>
                          {application
                            .candidate
                            ?.email ||
                            "No email"}
                        </span>

                      </div>

                    </div>


                    {/* JOB */}

                    <div className="admin-job-info">

                      <strong>
                        {application
                          .job
                          ?.title ||
                          "Opportunity unavailable"}
                      </strong>

                      <span>
                        {application
                          .job
                          ?.company ||
                          "-"}
                      </span>

                    </div>


                    {/* DATE */}

                    <div className="admin-date">

                      {formatDate(
                        application.createdAt
                      )}

                    </div>


                    {/* STATUS */}

                    <span
                      className={`admin-status ${getStatusClass(
                        application.status
                      )}`}
                    >

                      {application.status}

                    </span>


                    {/* ACTION */}

                    <Link
                      to="/admin/applications"
                      className="admin-view-button"
                    >
                      Review
                      <ArrowUpRight
                        size={14}
                      />
                    </Link>

                  </div>

                )
              )
            )}

          </div>

        </section>


        {/* =================================
            RECENT JOBS
        ================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <span className="section-label">
                OPPORTUNITIES
              </span>

              <h2>
                Recent Job Postings
              </h2>

              <p>
                Latest opportunities added
                to JobHub.
              </p>

            </div>

            <Link
              to="/admin/jobs"
            >
              Manage Jobs
              <ArrowUpRight size={16} />
            </Link>

          </div>


          <div className="recent-jobs-grid">

            {recentJobs.length === 0 ? (

              <div className="admin-empty-state">
                <BriefcaseBusiness
                  size={30}
                />

                <p>
                  No jobs available.
                </p>
              </div>

            ) : (

              recentJobs.map((job) => (

                <article
                  className="recent-job-card"
                  key={job._id}
                >

                  <div className="recent-job-top">

                    <div className="recent-job-icon">
                      <BriefcaseBusiness
                        size={19}
                      />
                    </div>

                    <span
                      className={
                        job.isActive
                          ? "job-active"
                          : "job-inactive"
                      }
                    >
                      {job.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>


                  <h3>
                    {job.title}
                  </h3>

                  <p className="job-company">
                    {job.company}
                  </p>


                  <div className="recent-job-meta">

                    <span>
                      <MapPin size={14} />
                      {job.location ||
                        "Location not specified"}
                    </span>

                    <span>
                      {job.type ||
                        "Job"}
                    </span>

                  </div>


                  <div className="recent-job-footer">

                    <span>
                      <CalendarDays
                        size={14}
                      />

                      {formatDate(
                        job.createdAt
                      )}
                    </span>

                    <Link
                      to="/admin/jobs"
                    >
                      Manage
                      <ArrowUpRight
                        size={14}
                      />
                    </Link>

                  </div>

                </article>

              ))

            )}

          </div>

        </section>


        {/* =================================
            ADMIN QUICK CONTROLS
        ================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <span className="section-label">
                ADMIN CONTROLS
              </span>

              <h2>
                Quick Management
              </h2>

              <p>
                Manage important parts of
                your JobHub platform.
              </p>

            </div>

          </div>


          <div className="admin-control-grid">

            <Link
              to="/admin/users"
              className="admin-control-card"
            >

              <Users size={22} />

              <div>

                <strong>
                  Manage Users
                </strong>

                <span>
                  View and manage registered
                  candidates.
                </span>

              </div>

              <ArrowUpRight
                size={18}
              />

            </Link>


            <Link
              to="/admin/jobs"
              className="admin-control-card"
            >

              <BriefcaseBusiness
                size={22}
              />

              <div>

                <strong>
                  Manage Opportunities
                </strong>

                <span>
                  Create, edit and control
                  job postings.
                </span>

              </div>

              <ArrowUpRight
                size={18}
              />

            </Link>


            <Link
              to="/admin/applications"
              className="admin-control-card"
            >

              <FileText size={22} />

              <div>

                <strong>
                  Manage Applications
                </strong>

                <span>
                  Review candidates and
                  update application status.
                </span>

              </div>

              <ArrowUpRight
                size={18}
              />

            </Link>

          </div>

        </section>


        {/* =================================
            FOOTER NOTICE
        ================================= */}

        <section className="admin-review-banner">

          <div className="review-banner-icon">
            <Clock3 size={20} />
          </div>

          <div>

            <strong>
              Applications requiring review
            </strong>

            <p>
              {applicationStats.Applied || 0}{" "}
              applications are currently
              in the Applied stage.
            </p>

          </div>

          <Link
            to="/admin/applications"
          >
            Review Applications
            <ArrowUpRight size={16} />
          </Link>

        </section>

      </section>

    </main>
  );
}

export default AdminDashboard;