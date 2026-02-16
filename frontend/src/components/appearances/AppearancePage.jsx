import React, { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Settings,
  User,
  Bell,
  Shield,
  ChevronDown
} from "lucide-react";
import "./AppearancePage.css";
import toast from "react-hot-toast";

const AppearancePage = () => {

    const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

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
    <div className="app-wrapper">

      {/* SIDEBAR */}
      <div className="app-sidebar">
        <div className="app-user">
          <div className="app-avatar"></div>
          <div>
            <h4>({user?.user?.username})</h4>
            <span>Your personal account</span>
          </div>
        </div>

        <ul>
          <li><User size={16}/> Public profile</li>
          <li className="active"><Sun size={16}/> Appearance</li>
          <li><Bell size={16}/> Notifications</li>
          <li><Shield size={16}/> Code security</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="app-main">

        <h1>Theme preferences</h1>
        <p className="app-subtext">
          Choose how GitHub looks to you. Select a single theme, or sync with your system.
        </p>

        {/* MODE */}
        <div className="app-section">
          <label>Theme mode</label>
          <div className="select-box">
            Sync with system <ChevronDown size={14}/>
          </div>
        </div>

        {/* THEME CARDS */}
        <div className="theme-grid">

          <div className="theme-card active-card">
            <div className="theme-header">
              <Sun size={16}/> Light theme
              <span className="badge">Active</span>
            </div>
            <div className="theme-preview light-preview"></div>
            <div className="theme-footer">Light default</div>
          </div>

          <div className="theme-card">
            <div className="theme-header">
              <Moon size={16}/> Dark theme
            </div>
            <div className="theme-preview dark-preview"></div>
            <div className="theme-footer">Dark default</div>
          </div>

        </div>

        {/* CONTRAST */}
        <div className="app-section">
          <h3>Contrast</h3>

          <div className="toggle-row">
            <div>
              <strong>Increase contrast</strong>
              <p>Enable high contrast for light or dark mode.</p>
            </div>
            <div className="toggle">Off</div>
          </div>

          <div className="toggle-row">
            <span>Light mode</span>
            <div className="toggle">Off</div>
          </div>

          <div className="toggle-row">
            <span>Dark mode</span>
            <div className="toggle">Off</div>
          </div>
        </div>

        {/* EMOJI */}
        <div className="app-section">
          <h3>Emoji skin tone preference</h3>
          <div className="emoji-row">
            <span>👋</span>
            <span>👋🏻</span>
            <span>👋🏼</span>
            <span>👋🏽</span>
            <span>👋🏾</span>
            <span>👋🏿</span>
          </div>
        </div>

        {/* TAB SIZE */}
        <div className="app-section">
          <h3>Tab size preference</h3>
          <div className="select-box small">4 (Default) <ChevronDown size={14}/></div>
        </div>

        {/* MARKDOWN */}
        <div className="app-section">
          <h3>Markdown editor font preference</h3>
          <label className="checkbox-row">
            <input type="checkbox" />
            Use a fixed-width (monospace) font when editing Markdown
          </label>
        </div>

        {/* FOOTER */}
        <div className="app-footer">
          © 2026 GitHub, Inc. Terms Privacy Security Status Community Docs Contact
        </div>

      </div>

    </div>
  );
};

export default AppearancePage;
