import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "./auth-pages.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Something went wrong");

      toast.success(data.message || "Password reset email sent!");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapperPOPOPOPOPOPOPOPOPOPO">
      <form className="formRERE" onSubmit={handleSubmit}>
        <h2>Forgot your password?</h2>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <Link to="/auth">Back to Login</Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
