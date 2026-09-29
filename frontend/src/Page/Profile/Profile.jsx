import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "./Profile.css";
import useUserData from "../../hooks/useUserData";
import BlogCardList from "../../components/BlogCardList/BlogCardList";
import ProfileSlider from "../../components/ProfileSlider/ProfileSlider";
import UserOverview from "../../components/UserOverview/UserOverview";
import EditProfile from "../EditProfile/EditProfile";
import EditPassword from "../EditPassword/EditPassword";

function Profile() {
  const { user, logout } = useAuth();
  const { stats, myBlogs, savedBlogs, loading, removeBlog } = useUserData(user);

  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    // ProtectedRoute handles the redirect; this is just a safety fallback.
    return null;
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog? This can't be undone.",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/blogs/${id}`);
      removeBlog(id);
    } catch (error) {
      alert(error.response?.data?.message || "Couldn't delete the blog");
    }
  };

  return (
    <div className='containerBox'>
      <div className='profile'>
        <ProfileSlider
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          logout={logout}
        />

        <section className='profile-main'>
          {activeTab === "overview" && (
            <UserOverview
              author={user}
              stats={stats}
              blogs={myBlogs}
              isOwner={true}
              loading={loading}
              onViewAll={() => setActiveTab("myBlogs")}
            />
          )}

          {activeTab === "myBlogs" && (
            <BlogCardList
              blogs={myBlogs}
              showActions={true}
              label={"My Blogs"}
              onDelete={handleDelete}
              loading={loading}
              emptyText="You haven't published anything yet."
              emptyAction={{ to: "/add-blog", label: "Write your first blog" }}
            />
          )}

          {activeTab === "savedBlogs" && (
            <BlogCardList
              blogs={savedBlogs}
              showActions={false}
              label={"Saved Blogs"}
              loading={loading}
              emptyText='Blogs you save will show up here.'
              emptyAction={{ to: "/", label: "Browse blogs" }}
            />
          )}

          {activeTab === "editProfile" && (
            <EditProfile onSaved={() => setActiveTab("overview")} />
          )}

          {activeTab === "editPassword" && <EditPassword />}
        </section>
      </div>
    </div>
  );
}

export default Profile;
