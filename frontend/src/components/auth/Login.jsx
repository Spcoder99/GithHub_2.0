import { Box } from "@primer/react";
import { PageHeader } from "@primer/react/drafts";
import "./auth.css";

import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import logo from "../../assets/github-mark-white.svg";
import { useAuth } from "../../context/authContext";
import Footer from "../Footer";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email?.trim() || !password?.trim()) {
      toast.error("Email and password required");
      return;
    }


    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/login", {
        email: email,
        password: password,
      })

      const token = res?.data?.token;
      const userId = res?.data?.userId;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      setCurrentUser(userId);

      toast.success(res?.data?.message || "Login successfull!");

      setTimeout(() => {
        window.location.href = "/";
      }, 1200);

    } catch (error) {
      console.error("Login error:", error?.response?.data || error?.message);
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="text">
        <h1>Log In To Github</h1>
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
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="div">
            <div className="nd">
            <label className="label">Password</label>
            <Link to={"/forgotP"} style={{textDecoration: "none"}} >forgot password?</Link>
            </div>

            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button onClick={handleLogin} className="login-btn" disabled={loading}>
            {loading ? (
              <>
                {" "}
                <Loader2Icon className="spinner" /> <span>Loading...</span>{" "}
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="pass-box">
          <p>
            New to GitHub?{" "}
            <Link
              style={{
                color: "#3D6CA3",
                fontWeight: "600",
                textDecoration: "none",
              }}
              to="/signUp"
            >
              &nbsp;Create an account.
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
