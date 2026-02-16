import { Box } from "@primer/react";
import { PageHeader } from "@primer/react/drafts";
import { Loader2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import "./auth.css";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import logo from "../../assets/github-mark-white.svg";
import { useAuth } from "../../context/authContext";
import Footer from "../Footer";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/signUp`, {
        email: email,
        username: username,
        password: password,
      });

      const token = res?.data?.token;
      const userId = res?.data?.userId;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      setCurrentUser(userId);
      // setLoading(false);
      toast.success(res?.data?.message || "Signup successful!");

      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (error) {
      console.error("Signup error:", error?.response?.data || error?.message);
      toast.error(
        error?.response?.data?.message || "Sign up failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="text">
        <h1>Sign Up To Github</h1>
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <PageHeader>
              <PageHeader.TitleArea variant="large"></PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Username</label>
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="div">
              <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleSignup}
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                {" "}
                <Loader2Icon className="spinner" /> <span>Loading...</span>{" "}
              </>
            ) : (
              "Signup"
            )}
          </button>
        </div>

        <div className="pass-box">
          <p>
            Already have an account?{" "}
            <Link
              style={{
                color: "#3D6CA3",
                fontWeight: "600",
                textDecoration: "none",
              }}
              to="/auth"
            >
              &nbsp;Login.
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
