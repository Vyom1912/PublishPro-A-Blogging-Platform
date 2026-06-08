import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  Home,
  AddBlog,
  Login,
  SignUp,
  Logout,
  BlogDetails,
  EditBlog,
  ForgotPassword,
  ResetPassword,
  Dashboard,
} from "./Page";
import AuthorProfile from "./Page/AuthorProfile/AuthorProfile";
import { Navbar } from "./components";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* ── Public ── */}
        <Route path="/"                          element={<Home />} />
        <Route path="/blog/:id"                  element={<BlogDetails />} />
        <Route path="/author/:userId"            element={<AuthorProfile />} />
        <Route path="/login"                     element={<Login />} />
        <Route path="/signup"                    element={<SignUp />} />
        <Route path="/logout"                    element={<Logout />} />
        <Route path="/forgot-password"           element={<ForgotPassword />} />
        <Route path="/reset-password/:token"     element={<ResetPassword />} />

        {/* ── Auth-protected ── */}
        <Route path="/dashboard"                 element={<Dashboard />} />
        <Route path="/add-blog"                  element={<AddBlog />} />
        <Route path="/edit-blog/:id"             element={<EditBlog />} />

        {/* ── Legacy redirects ── */}
        <Route path="/profile"       element={<Navigate to="/dashboard" replace />} />
        <Route path="/edit-profile"  element={<Navigate to="/dashboard?tab=profile" replace />} />
        <Route path="/edit-password" element={<Navigate to="/dashboard?tab=password" replace />} />
        <Route path="/saved-blogs"   element={<Navigate to="/dashboard?tab=saved" replace />} />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div style={{
      textAlign: "center",
      padding: "80px 20px",
      color: "var(--text-muted)",
    }}>
      <p style={{ fontSize: "5rem", lineHeight: 1, marginBottom: 12 }}>404</p>
      <p style={{ fontSize: "1.1rem", marginBottom: 24 }}>Page not found.</p>
      <a href="/" style={{ color: "var(--primary)", fontWeight: 600 }}>
        ← Go home
      </a>
    </div>
  );
}

export default App;
