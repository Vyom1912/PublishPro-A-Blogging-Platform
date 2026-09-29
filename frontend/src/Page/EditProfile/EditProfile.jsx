import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaCamera } from "react-icons/fa";
import { thumbUrl } from "../../utils/image";

import "./EditProfile.css";
import InputBox from "../../components/InputBox/InputBox";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// onSaved — used when shown as a tab inside the profile page;
// on its own route we navigate back to /profile instead.
function EditProfile({ onSaved }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    about: user?.about || "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(
    user?.image ? thumbUrl(user.image, 300) : "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be smaller than 5 MB");
      return;
    }

    setError("");
    setFormData({
      ...formData,
      image: file,
    });

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Name can't be empty");
    if (!formData.email.trim()) return setError("Email can't be empty");

    try {
      setSaving(true);
      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim());
      data.append("about", formData.about);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await api.put("/users/profile", data);
      setUser(res.data.user);

      if (onSaved) onSaved();
      else navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.message || "Couldn't update your profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null; // ProtectedRoute handles redirect
  }

  return (
    <div className='formBox flex'>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className='flex formContainer'>
        <div className='avatar-container'>
          <label htmlFor='profile-image' className='profile-image' title='Change photo'>
            {imagePreview ? (
              <img src={imagePreview} alt='Profile' className='profile-avatar' />
            ) : (
              <span className='profile-avatar profile-avatar-empty flex'>
                {formData.name.charAt(0).toUpperCase() || "?"}
              </span>
            )}

            <span className='camera-btn flex'>
              <FaCamera />
            </span>
          </label>

          <input
            id='profile-image'
            type='file'
            accept='image/*'
            hidden
            onChange={handleImageChange}
          />
        </div>

        <InputBox
          label='Name'
          id='userName'
          value={formData.name}
          autoComplete='name'
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />
        <InputBox
          label='Email'
          type='email'
          id='email'
          value={formData.email}
          autoComplete='email'
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />
        <InputBox
          label='About'
          rows={5}
          id='about'
          value={formData.about}
          placeholder='A few words about yourself...'
          maxLength={500}
          onChange={(e) =>
            setFormData({
              ...formData,
              about: e.target.value,
            })
          }
        />

        {error && <p className='error-text'>{error}</p>}

        <button type='submit' className='inputBtn' disabled={saving}>
          {saving ? "Saving…" : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
