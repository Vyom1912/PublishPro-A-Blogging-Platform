import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  Home,
  AddBlog,
  Login,
  SignUp,
  Logout,
  Profile,
  EditProfile,
  BlogDetails,
  EditBlog,
  EditPassword,
  ForgotPassword,
  ResetPassword,
  SavedBlogs,
  AuthorProfile,
} from "./Page";
import { Navbar, ProtectedRoute, PublicOnlyRoute } from "./components";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* ── Public routes ─────────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/author/:id" element={<AuthorProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ── Public-only (redirect away if already logged in) ──────── */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* ── Protected (require authentication) ───────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/edit-password" element={<EditPassword />} />
          <Route path="/saved-blogs" element={<SavedBlogs />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />
          <Route path="/profile/blog/:id" element={<BlogDetails />} />
          <Route path="/logout" element={<Logout />} />
        </Route>

        {/* ── 404 ───────────────────────────────────────────────────── */}
        <Route path="*" element={<h1>404 — Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
