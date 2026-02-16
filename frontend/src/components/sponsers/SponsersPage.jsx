import React, { useEffect, useState } from "react";
import { Heart, Github } from "lucide-react";
import "./SponsorsPage.css";
import toast from "react-hot-toast";

const SponsorsPage = () => {

  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/userProfile/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to fetch user");
        console.log(error.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (userId) fetchUser();

  }, [userId]);

  return (
    <div className="ghS-wrapper">

      {/* Top mini header */}
      <div className="ghS-topbar">
        <Heart size={16} className="ghS-heart" />
        <span>GitHub Sponsors accounts</span>
      </div>

      <div className="ghS-container">

        {/* Section 1 */}
        <h1 className="ghS-title">Manage who you sponsor</h1>

        <div className="ghS-empty-card">
          <div className="ghS-empty-icon">
            <Heart size={32} />
          </div>
          <p>
            You haven't sponsored anyone yet.{" "}
            <span className="ghS-link">Find someone to sponsor.</span>
          </p>
        </div>

        {/* Section 2 */}
        <h2 className="ghS-subtitle">
          GitHub Sponsors eligible accounts
        </h2>

        <div className="ghS-account-card">
          <div className="ghS-avatar"></div>

          <div className="ghS-account-info">
            <h3>{user?.user?.username}</h3>
            <p>
              This account has not applied to join GitHub Sponsors.
            </p>
          </div>

          <button className="ghS-green-btn">
            Get sponsored
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="ghS-footer">
        <Github size={18} />
        <span>© 2026 GitHub, Inc.</span>
        <span>Terms</span>
        <span>Privacy</span>
        <span>Security</span>
        <span>Status</span>
        <span>Community</span>
        <span>Docs</span>
        <span>Contact</span>
        <span>Manage cookies</span>
        <span>Do not share my personal information</span>
      </footer>

    </div>
  );
};

export default SponsorsPage;
