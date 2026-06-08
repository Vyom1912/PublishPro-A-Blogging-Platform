import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";
import { Card } from "../../components";
import { FaCamera } from "react-icons/fa";
import "./Dashboard.css";

/* ─── Reading-history helpers (exported so BlogDetails can use them) ─── */
export const HISTORY_KEY = "readingHistory";
const MAX_HISTORY = 20;

export const addToReadingHistory = (blogId) => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    const deduped = history.filter((id) => id !== blogId);
    deduped.unshift(blogId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(deduped.slice(0, MAX_HISTORY)));
  } catch { /* ignore */ }
};

/* ─── Sidebar tab definitions ─── */
const TABS = [
  { id: "overview",  label: "Overview",        icon: "📊" },
  { id: "my-blogs",  label: "My Blogs",         icon: "📝" },
  { id: "saved",     label: "Saved Blogs",      icon: "🔖" },
  { id: "history",   label: "Reading History",  icon: "👀" },
  { id: "profile",   label: "Edit Profile",     icon: "👤" },
  { id: "password",  label: "Change Password",  icon: "🔒" },
];

/* ════════════════════════════════════════════
   Main component
════════════════════════════════════════════ */
function Dashboard() {
  const { user, setUser, logout, loading } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /* Sync active tab with ?tab= query param so links can deep-link */
  const activeTab = searchParams.get("tab") || "overview";
  const setTab = (id) => setSearchParams({ tab: id });

  /* Data */
  const [stats, setStats] = useState({ totalBlogs: 0, totalLikes: 0, totalViews: 0, totalSaved: 0 });
  const [myBlogs, setMyBlogs]           = useState([]);
  const [savedBlogs, setSavedBlogs]     = useState([]);
  const [historyBlogs, setHistoryBlogs] = useState([]);
  const [dataLoading, setDataLoading]   = useState(true);

  /* Profile-edit state */
  const [profileForm, setProfileForm] = useState({ name: "", email: "", about: "" });
  const [profileImage, setProfileImage]     = useState(null);
  const [profilePreview, setProfilePreview] = useState(""); // confirmed saved avatar (sidebar)
  const [pendingPreview, setPendingPreview] = useState(""); // live preview inside the form only
  const [profileMsg, setProfileMsg]         = useState(null);
  const [profileSaving, setProfileSaving]   = useState(false);

  /* Password-change state */
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg,  setPwMsg]  = useState(null);
  const [pwSaving, setPwSaving] = useState(false);

  /* Mobile sidebar toggle */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ─── Initialise ─── */
  useEffect(() => {
    if (!user) return;
    setProfileForm({ name: user.name || "", email: user.email || "", about: user.about || "" });
    setProfilePreview(user.image || "");
    setPendingPreview(user.image || "");
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setDataLoading(true);
    await Promise.all([fetchStats(), fetchMyBlogs(), fetchSaved(), fetchHistory()]);
    setDataLoading(false);
  };

  const fetchStats = async () => {
    try {
      const r = await api.get("/users/dashboard-stats");
      setStats(r.data.stats);
    } catch (e) { console.log(e); }
  };

  const fetchMyBlogs = async () => {
    try {
      const r = await api.get("/blogs/my-blogs");
      setMyBlogs(r.data.blogs);
    } catch (e) { console.log(e); }
  };

  const fetchSaved = async () => {
    try {
      const r = await api.get("/users/saved-blogs");
      setSavedBlogs(r.data.blogs);
    } catch (e) { console.log(e); }
  };

  const fetchHistory = async () => {
    try {
      const ids = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (!ids.length) return;
      const results = await Promise.allSettled(ids.map((id) => api.get(`/blogs/${id}`)));
      setHistoryBlogs(results.filter((r) => r.status === "fulfilled").map((r) => r.value.data));
    } catch (e) { console.log(e); }
  };

  /* ─── Blog actions ─── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog? This cannot be undone.")) return;
    try {
      await api.delete(`/blogs/${id}`);
      setMyBlogs((p) => p.filter((b) => b._id !== id));
      fetchStats();
    } catch (e) { console.log(e); }
  };

  /* ─── Profile save ─── */
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const fd = new FormData();
      fd.append("name", profileForm.name);
      fd.append("email", profileForm.email);
      fd.append("about", profileForm.about);
      if (profileImage) fd.append("image", profileImage);
      const r = await api.put("/users/profile", fd);
      setUser({ ...r.data.user, id: r.data.user._id });
      // Only update sidebar avatar AFTER successful save
      const savedImage = r.data.user.image || "";
      setProfilePreview(savedImage);
      setPendingPreview(savedImage);
      setProfileImage(null);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Update failed." });
    } finally {
      setProfileSaving(false);
    }
  };

  /* ─── Password save ─── */
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "New passwords don't match." });
      return;
    }
    if (pwForm.next.length < 8) {
      setPwMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      const r = await api.put("/users/change-password", {
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
      });
      setPwMsg({ type: "success", text: r.data.message || "Password changed!" });
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.message || "Something went wrong." });
    } finally {
      setPwSaving(false);
    }
  };

  /* ─── Logout ─── */
  const handleLogout = () => {
    logout();
    sessionStorage.clear();   // clear view-dedup keys
    navigate("/login");
  };

  /* ─── Gate ─── */
  if (loading) {
    // App is still verifying the token — don't flash the login gate
    return (
      <div className="loading-center" style={{ minHeight: "60vh" }}>
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="loading-center" style={{ minHeight: "60vh" }}>
        <span className="empty-icon">🔒</span>
        <p>Please <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>log in</Link> to view your dashboard.</p>
      </div>
    );
  }

  /* ─── Render ─── */
  return (
    <div className="dash-root">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`dash-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dash-sidebar-top">
          {/* Avatar */}
          <div className="dash-sb-avatar">
            {profilePreview ? (
              <img src={profilePreview} alt={user.name} />
            ) : (
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <p className="dash-sb-name">{user.name}</p>
          <p className="dash-sb-email">{user.email}</p>
        </div>

        <nav className="dash-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`dash-nav-item${activeTab === tab.id ? " active" : ""}`}
              onClick={() => { setTab(tab.id); setSidebarOpen(false); }}
            >
              <span className="dash-nav-icon">{tab.icon}</span>
              <span className="dash-nav-label">{tab.label}</span>
              {tab.id === "my-blogs" && myBlogs.length > 0 && (
                <span className="dash-nav-badge">{myBlogs.length}</span>
              )}
              {tab.id === "saved" && savedBlogs.length > 0 && (
                <span className="dash-nav-badge">{savedBlogs.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="dash-sb-footer">
          <button className="dash-theme-btn" onClick={toggleTheme}>
            {dark ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
          <Link to="/add-blog" className="btn btn-primary btn-sm btn-full" style={{ textAlign: "center" }}>
            + New Blog
          </Link>
          <button className="btn btn-danger-outline btn-sm btn-full" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="dash-body">
        {/* Mobile header */}
        <div className="dash-mobile-header">
          <button className="dash-hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="dash-mobile-title">
            {TABS.find((t) => t.id === activeTab)?.label}
          </span>
        </div>

        <main className="dash-main">
          {dataLoading ? (
            <div className="loading-center">
              <div className="spinner" />
              <p>Loading your dashboard…</p>
            </div>
          ) : (
            <>
              {activeTab === "overview"  && <TabOverview stats={stats} myBlogs={myBlogs} onDelete={handleDelete} onSeeAll={() => setTab("my-blogs")} />}
              {activeTab === "my-blogs"  && <TabMyBlogs  myBlogs={myBlogs} onDelete={handleDelete} />}
              {activeTab === "saved"     && <TabSaved    savedBlogs={savedBlogs} />}
              {activeTab === "history"   && <TabHistory  historyBlogs={historyBlogs} onClear={() => { localStorage.removeItem(HISTORY_KEY); setHistoryBlogs([]); }} />}
              {activeTab === "profile"   && (
                <TabEditProfile
                  form={profileForm}
                  setForm={setProfileForm}
                  preview={pendingPreview}
                  onImageChange={(file) => {
                    setProfileImage(file);
                    setPendingPreview(URL.createObjectURL(file)); // local preview only
                  }}
                  onSubmit={handleProfileSave}
                  saving={profileSaving}
                  msg={profileMsg}
                />
              )}
              {activeTab === "password"  && (
                <TabChangePassword
                  form={pwForm}
                  setForm={setPwForm}
                  onSubmit={handlePasswordSave}
                  saving={pwSaving}
                  msg={pwMsg}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Tab: Overview
════════════════════════════════════════════ */
function TabOverview({ stats, myBlogs, onDelete, onSeeAll }) {
  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Welcome back 👋</h2>
      <p className="dash-section-sub">Here's a snapshot of your activity.</p>

      <div className="stats-grid">
        <StatCard icon="📝" value={stats.totalBlogs}  label="Posts"          color="var(--primary)" />
        <StatCard icon="❤️" value={stats.totalLikes}  label="Likes Received" color="#e05a8a" />
        <StatCard icon="👁️" value={stats.totalViews}  label="Total Views"    color="#0ea5e9" />
        <StatCard icon="🔖" value={stats.totalSaved}  label="Saved Blogs"    color="#f59e0b" />
      </div>

      <div className="dash-section-header" style={{ marginTop: 32 }}>
        <h3 className="dash-subsection-title">Recent Posts</h3>
        {myBlogs.length > 3 && (
          <button className="btn btn-ghost btn-sm" onClick={onSeeAll}>
            View all →
          </button>
        )}
      </div>

      {myBlogs.length === 0 ? (
        <EmptyState icon="✍️" message="No posts yet." cta="Write your first blog" href="/add-blog" />
      ) : (
        <div className="dash-grid">
          {myBlogs.slice(0, 3).map((b) => (
            <BlogCard key={b._id} blog={b} onDelete={onDelete} showActions />
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   Tab: My Blogs
════════════════════════════════════════════ */
function TabMyBlogs({ myBlogs, onDelete }) {
  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h2 className="dash-section-title">My Blogs</h2>
        <Link to="/add-blog" className="btn btn-primary btn-sm">+ New Blog</Link>
      </div>
      {myBlogs.length === 0 ? (
        <EmptyState icon="📝" message="You haven't written any blogs yet." cta="Write your first blog" href="/add-blog" />
      ) : (
        <div className="dash-grid">
          {myBlogs.map((b) => <BlogCard key={b._id} blog={b} onDelete={onDelete} showActions />)}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   Tab: Saved
════════════════════════════════════════════ */
function TabSaved({ savedBlogs }) {
  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Saved Blogs</h2>
      {savedBlogs.length === 0 ? (
        <EmptyState icon="🔖" message="No saved blogs yet." cta="Browse blogs" href="/" />
      ) : (
        <div className="dash-grid">
          {savedBlogs.map((b) => (
            <Link to={`/blog/${b._id}`} key={b._id} className="card-link">
              <Card id={b._id} title={b.title} imgSrc={b.featuredImage} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   Tab: History
════════════════════════════════════════════ */
function TabHistory({ historyBlogs, onClear }) {
  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h2 className="dash-section-title">Reading History</h2>
        {historyBlogs.length > 0 && (
          <button className="btn btn-danger-outline btn-sm" onClick={onClear}>
            Clear History
          </button>
        )}
      </div>
      {historyBlogs.length === 0 ? (
        <EmptyState icon="👀" message="No reading history yet." cta="Browse blogs" href="/" />
      ) : (
        <div className="dash-grid">
          {historyBlogs.map((b) => (
            <Link to={`/blog/${b._id}`} key={b._id} className="card-link">
              <Card id={b._id} title={b.title} imgSrc={b.featuredImage} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   Tab: Edit Profile  (inline form)
════════════════════════════════════════════ */
function TabEditProfile({ form, setForm, preview, onImageChange, onSubmit, saving, msg }) {
  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Edit Profile</h2>
      <p className="dash-section-sub">Update your public-facing info and avatar.</p>

      <div className="pg-card" style={{ maxWidth: 560 }}>
        <form className="pg-form" onSubmit={onSubmit}>
          {/* Avatar picker */}
          <div className="prof-avatar-wrap">
            <label htmlFor="dash-img-input" className="prof-avatar-label">
              <div className="prof-avatar">
                {preview ? (
                  <img src={preview} alt="avatar" />
                ) : (
                  <span className="prof-avatar-init">
                    {form.name?.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="prof-avatar-overlay">
                  <FaCamera />
                </div>
              </div>
              <span className="prof-avatar-hint">Change photo</span>
            </label>
            <input
              id="dash-img-input"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => { if (e.target.files[0]) onImageChange(e.target.files[0]); }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="pf-name">Name</label>
            <input
              id="pf-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="pf-email">Email</label>
            <input
              id="pf-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Your email"
            />
          </div>

          <div className="form-field">
            <label htmlFor="pf-about">About</label>
            <textarea
              id="pf-about"
              rows={4}
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              placeholder="Tell readers a little about yourself…"
            />
          </div>

          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Tab: Change Password  (inline form)
   NOTE: PasswordField is NOT a sub-component — it's a plain helper
   that returns JSX. Defining it as a component inside TabChangePassword
   would cause React to remount the input on every keystroke (focus loss).
════════════════════════════════════════════ */
function TabChangePassword({ form, setForm, onSubmit, saving, msg }) {
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const toggle = (k) => setShow((p) => ({ ...p, [k]: !p[k] }));

  // Inline render — NOT a React component (no capital letter)
  const pwField = (id, label, fieldKey) => (
    <div className="form-field" key={fieldKey}>
      <label htmlFor={id}>{label}</label>
      <div className="pw-input-wrap">
        <input
          id={id}
          type={show[fieldKey] ? "text" : "password"}
          value={form[fieldKey]}
          onChange={(e) => setForm({ ...form, [fieldKey]: e.target.value })}
          placeholder="••••••••"
          autoComplete={fieldKey === "current" ? "current-password" : "new-password"}
        />
        <button type="button" className="pw-toggle" onClick={() => toggle(fieldKey)}>
          {show[fieldKey] ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Change Password</h2>
      <p className="dash-section-sub">Keep your account secure with a strong password.</p>

      <div className="pg-card" style={{ maxWidth: 480 }}>
        <form className="pg-form" onSubmit={onSubmit}>
          {pwField("pw-current", "Current Password",      "current")}
          {pwField("pw-next",    "New Password",           "next")}
          {pwField("pw-confirm", "Confirm New Password",   "confirm")}

          <div className="pw-rules">
            Password must be at least 8 characters, include a number and a mix of cases.
          </div>

          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
            {saving ? "Updating…" : "Update Password"}
          </button>

          <div style={{ textAlign: "center" }}>
            <Link to="/forgot-password" style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Shared sub-components
════════════════════════════════════════════ */
function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card" style={{ "--accent": color }}>
      <span className="stat-icon">{icon}</span>
      <span className="stat-number">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function BlogCard({ blog, onDelete, showActions }) {
  return (
    <div className="dash-blog-card">
      <Link to={`/blog/${blog._id}`} className="card-link">
        <Card id={blog._id} title={blog.title} imgSrc={blog.featuredImage} />
      </Link>
      <div className="dash-card-meta">
        <span>❤️ {blog.likes?.length ?? 0}</span>
        <span>👁️ {blog.views ?? 0}</span>
      </div>
      {showActions && (
        <div className="dash-card-actions">
          <Link to={`/edit-blog/${blog._id}`} className="btn btn-outline btn-sm">Edit</Link>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(blog._id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, message, cta, href }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <p>{message}</p>
      <Link to={href} className="btn btn-primary btn-sm">{cta}</Link>
    </div>
  );
}

export default Dashboard;
