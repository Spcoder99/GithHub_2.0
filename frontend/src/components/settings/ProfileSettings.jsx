import React, { useEffect, useState } from "react";
import {
  User,
  CreditCard,
  Palette,
  Accessibility,
  Bell,
  Shield,
  Key,
  Building,
  Globe,
  FileText,
  Github,
  Edit
} from "lucide-react";
import "./ProfileSettings.css";
import toast from "react-hot-toast";

const ProfileSettings = () => {

  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/userProfile/${userId}`);
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
    <div className="ps-wrapper">

      {/* LEFT SIDEBAR */}
      <aside className="ps-sidebar">
        <div className="ps-profile">
          <div className="ps-avatar"></div>
          <div>
            <h4>({user?.user?.username})</h4>
            <p>Your personal account</p>
          </div>
        </div>

        <nav>
          <div className="ps-nav-item active"><User size={16}/> Public profile</div>
          <div className="ps-nav-item"><CreditCard size={16}/> Account</div>
          <div className="ps-nav-item"><Palette size={16}/> Appearance</div>
          <div className="ps-nav-item"><Accessibility size={16}/> Accessibility</div>
          <div className="ps-nav-item"><Bell size={16}/> Notifications</div>
          <div className="ps-nav-item"><Shield size={16}/> Code security</div>
          <div className="ps-nav-item"><Key size={16}/> SSH and GPG keys</div>
          <div className="ps-nav-item"><Building size={16}/> Organizations</div>
          <div className="ps-nav-item"><Globe size={16}/> Enterprises</div>
          <div className="ps-nav-item"><FileText size={16}/> Developer settings</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ps-main">

        <div className="ps-header">
          <h1>Public profile</h1>
          <button className="ps-outline-btn">Go to your personal profile</button>
        </div>

        <div className="ps-content-grid">

          <div className="ps-form">

            <label>Name</label>
            <input type="text" defaultValue="XYZ"/>

            <label>Public email</label>
            <select>
              <option>Select a verified email to display</option>
            </select>

            <label>Bio</label>
            <textarea defaultValue="XYZ UNIVERSITY STUDENT"></textarea>

            <label>Pronouns</label>
            <select>
              <option>Don't specify</option>
            </select>

            <label>URL</label>
            <input type="text"/>

            <label>Company</label>
            <input type="text"/>

            <label>Location</label>
            <input type="text" defaultValue="Delhi, India"/>

            <div className="ps-checkbox">
              <input type="checkbox" defaultChecked />
              <span>Display current local time</span>
            </div>

            <label>Time zone</label>
            <select>
              <option>(GMT-12:00) International Date Line West</option>
            </select>

            <button className="ps-green-btn">Update profile</button>

          </div>

          {/* PROFILE PICTURE SIDE */}
          <div className="ps-picture-section">
            <h4>Profile picture</h4>
            <div className="ps-big-avatar"></div>
            <button className="ps-outline-btn small">
              <Edit size={14}/> Edit
            </button>
          </div>

        </div>

        {/* Contributions */}
        <section className="ps-section">
          <h2>Contributions & activity</h2>

          <div className="ps-checkbox">
            <input type="checkbox"/>
            <span>Make profile private and hide activity</span>
          </div>

          <div className="ps-checkbox">
            <input type="checkbox"/>
            <span>Include private contributions on my profile</span>
          </div>

          <button className="ps-outline-btn">Update preferences</button>
        </section>

        {/* Profile settings */}
        <section className="ps-section">
          <h2>Profile settings</h2>

          <div className="ps-checkbox">
            <input type="checkbox" defaultChecked/>
            <span>Display PRO badge</span>
          </div>

          <div className="ps-checkbox">
            <input type="checkbox" defaultChecked/>
            <span>Show Achievements on my profile</span>
          </div>

          <button className="ps-outline-btn">Update preferences</button>
        </section>

        {/* Footer */}
        

      </main>

    </div>
  );
};

export default ProfileSettings;
