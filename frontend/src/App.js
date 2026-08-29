import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==========================================
// PUBLIC PAGES
// ==========================================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

// ==========================================
// CANDIDATE PAGES
// ==========================================
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import MyApplications from "./pages/MyApplications";

// ==========================================
// ADMIN PAGES
// ==========================================
import AdminDashboard from "./pages/AdminDashboard";
import AdminJobs from "./pages/AdminJobs";
import AdminApplications from "./pages/AdminApplications";
import AdminUsers from "./pages/AdminUsers";

// ==========================================
// PROTECTED ROUTE
// ==========================================
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />


        {/* ==========================================
            CANDIDATE DASHBOARD
        ========================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            CANDIDATE PROFILE
        ========================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <MyProfile />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            CANDIDATE APPLICATIONS
        ========================================== */}

        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            SAVED JOBS
        ========================================== */}

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <SavedJobsPlaceholder />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            ADMIN DASHBOARD
        ========================================== */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            ADMIN JOBS
        ========================================== */}

        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminJobs />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            ADMIN APPLICATIONS
        ========================================== */}

        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminApplications />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            ADMIN USERS
        ========================================== */}

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            FALLBACK
        ========================================== */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

    </BrowserRouter>
  );
}


// ==========================================
// TEMPORARY SAVED JOBS PAGE
// ==========================================

function SavedJobsPlaceholder() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "12px",
      }}
    >

      <h1>Saved Jobs</h1>

      <p>
        Your saved jobs will appear here.
      </p>

    </main>
  );
}


export default App;