import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./EditPassword.css";
import { InputBox } from "../../components";
import api from "../../api/axios";

function EditPassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
      alert(res.data.message);
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex formBox">
      <h1>Change Password</h1>

      <form className=" flex formContainer" onSubmit={handleSubmit}>
        <InputBox
          label="Current Password"
          type="password"
          id="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Your current password"
        />

        <InputBox
          label="New Password"
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
        />

        <InputBox
          label="Confirm Password"
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
        />

        <div className="password-info">
          <p>Password must:</p>
          <ul>
            <li>Be at least 8 characters long</li>
            <li>Contain a number</li>
            <li>Include uppercase and lowercase letters</li>
          </ul>
        </div>

        {error && <p style={{ color: "#c0392b", textAlign: "left" }}>{error}</p>}

        <button type="submit" className="inputBtn" disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>

      <label className="forgot-link">
        <Link to="/forgot-password">Forgot Password?</Link>
      </label>
    </div>
  );
}

export default EditPassword;
