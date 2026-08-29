import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Mail,
  Shield,
  UserCircle,
  RefreshCw,
} from "lucide-react";

import "../styles/adminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Fetch users error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="admin-users-page">

      {/* HEADER */}

      <header className="admin-users-header">

        <div>

          <Link
            to="/admin-dashboard"
            className="admin-users-back"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <span className="admin-section-label">
            USER MANAGEMENT
          </span>

          <h1>
            Users
          </h1>

          <p>
            View and manage registered JobHub users.
          </p>

        </div>

        <button
          className="admin-refresh-btn"
          onClick={fetchUsers}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </header>


      {/* LOADING */}

      {loading && (
        <div className="admin-loading">
          Loading users...
        </div>
      )}


      {/* ERROR */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      {/* USERS */}

      {!loading && !error && (

        <section className="users-section">

          <div className="users-section-header">

            <div>

              <h2>
                Registered Users
              </h2>

              <p>
                {users.length} users registered on JobHub
              </p>

            </div>

            <div className="users-count">
              <Users size={18} />
              {users.length}
            </div>

          </div>


          {users.length === 0 ? (

            <div className="no-users">

              <Users size={45} />

              <h2>
                No users found
              </h2>

              <p>
                Registered users will appear here.
              </p>

            </div>

          ) : (

            <div className="users-table-wrapper">

              <table className="users-table">

                <thead>

                  <tr>

                    <th>
                      User
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Joined
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr key={user._id}>

                      <td>

                        <div className="user-name-cell">

                          <div className="user-avatar">

                            {user.name
                              ?.charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {user.name || "Unknown User"}
                            </strong>

                            <span>
                              Candidate
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>

                        <div className="user-email">

                          <Mail size={15} />

                          {user.email}

                        </div>

                      </td>


                      <td>

                        <span
                          className={`role-badge ${
                            user.role === "admin"
                              ? "admin-role"
                              : "user-role"
                          }`}
                        >

                          {user.role === "admin" ? (
                            <Shield size={14} />
                          ) : (
                            <UserCircle size={14} />
                          )}

                          {user.role || "user"}

                        </span>

                      </td>


                      <td>

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      )}

    </main>
  );
}

export default AdminUsers;