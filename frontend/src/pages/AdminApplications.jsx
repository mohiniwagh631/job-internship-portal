import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  MapPin,
  Mail,
  CalendarDays,
} from "lucide-react";

import "../styles/adminApplications.css";

function AdminApplications() {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchApplications = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/applications/admin/all",
        {
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
            "Failed to fetch applications"
        );
      }

      setApplications(
        data.applications || []
      );
    } catch (error) {
      console.error(error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);


  const updateStatus = async (
    id,
    status
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/applications/admin/${id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update status"
        );
      }

      setApplications((prev) =>
        prev.map((application) =>
          application._id === id
            ? {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };


  const downloadResume = async (
    id,
    originalName
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/applications/admin/${id}/resume`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data =
          await response.json();

        throw new Error(
          data.message ||
            "Unable to download resume"
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        originalName ||
        "resume.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };


  return (
    <main className="admin-applications-page">

      <header className="admin-applications-header">

        <div>

          <Link
            to="/admin-dashboard"
            className="admin-applications-back"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <span>
            APPLICATION MANAGEMENT
          </span>

          <h1>
            Applications
          </h1>

          <p>
            Review candidates and manage
            application status.
          </p>

        </div>

      </header>


      {loading && (
        <div>
          Loading applications...
        </div>
      )}


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {!loading &&
        applications.length === 0 && (
          <div className="no-applications">
            <FileText size={45} />

            <h2>
              No applications
            </h2>

            <p>
              Applications will appear here
              when candidates apply.
            </p>
          </div>
        )}


      {!loading &&
        applications.length > 0 && (

          <div className="admin-applications-list">

            {applications.map(
              (application) => (

                <article
                  className="admin-application-card"
                  key={application._id}
                >

                  <div className="candidate-info">

                    <div className="candidate-avatar">
                      {application.candidate
                        ?.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <h2>
                        {application.candidate
                          ?.name}
                      </h2>

                      <p>
                        <Mail size={14} />

                        {application.candidate
                          ?.email}
                      </p>

                    </div>

                  </div>


                  <div className="applied-job">

                    <strong>
                      {application.job
                        ?.title}
                    </strong>

                    <span>
                      {application.job
                        ?.company}
                    </span>

                    <span>
                      <MapPin size={14} />

                      {application.job
                        ?.location}
                    </span>

                  </div>


                  <div className="application-date">

                    <CalendarDays
                      size={15}
                    />

                    {new Date(
                      application.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}

                  </div>


                  <div className="application-status-control">

                    <select
                      value={
                        application.status
                      }
                      onChange={(e) =>
                        updateStatus(
                          application._id,
                          e.target.value
                        )
                      }
                    >

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


                  <button
                    className="resume-button"
                    onClick={() =>
                      downloadResume(
                        application._id,
                        application
                          .resume
                          ?.originalName
                      )
                    }
                  >
                    <FileText size={16} />

                    View Resume
                  </button>

                </article>

              )
            )}

          </div>
        )}

    </main>
  );
}

export default AdminApplications;