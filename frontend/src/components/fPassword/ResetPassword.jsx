import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./auth-pages.css";

const ResetPassword = () => {
  const { token } = useParams(); // Token from email link
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) return toast.error("All fields are required");
    if (password !== confirm) return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }), // send token & newPassword in body
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Something went wrong");

      toast.success(data.message || "Password reset successfully!");
      navigate("/auth"); // redirect to login page
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-wrapperPOPOPOPOPOPOPOPOPOPO">
      <form className="formRERE" onSubmit={handleSubmit}>
        <h2>Reset your password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        <Link to="/auth">Back to Login</Link>
      </form>
    </div>
  );
};

export default ResetPassword;
