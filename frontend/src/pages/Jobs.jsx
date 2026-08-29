import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  ChevronDown,
  BriefcaseBusiness,
  RotateCcw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";

import "../styles/jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All");
  const [experience, setExperience] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // =====================================
  // FETCH JOBS FROM BACKEND
  // =====================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/jobs`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch jobs"
          );
        }

        // Backend may return either:
        // { jobs: [...] }
        // or directly [...]
        setJobs(data.jobs || data);
      } catch (err) {
        console.error("Fetch Jobs Error:", err);
        setError("Unable to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // =====================================
  // FILTER JOBS
  // =====================================

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Search
    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((job) => {
        const title = job.title?.toLowerCase() || "";
        const company = job.company?.toLowerCase() || "";
        const description =
          job.description?.toLowerCase() || "";

        const skills = Array.isArray(job.skills)
          ? job.skills
          : [];

        return (
          title.includes(searchText) ||
          company.includes(searchText) ||
          description.includes(searchText) ||
          skills.some((skill) =>
            skill.toLowerCase().includes(searchText)
          )
        );
      });
    }

    // Location
    if (location.trim()) {
      const locationText = location.toLowerCase();

      result = result.filter((job) =>
        job.location
          ?.toLowerCase()
          .includes(locationText)
      );
    }

    // Job Type
    if (jobType !== "All") {
      result = result.filter(
        (job) => job.type === jobType
      );
    }

    // Experience
    if (experience !== "All") {
      result = result.filter(
        (job) => job.experience === experience
      );
    }

    // Sort
    if (sortBy === "company") {
      result.sort((a, b) =>
        (a.company || "").localeCompare(
          b.company || ""
        )
      );
    }

    if (sortBy === "title") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(
          b.title || ""
        )
      );
    }

    if (sortBy === "latest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [
    jobs,
    search,
    location,
    jobType,
    experience,
    sortBy,
  ]);

  // =====================================
  // RESET FILTERS
  // =====================================

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("All");
    setExperience("All");
    setSortBy("latest");
  };

  const hasFilters =
    search ||
    location ||
    jobType !== "All" ||
    experience !== "All";

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="jobs-page">
          <section className="jobs-content section">
            <div className="container">
              <div className="no-jobs">
                <div className="no-jobs-icon">
                  <BriefcaseBusiness size={30} />
                </div>

                <h3>Loading opportunities...</h3>

                <p>
                  Please wait while we fetch the latest
                  jobs and internships.
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <>
        <Navbar />

        <main className="jobs-page">
          <section className="jobs-content section">
            <div className="container">
              <div className="no-jobs">
                <div className="no-jobs-icon">
                  <X size={30} />
                </div>

                <h3>Unable to load jobs</h3>

                <p>{error}</p>

                <button
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="jobs-page">

        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <section className="jobs-header">
          <div className="container">

            <div className="jobs-header-content">

              <div>
                <span className="page-label">
                  CAREER OPPORTUNITIES
                </span>

                <h1>
                  Find your next
                  <span> opportunity.</span>
                </h1>

                <p>
                  Explore jobs and internships from
                  companies looking for talented people
                  like you.
                </p>
              </div>

              <div className="jobs-header-icon">
                <BriefcaseBusiness size={45} />
              </div>

            </div>

            {/* Search */}

            <div className="jobs-search-box">

              <div className="jobs-search-field">

                <Search size={21} />

                <div>
                  <label>Search jobs</label>

                  <input
                    type="text"
                    placeholder="Job title, skills or company"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>

              </div>

              <div className="jobs-search-divider" />

              <div className="jobs-search-field">

                <MapPin size={21} />

                <div>
                  <label>Location</label>

                  <input
                    type="text"
                    placeholder="City or remote"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                  />
                </div>

              </div>

              <button
                className="main-search-button"
                onClick={() => {}}
              >
                <Search size={18} />
                Search
              </button>

            </div>

          </div>
        </section>


        {/* =====================================
            JOB CONTENT
        ===================================== */}

        <section className="jobs-content section">

          <div className="container">

            {/* Mobile Filter */}

            <button
              className="mobile-filter-button"
              onClick={() =>
                setMobileFilterOpen(true)
              }
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>


            <div className="jobs-layout">

              {/* =================================
                  SIDEBAR
              ================================= */}

              <aside
                className={`filters-sidebar ${
                  mobileFilterOpen
                    ? "mobile-active"
                    : ""
                }`}
              >

                <div className="filters-header">

                  <div>
                    <h3>Filters</h3>
                    <p>Refine your search</p>
                  </div>

                  <button
                    className="close-filter"
                    onClick={() =>
                      setMobileFilterOpen(false)
                    }
                  >
                    <X size={20} />
                  </button>

                </div>


                {/* Experience */}

