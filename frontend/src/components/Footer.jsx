import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  BriefcaseBusiness,
} from "lucide-react";

import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">

      {/* ================= FOOTER MAIN ================= */}
      <div className="container footer-main">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span>Job</span>Hub
          </Link>

          <p>
            Connecting talented people with meaningful career
            opportunities and helping you build a better future.
          </p>

          <div className="footer-contact">

            <div>
              <Mail size={16} />
              <span>support@jobhub.com</span>
            </div>

            <div>
              <Phone size={16} />
              <span>+91 70588 00432</span>
            </div>

            <div>
              <MapPin size={16} />
              <span>Pune, Maharashtra, India</span>
            </div>

          </div>
        </div>


        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
        </div>


        {/* For Job Seekers */}
        <div className="footer-column">
          <h3>For Job Seekers</h3>

          <Link to="/jobs">Find Jobs</Link>
          <Link to="/jobs">Internships</Link>
          <Link to="/jobs">Career Opportunities</Link>
          <Link to="/register">Create Profile</Link>
        </div>


        {/* For Employers */}
        <div className="footer-column">
          <h3>For Employers</h3>

          <Link to="/register">Post a Job</Link>
          <Link to="/register">Find Candidates</Link>
          <Link to="/register">Employer Account</Link>
          <Link to="/login">Employer Login</Link>
        </div>

      </div>


      {/* ================= FOOTER CTA ================= */}
      <div className="container footer-cta">

        <div>
          <div className="footer-cta-icon">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <h3>Ready to find your next opportunity?</h3>
            <p>
              Explore thousands of jobs and internships on JobHub.
            </p>
          </div>
        </div>

        <Link to="/jobs" className="footer-cta-button">
          Browse Jobs
          <ArrowUpRight size={17} />
        </Link>

      </div>


      {/* ================= FOOTER BOTTOM ================= */}
      <div className="footer-bottom">

        <div className="container footer-bottom-content">

          <p>
            © 2026 <strong>JobHub</strong>. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms & Conditions</Link>
            <Link to="/">Contact</Link>
          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;