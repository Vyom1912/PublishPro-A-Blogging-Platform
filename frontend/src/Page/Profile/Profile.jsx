import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "./Profile.css";
import userData from "../../hooks/userData";
import { BlogCardList, ProfileSlider, UserOverview } from "../../components";
import { EditProfile, EditPassword } from "../index.js";

import AddBlog from "../AddBlog/AddBlog";
function Profile() {
  const { user, logout } = useAuth();
  const { stats, myBlogs, savedBlogs, setMyBlogs } = userData(user);

  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return <h2>Please Login</h2>;
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/blogs/${id}`);
      setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className='containerBox'>
        <div className='profile flex'>
          <ProfileSlider
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            logout={logout}
          />

          <main>
            <div className='containerBox '>
              {activeTab === "overview" && 
                  (<UserOverview
                    author={user}
                    stats={stats}
                    blogs={myBlogs}
                    isOwner={true}
                  />)
              }

              {activeTab === "addBlog" && <AddBlog />}

              {activeTab === "myBlogs" && (
                <BlogCardList
                  blogs={myBlogs}
                  showActions={true}
                  isLinked={false}
                  onDelete={handleDelete}
                />
              )}

              {activeTab === "savedBlogs" && (
                <BlogCardList
                  blogs={savedBlogs}
                  showActions={false}
                  isLinked={true}
                  onDelete={handleDelete}
                />
              )}

              {activeTab === "editProfile" && <EditProfile />}

              {activeTab === "editPassword" && <EditPassword />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;
