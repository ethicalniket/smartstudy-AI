import {

  BrowserRouter,
  Routes,
  Route,
  Navigate

} from "react-router-dom";

import Login from "./pages/Login";
import InterviewPage from "./pages/InterviewPage";

import Register from "./pages/Register";

import SettingsPage from "./pages/SettingsPage";

import ProfilePage from "./pages/ProfilePage";

import UploadPage from "./pages/UploadPage";

import RoutinePage from "./pages/RoutinePage";

import DashboardHome from "./pages/DashboardHome";

import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= DEFAULT ================= */}

        <Route
          path="/"
          element={
            <Navigate to="/login" />
          }
        />

        {/* ================= AUTH ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= DASHBOARD ================= */}

        <Route

          path="/dashboard"

          element={

            <ProtectedRoute>

              <DashboardLayout />

            </ProtectedRoute>

          }

        >

          {/* HOME */}

          <Route
            index
            element={
              <DashboardHome />
            }
          />

          {/* PROFILE */}

          <Route
            path="profile"
            element={
              <ProfilePage />
            }
          />

          {/* SETTINGS */}

          <Route
            path="settings"
            element={
              <SettingsPage />
            }
          />
          <Route
            path="/dashboard/interview"
            element={<InterviewPage />}
          />


          {/* UPLOAD */}

          <Route
            path="upload"
            element={
              <UploadPage />
            }
          />

          {/* ROUTINE */}

          <Route
            path="routine"
            element={
              <RoutinePage />
            }
          />

        </Route>

        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={
            <Navigate to="/login" />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;