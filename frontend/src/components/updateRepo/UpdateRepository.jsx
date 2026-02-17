import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";
import "./UpdateRepository.css";

const UpdateRepository = () => {
  const { repoId } = useParams(); // get repoId from URL
  const [repo, setRepo] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false); // button-specific loading
  const [message, setMessage] = useState("");
const navigate = useNavigate();
  // Fetch repository data
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/repo/${repoId}`);
        const repoData = Array.isArray(res?.data?.repository) ? res?.data?.repository[0] : res?.data?.repository;
        setRepo({ name: repoData?.name, description: repoData?.description || "" });
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.error || "Failed to fetch repository");
        setMessage("Failed to fetch repository data.");
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchRepo();
  }, [repoId]);

  const handleChange = (e) => {
    setRepo({ ...repo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repo?.name.trim()) {
      setMessage("Repository name cannot be empty.");
      return;
    }
    try {
       setButtonLoading(true); // ✅ start button loading
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/repo/update/${repoId}`,
        {
          name: repo?.name,
          description: repo?.description,
        }
      );
      setMessage(res?.data?.message);
      toast.success(res?.data?.message || "Repository updated successfully");
      navigate("/")
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to update repository");
      setMessage("Failed to update repository.");
    } finally {
      setButtonLoading(false); // ✅ stop button loading
    }
  };

  // if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      {loading && <TerminalLoader />}
      <div className="update-repo-containerKRISHNA">
        <h2>Update Repository</h2>
        {message && <p className="messageKRISHNA">{message}</p>}
        <form className="update-formKRISHNA" onSubmit={handleSubmit}>
          <label>
            Repository Name:
            <input
              type="text"
              name="name"
              value={repo?.name}
              onChange={handleChange}
              placeholder="Enter repository name"
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={repo?.description}
              onChange={handleChange}
              placeholder="Enter repository description"
            />
          </label>
           <button type="submit" disabled={buttonLoading}>
            {buttonLoading ? "Updating..." : "Update Repository"}
          </button>
        </form>
      </div></>
  );
};

export default UpdateRepository;
