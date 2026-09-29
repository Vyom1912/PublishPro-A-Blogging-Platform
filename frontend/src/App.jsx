import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Home from "./Page/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute/PublicOnlyRoute";

// Every page except Home is loaded on demand, so the first visit only
// downloads what the home page needs (the editor alone is several hundred KB).
const AddBlog = lazy(() => import("./Page/AddBlog/AddBlog"));
const Login = lazy(() => import("./Page/Login/Login"));
const SignUp = lazy(() => import("./Page/SignUp/SignUp"));
const Logout = lazy(() => import("./Page/Logout/Logout"));
const Profile = lazy(() => import("./Page/Profile/Profile"));
const EditProfile = lazy(() => import("./Page/EditProfile/EditProfile"));
const BlogDetails = lazy(() => import("./Page/BlogDetails/BlogDetails"));
const EditBlog = lazy(() => import("./Page/EditBlog/EditBlog"));
const EditPassword = lazy(() => import("./Page/EditPassword/EditPassword"));
const ForgotPassword = lazy(() => import("./Page/ForgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("./Page/ResetPassword/ResetPassword"));
const SavedBlogs = lazy(() => import("./Page/SavedBlogs/SavedBlogs"));
const AuthorProfile = lazy(() => import("./Page/AuthorProfile/AuthorProfile"));

// New page → start at the top (the browser keeps the old scroll position in SPAs)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className='containerBox status-page'>
      <h1>Page not found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
      <Link to='/' className='inputBtn'>
        Go to home
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main className='page'>
        <Suspense fallback={<p className='page-loading'>Loading…</p>}>
          <Routes>
            {/* ── Public routes ─────────────────────────────────────────── */}
            <Route path='/' element={<Home />} />
            <Route path='/blog/:id' element={<BlogDetails />} />
            <Route path='/author/:id' element={<AuthorProfile />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />

            {/* ── Public-only (redirect away if already logged in) ──────── */}
            <Route element={<PublicOnlyRoute />}>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />
            </Route>

            {/* ── Protected (require authentication) ───────────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route path='/add-blog' element={<AddBlog />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/edit-profile' element={<EditProfile />} />
              <Route path='/edit-password' element={<EditPassword />} />
              <Route path='/saved-blogs' element={<SavedBlogs />} />
              <Route path='/edit-blog/:id' element={<EditBlog />} />
              <Route path='/profile/blog/:id' element={<BlogDetails />} />
              <Route path='/logout' element={<Logout />} />
            </Route>

            {/* ── 404 ───────────────────────────────────────────────────── */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;