<div className="filter-group">

  <label>Experience Level</label>

  <select
    value={experience}
    onChange={(e) =>
      setExperience(e.target.value)
    }
  >

    <option value="All">
      All experience levels
    </option>

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


                {/* Popular Skills */}

                <div className="filter-group">

                  <label>Popular Skills</label>

                  <div className="skill-filter-list">

                    {[
                      "React",
                      "JavaScript",
                      "Java",
                      "Python",
                      "Node.js",
                      "MongoDB",
                    ].map((skill) => (

                      <button
                        key={skill}
                        onClick={() =>
                          setSearch(skill)
                        }
                        className={
                          search === skill
                            ? "active-skill"
                            : ""
                        }
                      >
                        {skill}
                      </button>

                    ))}

                  </div>

                </div>


                {/* Reset */}

                {hasFilters && (

                  <button
                    className="reset-filters"
                    onClick={resetFilters}
                  >
                    <RotateCcw size={16} />
                    Reset Filters
                  </button>

                )}

              </aside>


              {/* =================================
                  RESULTS
              ================================= */}

              <div className="jobs-results">

                <div className="jobs-results-top">

                  <div>

                    <p className="results-label">
                      JOB SEARCH
                    </p>

                    <h2>
                      {filteredJobs.length}{" "}
                      {filteredJobs.length === 1
                        ? "Opportunity"
                        : "Opportunities"}{" "}
                      Found
                    </h2>

                  </div>


                  <div className="sort-container">

                    <span>Sort by</span>

                    <div className="sort-select">

                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value)
                        }
                      >

                        <option value="latest">
                          Most Recent
                        </option>

                        <option value="company">
                          Company Name
                        </option>

                        <option value="title">
                          Job Title
                        </option>

                      </select>

                      <ChevronDown size={16} />

                    </div>

                  </div>

                </div>


                {/* Active Filters */}

                {hasFilters && (

                  <div className="active-filters">

                    <span>
                      Active filters:
                    </span>

                    {search && (
                      <button
                        onClick={() =>
                          setSearch("")
                        }
                      >
                        {search}
                        <X size={13} />
                      </button>
                    )}

                    {location && (
                      <button
                        onClick={() =>
                          setLocation("")
                        }
                      >
                        {location}
                        <X size={13} />
                      </button>
                    )}

                    {jobType !== "All" && (
                      <button
                        onClick={() =>
                          setJobType("All")
                        }
                      >
                        {jobType}
                        <X size={13} />
                      </button>
                    )}

                    {experience !== "All" && (
                      <button
                        onClick={() =>
                          setExperience("All")
                        }
                      >
                        {experience}
                        <X size={13} />
                      </button>
                    )}

                  </div>

                )}


                {/* Job Cards */}

                {filteredJobs.length > 0 ? (

                  <div className="jobs-page-grid">

                    {filteredJobs.map((job) => (

                      <JobCard
                        key={job._id}
                        job={job}
                      />

                    ))}

                  </div>

                ) : (

                  <div className="no-jobs">

                    <div className="no-jobs-icon">
                      <Search size={30} />
                    </div>

                    <h3>
                      No jobs found
                    </h3>

                    <p>
                      Try changing your search or
                      adjusting the filters.
                    </p>

                    <button
                      onClick={resetFilters}
                    >
                      Clear all filters
                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================
            CTA
        ===================================== */}

        <section className="jobs-cta">

          <div className="container jobs-cta-content">

            <div>

              <span>
                YOUR CAREER STARTS HERE
              </span>

              <h2>
                Don't just find a job.
                <br />
                Find your opportunity.
              </h2>

              <p>
                Create your profile and let great
                opportunities find you.
              </p>

            </div>

            <Link
              to="/register"
              className="jobs-cta-button"
            >
              Create Your Profile
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Jobs;