import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaCamera } from "react-icons/fa";

import "./EditProfile.css";
import InputBox from "../../components/InputBox/InputBox";

function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    about: user?.about || "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(user?.image || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData({
      ...formData,
      image: file,
    });

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("about", formData.about);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await api.put("/users/profile", data);
      console.log(res.data);

      setUser(res.data.user);

      navigate("/profile");
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  if (!user) {
    return null; // ProtectedRoute handles redirect
  }

  return (
    <div className='formBox flex'>
      <form onSubmit={handleSubmit} className='flex formContainer'>
        <div className='avatar-container'>
          <label htmlFor='profile-image'>
            <img src={imagePreview} alt='Profile' className='profile-avatar' />

            <div className='camera-btn'>
              <FaCamera />
            </div>
          </label>

          <input
            id='profile-image'
            type='file'
            hidden
            onChange={handleImageChange}
          />
        </div>

        <InputBox
          label='Name:'
          type='text'
          id='userName'
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />
        <InputBox
          label='Email:'
          type='email'
          id='email'
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />
        <InputBox
          label='About'
          rows='5'
          id='about'
          value={formData.about}
          onChange={(e) =>
            setFormData({
              ...formData,
              about: e.target.value,
            })
          }
        />
        <button type='submit' className='inputBtn'>
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
