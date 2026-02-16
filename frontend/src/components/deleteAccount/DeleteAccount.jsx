import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./deleteAccount.css";
import TerminalLoader from "../Loader/TerminalLoader";

export default function DeleteAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/deleteProfile/${userId}`, {
        data: { password },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

toast.success("Account deleted successfully");
      navigate("/auth");

    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      // setLoading(false);
      setTimeout(() => setLoading(false), 600);
    }
  };

  return (
    <>
    {loading && <TerminalLoader />}
    <div className="delete-pageZEBRA">
      <div className="delete-containerZEBRA">
        <h2>Delete account</h2>

        <div className="danger-boxZEBRA">
          <p className="warningZEBRA">
            Once you delete your account, there is no going back.
            Please be certain.
          </p>

          <label>Confirm your username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />

          <label>Confirm your password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <button
            className="delete-btnZEBRA"
            disabled={!username || !password}
            onClick={handleDelete}
          >
            I understand, delete my account
          </button>
        </div>
      </div>
    </div></>
  );
}
