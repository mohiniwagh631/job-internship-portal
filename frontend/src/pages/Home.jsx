import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  BarChart3,
  Palette,
  Database,
  Megaphone,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import jobs from "../data/jobs";

import "../styles/home.css";

function Home() {
  const categories = [
    {
      icon: Code2,
      title: "Software Development",
      jobs: "2,450+ jobs",
    },
    {
      icon: BarChart3,
      title: "Data & Analytics",
      jobs: "1,180+ jobs",
    },
    {
      icon: Palette,
      title: "Design & Creative",
      jobs: "850+ jobs",
    },
    {
      icon: Database,
      title: "IT & Infrastructure",
      jobs: "1,320+ jobs",
    },
    {
      icon: Megaphone,
      title: "Marketing",
      jobs: "740+ jobs",
    },
    {
      icon: BriefcaseBusiness,
      title: "Business & Finance",
      jobs: "920+ jobs",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="home-page">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="home-hero">

          <div className="container">

            <div className="home-hero-content">

              <div className="home-hero-text">

                <span className="hero-badge">
                  <CheckCircle2 size={15} />
                  Trusted job opportunities
                </span>

                <h1>
                  Find the right job.
                  <br />
                  <span>Build your future.</span>
                </h1>

                <p>
                  Discover jobs and internships from leading companies.
                  Find opportunities that match your skills, experience,
                  and career goals.
                </p>

              </div>


              {/* Search */}

              <div className="home-search">

                <div className="home-search-field">

                  <Search size={21} />

                  <div>
                    <label>What are you looking for?</label>

                    <input
                      type="text"
                      placeholder="Job title, skills or company"
                    />
                  </div>

                </div>


                <div className="home-search-divider" />


                <div className="home-search-field">

                  <MapPin size={21} />

                  <div>
                    <label>Location</label>

                    <input
                      type="text"
                      placeholder="City or remote"
                    />
                  </div>

                </div>


                <Link
                  to="/jobs"
                  className="home-search-button"
                >
                  <Search size={18} />
                  Search Jobs
                </Link>

              </div>


              {/* Popular searches */}

              <div className="popular-searches">

                <span>Popular:</span>

                <Link to="/jobs">React</Link>
                <Link to="/jobs">Java</Link>
                <Link to="/jobs">Python</Link>
                <Link to="/jobs">Data Analyst</Link>
                <Link to="/jobs">Internships</Link>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="home-stats">

          <div className="container">

            <div className="stats-grid">

              <div className="stat-item">
                <strong>10K+</strong>
                <span>Active Jobs</span>
              </div>

              <div className="stat-item">
                <strong>2.5K+</strong>
                <span>Companies</span>
              </div>

              <div className="stat-item">
                <strong>5K+</strong>
                <span>Internships</span>
              </div>

              <div className="stat-item">
                <strong>25K+</strong>
                <span>Job Seekers</span>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <section className="categories-section section">

          <div className="container">

            <div className="section-heading">

              <div>

                <span>EXPLORE OPPORTUNITIES</span>

                <h2>
                  Find jobs by category
                </h2>

                <p>
                  Explore opportunities across popular career fields.
                </p>

              </div>

              <Link
                to="/jobs"
                className="view-all-link"
              >
                View all jobs
                <ArrowRight size={17} />
              </Link>

            </div>


            <div className="categories-grid">

              {categories.map((category) => {

                const Icon = category.icon;

                return (
                  <Link
                    to="/jobs"
                    className="category-card"
                    key={category.title}
                  >

                    <div className="category-icon">
                      <Icon size={22} />
                    </div>

                    <div className="category-content">

                      <h3>{category.title}</h3>

                      <p>{category.jobs}</p>

                    </div>

                    <ArrowRight
                      className="category-arrow"
                      size={18}
                    />

                  </Link>
                );
              })}

            </div>

          </div>

        </section>


        {/* =====================================================
            FEATURED JOBS
        ===================================================== */}

        <section className="featured-section section">

          <div className="container">

            <div className="section-heading">

              <div>

                <span>LATEST OPPORTUNITIES</span>

                <h2>
                  Featured jobs & internships
                </h2>

                <p>
                  Explore some of the latest opportunities from
                  companies hiring now.
                </p>

              </div>

              <Link
                to="/jobs"
                className="view-all-link"
              >
                View all jobs
                <ArrowRight size={17} />
              </Link>

            </div>


            <div className="home-jobs-grid">

              {jobs.slice(0, 3).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                />
              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section className="how-section section">

          <div className="container">

            <div className="section-heading centered-heading">

              <span>HOW IT WORKS</span>

              <h2>
                Start your career in three simple steps
              </h2>

              <p>
                JobHub makes finding and applying for opportunities
                simple and straightforward.
              </p>

            </div>


            <div className="steps-grid">

              <div className="step-card">

                <div className="step-number">
                  01
                </div>

                <h3>Search for opportunities</h3>

                <p>
                  Browse jobs and internships based on your
                  skills, interests, and preferred location.
                </p>

              </div>


              <div className="step-card">

                <div className="step-number">
                  02
                </div>

                <h3>Create your profile</h3>

                <p>
                  Build your professional profile and highlight
                  your skills, experience, and education.
                </p>

              </div>


              <div className="step-card">

                <div className="step-number">
                  03
                </div>

                <h3>Apply and grow</h3>

                <p>
                  Apply to suitable opportunities and take the
                  next step toward your career goals.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="home-cta">

          <div className="container">

            <div className="home-cta-content">

              <div>

                <span>
                  START YOUR CAREER JOURNEY
                </span>

                <h2>
                  Your next opportunity
                  <br />
                  could be one click away.
                </h2>

                <p>
                  Create your free profile and start exploring
                  opportunities today.
                </p>

              </div>


              <div className="cta-actions">

                <Link
                  to="/register"
                  className="primary-cta"
                >
                  Create Free Account
                </Link>

                <Link
                  to="/jobs"
                  className="secondary-cta"
                >
                  Browse Jobs
                  <ArrowRight size={17} />
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Home;