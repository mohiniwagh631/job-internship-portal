import { Link } from "react-router-dom";
import {
  MapPin,
  BriefcaseBusiness,
  ArrowUpRight,
} from "lucide-react";

import "../styles/jobs.css";

function JobCard({ job }) {

  const companyInitial =
    job.company?.charAt(0)?.toUpperCase() || "J";

  return (
    <article className="job-card">

      {/* Top */}
      <div className="job-card-top">

        <div className="company-logo">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
            />
          ) : (
            companyInitial
          )}
        </div>

        <span className="job-type">
          {job.type}
        </span>

      </div>


      {/* Main Content */}
      <div className="job-card-content">

        <p className="company-name">
          {job.company}
        </p>

        <h3>
          {job.title}
        </h3>


        <div className="job-info">

          <span>
            <MapPin size={15} />
            {job.location}
          </span>

          <span>
            <BriefcaseBusiness size={15} />
            {job.experience}
          </span>

        </div>


        {/* Skills */}

        <div className="job-skills">

          {(job.skills || [])
            .slice(0, 3)
            .map((skill) => (

              <span key={skill}>
                {skill}
              </span>

            ))}

        </div>

      </div>


      {/* Bottom */}

      <div className="job-card-bottom">

        <div className="salary-info">

          <small>
            Salary / Stipend
          </small>

          <strong>
            {job.salary}
          </strong>

        </div>


        <Link
          to={`/jobs/${job._id}`}
          className="job-details-button"
          aria-label={`View ${job.title} details`}
        >
          <ArrowUpRight size={18} />
        </Link>

      </div>

    </article>
  );
}

export default JobCard;