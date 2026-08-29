import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  FileText,
  ArrowLeft,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import "../styles/myApplications.css";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      // No token
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/applications/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch applications"
          );
        }

        setApplications(data.applications || []);
      } catch (error) {
        console.error(
          "My Applications Error:",
          error
        );

        setError(
          error.message ||
            "Unable to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    if (!status) return "applied";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString(
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
      <main className="my-applications-page">
        <div className="my-applications-container">

          <div className="my-applications-loading">
            <Loader2
              size={32}
              className="applications-loader"
            />

            <h2>
              Loading your applications...
            </h2>

            <p>
              Please wait while we fetch your
              application history.
            </p>
          </div>

        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="my-applications-page">

      <div className="my-applications-container">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Link
          to="/dashboard"
          className="my-applications-back"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="my-applications-header">

          <div className="applications-header-label">
            APPLICATION TRACKER
          </div>

          <h1>
            My Applications
          </h1>

          <p>
            Track all your job and internship
            applications in one place.
          </p>

        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="applications-error">
            <strong>
              Unable to load applications
            </strong>

            <span>
              {error}
            </span>
          </div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!error &&
          applications.length === 0 && (
            <div className="my-applications-empty">

              <div className="empty-icon">
                <BriefcaseBusiness
                  size={30}
                />
              </div>

              <h2>
                No applications yet
              </h2>

              <p>
                You haven't applied for any jobs
                or internships yet.
              </p>

              <Link
                to="/jobs"
                className="browse-jobs-button"
              >
                Browse Jobs
                <ArrowUpRight size={17} />
              </Link>

            </div>
          )}

        {/* =================================================
            APPLICATION LIST
        ================================================= */}

        {applications.length > 0 && (
          <div className="my-applications-list">

            {applications.map(
              (application) => {

                const job =
                  application.job;

                return (
                  <article
                    className="my-application-card"
                    key={application._id}
                  >

                    {/* JOB INFORMATION */}

                    <div className="my-application-job-info">

                      <div className="my-application-logo">

                        {job?.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={
                              job.company ||
                              "Company"
                            }
                          />
                        ) : (
                          job?.company
                            ?.charAt(0)
                            .toUpperCase() || "J"
                        )}

                      </div>

                      <div className="my-application-job-content">

                        <h2>
                          {job?.title ||
                            "Job Opportunity"}
                        </h2>

                        <p className="company-name">
                          {job?.company ||
                            "Company"}
                        </p>

                        <div className="my-application-meta">

                          <span>
                            <MapPin
                              size={15}
                            />

                            {job?.location ||
                              "Location not specified"}
                          </span>

                          <span>
                            <CalendarDays
                              size={15}
                            />

                            Applied on{" "}
                            {formatDate(
                              application.createdAt
                            )}
                          </span>

                          <span>
                            <FileText
                              size={15}
                            />

                            Resume submitted
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* STATUS + ACTION */}

                    <div className="my-application-status">

                      <span
                        className={`my-application-status-badge ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status ||
                          "Applied"}
                      </span>

                      {job?._id && (
                        <Link
                          to={`/jobs/${job._id}`}
                          className="my-application-view-button"
                        >
                          View Job
                          <ArrowUpRight
                            size={15}
                          />
                        </Link>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

    </main>
  );
}

export default MyApplications;