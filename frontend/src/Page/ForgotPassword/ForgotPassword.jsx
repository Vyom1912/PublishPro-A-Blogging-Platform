import { useState } from "react";
import api from "../../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicked");
    try {
      const res = await api.post("/auth/forgot-password", {
        email,
      });

      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        placeholder='Enter email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type='submit'>Send Reset Link</button>
    </form>
  );
}

export default ForgotPassword;
