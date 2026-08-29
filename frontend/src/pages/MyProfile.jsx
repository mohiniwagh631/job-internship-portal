import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  BriefcaseBusiness,
  Code2,
  Save,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import "../styles/myProfile.css";

function MyProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // FETCH PROFILE
  // =====================================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        const user = data.user;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          education: user.education || "",
          experience: user.experience || "",
          skills: Array.isArray(user.skills)
            ? user.skills.join(", ")
            : "",
        });

      } catch (error) {
        console.error("Profile error:", error);

        setError(
          error.message || "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);


  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };


  // =====================================
  // UPDATE PROFILE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      // Convert comma-separated skills into array
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            education: formData.education,
            experience: formData.experience,
            skills: skillsArray,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      // Update localStorage user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Update form with returned data
      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        education: data.user.education || "",
        experience: data.user.experience || "",
        skills: Array.isArray(data.user.skills)
          ? data.user.skills.join(", ")
          : "",
      });

      setSuccess(
        "Profile updated successfully!"
      );

    } catch (error) {
      console.error("Update profile error:", error);

      setError(
        error.message || "Unable to update profile"
      );

    } finally {
      setSaving(false);
    }
  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          <h2>Loading profile...</h2>
          <p>Please wait.</p>
        </div>
      </main>
    );
  }


  // =====================================
  // PAGE
  // =====================================

  return (
    <main className="profile-page">

      {/* HEADER */}

      <header className="profile-page-header">

        <div>

          <Link
            to="/dashboard"
            className="profile-back-link"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <span className="profile-eyebrow">
            MY PROFILE
          </span>

          <h1>
            Build your professional profile
          </h1>

          <p>
            Keep your information updated so recruiters
            can better understand your skills and experience.
          </p>

        </div>

      </header>


      {/* SUCCESS */}

      {success && (
        <div className="profile-success">
          <CheckCircle2 size={19} />
          {success}
        </div>
      )}


      {/* ERROR */}

      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}


      {/* FORM */}

      <form
        className="profile-form-card"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <section className="profile-form-section">

          <div className="profile-section-heading">

            <div className="profile-section-icon">
              <UserRound size={21} />
            </div>

            <div>
              <h2>Basic Information</h2>

              <p>
                Your basic account information.
              </p>
            </div>

          </div>


          <div className="profile-form-grid">

            {/* NAME */}

            <div className="profile-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="profile-input-wrapper">

                <UserRound size={18} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="profile-input-wrapper">

                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                />

              </div>

              <small>
                Email cannot be changed.
              </small>

            </div>


            {/* PHONE */}

            <div className="profile-form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="profile-input-wrapper">

                <Phone size={18} />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />

              </div>

            </div>


            {/* EDUCATION */}

            <div className="profile-form-group">

              <label htmlFor="education">
                Education
              </label>

              <div className="profile-input-wrapper">

                <GraduationCap size={18} />

                <input
                  id="education"
                  name="education"
                  type="text"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech Computer Engineering"
                />

              </div>

            </div>

          </div>

        </section>


        {/* PROFESSIONAL INFORMATION */}

        <section className="profile-form-section">

          <div className="profile-section-heading">

            <div className="profile-section-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <h2>Professional Information</h2>

              <p>
                Tell recruiters about your experience and skills.
              </p>
            </div>

          </div>


          {/* EXPERIENCE */}

          <div className="profile-form-group">

            <label htmlFor="experience">
              Experience
            </label>

            <div className="profile-input-wrapper">

              <BriefcaseBusiness size={18} />

              <input
                id="experience"
                name="experience"
                type="text"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. Fresher / 1 year / 2 years"
              />

            </div>

          </div>


          {/* SKILLS */}

          <div className="profile-form-group">

            <label htmlFor="skills">
              Skills
            </label>

            <div className="profile-input-wrapper">

              <Code2 size={18} />

              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Node.js, MongoDB"
              />

            </div>

            <small>
              Separate multiple skills using commas.
            </small>

          </div>

        </section>


        {/* ACTIONS */}

        <div className="profile-form-actions">

          <Link
            to="/dashboard"
            className="profile-cancel-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="profile-save-button"
            disabled={saving}
          >

            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Profile"}

          </button>

        </div>

      </form>

    </main>
  );
}

export default MyProfile;