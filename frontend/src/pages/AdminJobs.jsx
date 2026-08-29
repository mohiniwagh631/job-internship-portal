import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Power,
  BriefcaseBusiness,
  MapPin,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";

import "../styles/adminJobs.css";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    companyLogo: "",
    title: "",
    description: "",
    location: "",
    type: "Full Time",
    salary: "",
    skills: "",
    eligibility: "",
    experience: "Fresher",
    deadline: "",
  });

  // =====================================
  // FETCH ALL JOBS FOR ADMIN
  // Includes ACTIVE + INACTIVE jobs
  // =====================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/jobs/admin/all",
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
          data.message || "Failed to fetch jobs"
        );
      }

      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Fetch Admin Jobs Error:", err);
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // RESET FORM
  // =====================================

  const resetForm = () => {
    setFormData({
      company: "",
      companyLogo: "",
      title: "",
      description: "",
      location: "",
      type: "Full Time",
      salary: "",
      skills: "",
      eligibility: "",
      experience: "Fresher",
      deadline: "",
    });

    setEditingJob(null);
  };

  // =====================================
  // OPEN CREATE FORM
  // =====================================

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
    setError("");
    setMessage("");
  };

  // =====================================
  // OPEN EDIT FORM
  // =====================================

  const handleEdit = (job) => {
    setEditingJob(job);

    setFormData({
      company: job.company || "",
      companyLogo: job.companyLogo || "",
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      type: job.type || "Full Time",
      salary: job.salary || "",
      skills: job.skills
        ? job.skills.join(", ")
        : "",
      eligibility: job.eligibility || "",
      experience: job.experience || "Fresher",
      deadline: job.deadline
        ? new Date(job.deadline)
            .toISOString()
            .split("T")[0]
        : "",
    });

    setShowForm(true);
    setError("");
    setMessage("");
  };

  // =====================================
  // CREATE / UPDATE JOB
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const url = editingJob
        ? `http://localhost:5000/api/jobs/${editingJob._id}`
        : "http://localhost:5000/api/jobs";

      const method = editingJob ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong"
        );
      }

      setMessage(
        editingJob
          ? "Job updated successfully."
          : "Job created successfully."
      );

      setShowForm(false);
      resetForm();

      await fetchJobs();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // =====================================
  // DELETE JOB
  // =====================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/jobs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete job"
        );
      }

      setMessage("Job deleted successfully.");

      await fetchJobs();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // =====================================
  // ACTIVATE / DEACTIVATE
  // =====================================

  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/jobs/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to change job status"
        );
      }

      setMessage(data.message);

      await fetchJobs();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <main className="admin-jobs-page">

      {/* HEADER */}

      <header className="admin-jobs-header">

        <div>
          <Link
            to="/admin-dashboard"
            className="admin-jobs-back"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <span className="admin-jobs-label">
            JOB MANAGEMENT
          </span>

          <h1>Jobs & Internships</h1>

          <p>
            Create, manage and control job
            opportunities available on JobHub.
          </p>
        </div>

        <button
          className="create-job-button"
          onClick={handleCreate}
        >
          <Plus size={18} />
          Create Job
        </button>

      </header>

      {/* MESSAGES */}

      {message && (
        <div className="admin-success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <section className="admin-job-form-card">

          <div className="admin-form-heading">

            <div>
              <span>
                {editingJob
                  ? "EDIT OPPORTUNITY"
                  : "NEW OPPORTUNITY"}
              </span>

              <h2>
                {editingJob
                  ? "Edit Job"
                  : "Create New Job"}
              </h2>
            </div>

            <button
              type="button"
              className="close-form-button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              <X size={20} />
            </button>

          </div>

          <form
            className="admin-job-form"
            onSubmit={handleSubmit}
          >

            <div className="form-grid">

              <div className="form-group">
                <label>Company Name *</label>

                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Logo URL</label>

                <input
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Job Title *</label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. React Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Pune, India"
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Type *</label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Full Time">
                    Full Time
                  </option>

                  <option value="Part Time">
                    Part Time
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Contract">
                    Contract
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience</label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="Junior">
                    Junior
                  </option>

                  <option value="Mid Level">
                    Mid Level
                  </option>

                  <option value="Senior">
                    Senior
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Salary / Stipend *
                </label>

                <input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹8 LPA"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Application Deadline *
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-group">
              <label>Job Description *</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job..."
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label>Eligibility</label>

              <textarea
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="e.g. B.E/B.Tech Computer Engineering..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Skills</label>

              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Node.js, MongoDB"
              />

              <small>
                Separate skills with commas.
              </small>
            </div>

            <div className="admin-form-actions">

              <button
                type="button"
                className="cancel-job-button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-job-button"
              >
                <Save size={17} />

                {editingJob
                  ? "Update Job"
                  : "Create Job"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* JOB LIST */}

      <section className="admin-jobs-section">

        <div className="admin-jobs-section-heading">
          <div>
            <span>ALL OPPORTUNITIES</span>

            <h2>
              {jobs.length} Jobs
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="admin-jobs-loading">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="admin-no-jobs">

            <BriefcaseBusiness size={40} />

            <h3>No jobs available</h3>

            <p>
              Create your first job opportunity.
            </p>

            <button
              onClick={handleCreate}
              className="create-job-button"
            >
              <Plus size={18} />
              Create Job
            </button>

          </div>
        ) : (
          <div className="admin-jobs-table">

            <div className="admin-jobs-table-header">
              <span>Opportunity</span>
              <span>Location</span>
              <span>Type</span>
              <span>Deadline</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {jobs.map((job) => (

              <div
                className="admin-job-row"
                key={job._id}
              >

                <div className="admin-job-title">

                  <div className="admin-job-logo">

                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt=""
                      />
                    ) : (
                      job.company
                        ?.charAt(0)
                        .toUpperCase()
                    )}

                  </div>

                  <div>

                    <strong>
                      {job.title}
                    </strong>

                    <span>
                      {job.company}
                    </span>

                  </div>

                </div>

                <div className="admin-job-location">
                  <MapPin size={15} />
                  {job.location}
                </div>

                <span className="admin-job-type">
                  {job.type}
                </span>

                <span className="admin-job-deadline">
                  {job.deadline
                    ? new Date(
                        job.deadline
                      ).toLocaleDateString("en-IN")
                    : "—"}
                </span>

                <span
                  className={`admin-job-status ${
                    job.isActive
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {job.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

                <div className="admin-job-actions">

                  <button
                    title="Edit job"
                    onClick={() =>
                      handleEdit(job)
                    }
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    title={
                      job.isActive
                        ? "Deactivate job"
                        : "Activate job"
                    }
                    onClick={() =>
                      handleToggle(job._id)
                    }
                  >
                    <Power size={16} />
                  </button>

                  <button
                    title="Delete job"
                    className="delete-action"
                    onClick={() =>
                      handleDelete(job._id)
                    }
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default AdminJobs;