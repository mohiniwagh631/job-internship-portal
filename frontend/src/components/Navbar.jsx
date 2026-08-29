import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";

import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Get logged-in user
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  const isLoggedIn = !!token && !!user;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    closeMenu();

    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">

        {/* ================================
            LOGO
        ================================= */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span>Job</span>Hub
        </Link>

        {/* ================================
            NAVIGATION
        ================================= */}

        <nav
          className={`navbar-links ${
            menuOpen ? "active" : ""
          }`}
        >

          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/jobs"
            onClick={closeMenu}
          >
            Jobs
          </Link>

          {/* =================================
              LOGGED IN USER
          ================================= */}

          {isLoggedIn ? (
            <>
              <Link
                to={
                  user?.role === "admin"
                    ? "/admin-dashboard"
                    : "/dashboard"
                }
                onClick={closeMenu}
              >
                Dashboard
              </Link>

              {/* Only candidates need My Applications */}

              {user?.role !== "admin" && (
                <Link
                  to="/my-applications"
                  onClick={closeMenu}
                >
                  My Applications
                </Link>
              )}

              {/* USER */}

              <span className="navbar-user">
                <UserCircle size={18} />

                {user?.name || "User"}
              </span>

              {/* LOGOUT */}

              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            /* =================================
               NOT LOGGED IN
            ================================= */

            <>
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="navbar-register"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}

        </nav>

        {/* ================================
            MOBILE MENU
        ================================= */}

        <button
          className="menu-button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>

      </div>
    </header>
  );
}

export default Navbar;