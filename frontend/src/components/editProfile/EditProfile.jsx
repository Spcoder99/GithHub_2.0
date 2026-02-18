import { Eye, EyeOff, Lock, Mail, Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TerminalLoader from "../Loader/TerminalLoader";
import "./editprofile.css";
import { useNavigate } from "react-router-dom";

const MASKED_PASSWORD = "********";

const EditProfile = () => {
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    email: "",
    password: MASKED_PASSWORD,
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // ✅ FETCH OLD EMAIL
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/userProfile/${userId}`);
        const data = await res.json();

        if (res?.ok) {
          setForm({
            email: data?.user?.email,
            password: MASKED_PASSWORD,
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.error || "Failed to fetch user");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ CLEAR PASSWORD WHEN USER FOCUS
  const handlePasswordFocus = () => {
    if (form.password === MASKED_PASSWORD) {
      setForm({ ...form, password: "" });
    }
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    try {
      // setLoading(true);

      const bodyData = {};

      if (form.email) bodyData.email = form.email;

      // send only if changed
      if (form.password && form.password !== MASKED_PASSWORD) {
        bodyData.password = form.password;
      }

      if (!bodyData.email && !bodyData.password) {
        toast.error("Nothing to update");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/updateProfile/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );

      const data = await res.json();

      if (!res?.ok) throw new Error(data?.message || "Failed to update profile");

      toast.success("✅ " + data?.message || "Profile updated");

      // reset again
      setForm({
        email: data?.user?.email,
        password: MASKED_PASSWORD,
      });

      setTimeout(() => {
        navigate(-1);
      }, 900)
    } catch (err) {
      toast.error("❌" + err?.message || "Failed to update profile");
    } finally {
      // setLoading(false);
      // setTimeout(() => setLoading(false), 600);
    }
  };

  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}

      <div className="acc-wrapBHSDK">
        <h2>Account settings</h2>

        {/* EMAIL */}
        <div className="input-groupBHSDK">
          <label>
            <Mail size={16} /> Email address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter new email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="input-groupBHSDK">
          <label>
            <Lock size={16} /> New password
          </label>

          <div className="pass-boxBHSDK">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter new password"
              value={form.password}
              onChange={handleChange}
              onFocus={handlePasswordFocus}
            />

            <span onClick={() => setShow(!show)} className="eyeBHSDK">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        <button
          className="save-btnBHSDK"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save size={16} />
          {loading ? "Updating..." : "Save changes"}
        </button>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
};

export default EditProfile;
