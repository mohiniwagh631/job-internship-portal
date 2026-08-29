import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  IndianRupee,
  CheckCircle2,
  Building2,
  X,
  Upload,
} from "lucide-react";

import "../styles/jobDetails.css";

function JobDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================
  // APPLICATION STATES
  // =====================================

  const [showApplyForm, setShowApplyForm] =
    useState(false);

  const [resume, setResume] = useState(null);

  const [coverLetter, setCoverLetter] = useState("");

  const [applied, setApplied] = useState(false);

  const [applicationMessage, setApplicationMessage] =
    useState("");

  const [applicationError, setApplicationError] =
    useState("");

  const [applying, setApplying] = useState(false);

  // =====================================
  // FETCH JOB
  // =====================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/jobs/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Job not found"
          );
        }

        setJob(data.job);

        // Check application only if logged in
        const token =
          localStorage.getItem("token");

        if (token) {
          checkApplication(id, token);
        }

      } catch (err) {
        console.error(
          "Fetch Job Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load job"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // =====================================
  // CHECK APPLICATION
  // =====================================

  const checkApplication = async (
    jobId,
    token
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/check/${jobId}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setApplied(data.applied);
      }

    } catch (error) {
      console.error(
        "Check Application Error:",
        error
      );
    }
  };

  // =====================================
  // OPEN APPLICATION FORM
  // =====================================

  const openApplyForm = () => {

    const token =
      localStorage.getItem("token");

    const userData =
      localStorage.getItem("user");

    // =====================================
    // USER NOT LOGGED IN
    // =====================================

    if (!token || !userData) {

      // Save current job URL
      const returnUrl =
        `/jobs/${id}`;

      // Send user to login
      navigate(
        `/login?redirect=${encodeURIComponent(
          returnUrl
        )}`
      );

      return;
    }

    // =====================================
    // USER LOGGED IN
    // =====================================

    let user = null;

    try {
      user = JSON.parse(userData);
    } catch (error) {
      user = null;
    }

    // Admin cannot apply
    if (user?.role === "admin") {

      setApplicationError(
        "Admin accounts cannot apply for jobs."
      );

      return;
    }

    setApplicationError("");
    setApplicationMessage("");
    setShowApplyForm(true);
  };

  // =====================================
  // CLOSE APPLICATION FORM
  // =====================================

  const closeApplyForm = () => {

    if (applying) return;

    setShowApplyForm(false);

    setResume(null);

    setCoverLetter("");

    setApplicationError("");
  };

  // =====================================
  // HANDLE RESUME
  // =====================================

  const handleResumeChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    setApplicationError("");

    // PDF only

    if (
      file.type !==
      "application/pdf"
    ) {

      setApplicationError(
        "Only PDF resumes are allowed."
      );

      e.target.value = "";

      setResume(null);

      return;
    }

    // 5 MB

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setApplicationError(
        "Resume size must be less than 5 MB."
      );

      e.target.value = "";

      setResume(null);

      return;
    }

    setResume(file);
  };

  // =====================================
  // SUBMIT APPLICATION
  // =====================================

  const handleApply = async (e) => {

    e.preventDefault();

    setApplicationMessage("");

    setApplicationError("");

    // =====================================
    // RESUME VALIDATION
    // =====================================

    if (!resume) {

      setApplicationError(
        "Please upload your resume."
      );

      return;
    }

    if (
      resume.type !==
      "application/pdf"
    ) {

      setApplicationError(
        "Only PDF resumes are allowed."
      );

      return;
    }

    if (
      resume.size >
      5 * 1024 * 1024
    ) {

      setApplicationError(
        "Resume size must be less than 5 MB."
      );

      return;
    }

    // =====================================
    // TOKEN
    // =====================================

    const token =
      localStorage.getItem("token");

    if (!token) {

      navigate(
        `/login?redirect=${encodeURIComponent(
          `/jobs/${id}`
        )}`
      );

      return;
    }

    try {

      setApplying(true);

      // =====================================
      // FORM DATA
      // =====================================

      const formData =
        new FormData();

      formData.append(
        "jobId",
        job._id
      );

      formData.append(
        "resume",
        resume
      );

      formData.append(
        "coverLetter",
        coverLetter
      );

      // =====================================
      // API REQUEST
      // =====================================

      const response =
        await fetch(
          "http://localhost:5000/api/applications",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );

      const data =
        await response.json();

      // =====================================
      // ERROR
      // =====================================

      if (!response.ok) {

        throw new Error(
          data.message ||
            "Application failed"
        );
      }

      // =====================================
      // SUCCESS
      // =====================================

      setApplied(true);

      setShowApplyForm(false);

      setResume(null);

      setCoverLetter("");

      setApplicationMessage(
        "Application submitted successfully!"
      );

    } catch (error) {

      console.error(
        "Application Error:",
        error
      );

      setApplicationError(
        error.message ||
          "Unable to submit application."
      );

    } finally {

      setApplying(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <main className="job-details-page">

        <div className="job-not-found">

          <h1>
            Loading Job...
          </h1>

          <p>
            Please wait while we load
            the opportunity details.
          </p>

        </div>

      </main>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error || !job) {

    return (
      <main className="job-details-page">

        <div className="job-not-found">

          <h1>
            Job Not Found
          </h1>

          <p>
            {error ||
              "The job you are looking for does not exist or may have been removed."}
          </p>

          <Link
            to="/jobs"
            className="back-jobs-button"
          >
            <ArrowLeft size={18} />
            Back to Jobs
          </Link>

        </div>

      </main>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (

    <main className="job-details-page">

      <div className="job-details-container">

        {/* BACK */}

        <Link
          to="/jobs"
          className="back-to-jobs"
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </Link>

        {/* SUCCESS MESSAGE */}

        {applicationMessage && (

          <div className="application-success-message">

            <CheckCircle2 size={18} />

            {applicationMessage}

          </div>

        )}

        {/* ERROR MESSAGE */}

        {applicationError &&
          !showApplyForm && (

            <div className="application-error-message">

              {applicationError}

            </div>

          )}

        {/* =====================================
            JOB HEADER
        ===================================== */}

        <section className="job-details-header">

          <div className="job-details-company">

            <div className="details-company-logo">

              {job.companyLogo ? (

                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                />

              ) : (

                job.company
                  ?.charAt(0)
                  .toUpperCase()

              )}

            </div>

            <div>

              <p className="details-company-name">
                {job.company}
              </p>

              <h1>
                {job.title}
              </h1>

              <div className="details-meta">

                <span>
                  <MapPin size={16} />
                  {job.location}
                </span>

                <span>
                  <BriefcaseBusiness
                    size={16}
                  />
                  {job.experience}
                </span>

                <span>
                  <CalendarDays size={16} />

                  Posted{" "}

                  {job.createdAt
                    ? new Date(
                        job.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Recently"}

                </span>

              </div>

            </div>

          </div>

          <div className="job-header-action">

            <span className="details-job-type">
              {job.type}
            </span>

            {applied ? (

              <div className="applied-badge">

                <CheckCircle2
                  size={17}
                />

                Applied

              </div>

            ) : (

              <button
                className="apply-button"
                onClick={
                  openApplyForm
                }
              >
                Apply Now
              </button>

            )}

          </div>

        </section>

        {/* =====================================
            APPLICATION FORM
        ===================================== */}

        {showApplyForm && (

          <section className="apply-form-card">

            <div className="apply-form-header">

              <div>

                <span className="apply-form-label">
                  APPLICATION
                </span>

                <h2>
                  Apply for {job.title}
                </h2>

                <p>
                  Submit your resume and
                  application details.
                </p>

              </div>

              <button
                type="button"
                className="close-apply-button"
                onClick={
                  closeApplyForm
                }
                disabled={applying}
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleApply}
              className="application-form"
            >

              {/* RESUME */}

              <div className="application-form-group">

                <label>
                  Resume *
                </label>

                <div className="resume-upload-box">

                  <Upload size={22} />

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={
                      handleResumeChange
                    }
                    required
                  />

                  <strong>
                    {resume
                      ? resume.name
                      : "Choose your resume"}
                  </strong>

                  <small>
                    PDF only • Maximum 5 MB
                  </small>

                </div>

              </div>

              {/* COVER LETTER */}

              <div className="application-form-group">

                <label>
                  Cover Letter
                </label>

                <textarea
                  value={coverLetter}
                  onChange={(e) =>
                    setCoverLetter(
                      e.target.value
                    )
                  }
                  placeholder="Write a short cover letter explaining why you are a good fit for this opportunity..."
                  rows="6"
                />

              </div>

              {/* FORM ERROR */}

              {applicationError && (

                <div className="application-form-error">

                  {applicationError}

                </div>

              )}

              {/* BUTTONS */}

              <div className="apply-form-actions">

                <button
                  type="button"
                  className="cancel-apply-button"
                  onClick={
                    closeApplyForm
                  }
                  disabled={applying}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-application-button"
                  disabled={applying}
                >

                  {applying
                    ? "Submitting..."
                    : "Submit Application"}

                </button>

              </div>

            </form>

          </section>

        )}

        {/* =====================================
            DETAILS GRID
        ===================================== */}

        <div className="job-details-grid">

          {/* LEFT */}

          <div className="job-details-main">

            {/* ABOUT */}

            <section className="details-section">

              <h2>
                About the Job
              </h2>

              <p>
                {job.description}
              </p>

            </section>

            {/* ELIGIBILITY */}

            {job.eligibility && (

              <section className="details-section">

                <h2>
                  Eligibility
                </h2>

                <p>
                  {job.eligibility}
                </p>

              </section>

            )}

            {/* RESPONSIBILITIES */}

            {job.responsibilities?.length >
              0 && (

              <section className="details-section">

                <h2>
                  Responsibilities
                </h2>

                <ul className="details-list">

                  {job.responsibilities.map(
                    (item, index) => (

                      <li key={index}>

                        <CheckCircle2
                          size={18}
                        />

                        <span>
                          {item}
                        </span>

                      </li>

                    )
                  )}

                </ul>

              </section>

            )}

            {/* QUALIFICATIONS */}

            {job.qualifications?.length >
              0 && (

              <section className="details-section">

                <h2>
                  Qualifications
                </h2>

                <ul className="details-list">

                  {job.qualifications.map(
                    (item, index) => (

                      <li key={index}>

                        <CheckCircle2
                          size={18}
                        />

                        <span>
                          {item}
                        </span>

                      </li>

                    )
                  )}

                </ul>

              </section>

            )}

            {/* SKILLS */}

            <section className="details-section">

              <h2>
                Required Skills
              </h2>

              <div className="details-skills">

                {job.skills?.map(
                  (skill) => (

                    <span key={skill}>
                      {skill}
                    </span>

                  )
                )}

              </div>

            </section>

          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="job-details-sidebar">

            {/* APPLY CARD */}

            <div className="apply-card">

              <h3>
                Interested in this
                opportunity?
              </h3>

              <p>
                Apply now and take the
                next step toward your
                career.
              </p>

              {applied ? (

                <div className="sidebar-applied">

                  <CheckCircle2
                    size={18}
                  />

                  You have already applied

                </div>

              ) : (

                <button
                  className="sidebar-apply-button"
                  onClick={
                    openApplyForm
                  }
                >
                  Apply Now
                </button>

              )}

            </div>

            {/* OVERVIEW */}

            <div className="overview-card">

              <h3>
                Job Overview
              </h3>

              <div className="overview-item">

                <IndianRupee size={18} />

                <div>

                  <small>
                    Salary / Stipend
                  </small>

                  <strong>
                    {job.salary}
                  </strong>

                </div>

              </div>

              <div className="overview-item">

                <BriefcaseBusiness
                  size={18}
                />

                <div>

                  <small>
                    Job Type
                  </small>

                  <strong>
                    {job.type}
                  </strong>

                </div>

              </div>

              <div className="overview-item">

                <MapPin size={18} />

                <div>

                  <small>
                    Location
                  </small>

                  <strong>
                    {job.location}
                  </strong>

                </div>

              </div>

              <div className="overview-item">

                <Building2 size={18} />

                <div>

                  <small>
                    Company
                  </small>

                  <strong>
                    {job.company}
                  </strong>

                </div>

              </div>

              <div className="overview-item">

                <CalendarDays size={18} />

                <div>

                  <small>
                    Application Deadline
                  </small>

                  <strong>

                    {job.deadline
                      ? new Date(
                          job.deadline
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Not specified"}

                  </strong>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default JobDetails;