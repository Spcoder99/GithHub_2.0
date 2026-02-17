import {
  BookMarkedIcon,
  BookOpenIcon,
  BoxIcon,
  Clock,
  GridIcon,
  MapPin,
  Menu,
  Star,
  StarIcon,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";
import "./starrepo.css";

const StarRepo = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 400);
  const [starredRepoIds, setStarredRepoIds] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(null);

  const myId = localStorage.getItem("userId");
  const profileId = myId;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [user, setUser] = useState(null);

  const handleDeleteClick = (repoId) => {
    setSelectedRepoId(repoId);
    setShowDeleteModal(true);
  };

  // ================= DELETE =================
  const confirmDelete = async () => {
    try {
      setButtonLoading(`delete-${selectedRepoId}`);

      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/repo/delete/${selectedRepoId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: deletePassword, userId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Delete failed");
      }

      toast.success(data?.message || "Repository deleted successfully");

      setRepositories((prev) =>
        prev?.filter((repo) => repo?._id !== selectedRepoId)
      );

      setSearchResults((prev) =>
        prev?.filter((repo) => repo?._id !== selectedRepoId)
      );

      setShowDeleteModal(false);
      setDeletePassword("");

    } catch (error) {
      toast.error(error?.message || "Delete failed");
    } finally {
      setButtonLoading(null);
    }
  };

  // ================= USER PROFILE =================
  useEffect(() => {
    if (!profileId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/userProfile/${profileId}`
        );

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  // ================= FETCH STARRED =================
  useEffect(() => {
    const fetchStarredRepos = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/repo/starred/${myId}`
        );

        if (!res.ok) throw new Error("Failed to fetch starred repositories");

        const data = await res.json();

        const repos = Array.isArray(data?.repositories)
          ? data?.repositories
          : [];

        setRepositories(repos);
        setSearchResults(repos);
        setStarredRepoIds(repos.map((r) => r?._id?.toString()));

      } catch (err) {
        toast.error(err?.message || "Failed to fetch starred repositories");
      } finally {
        setLoading(false);
      }
    };

    if (myId) fetchStarredRepos();
  }, [myId]);

  // ================= SEARCH =================
  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filtered = repositories?.filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories]);

  // ================= RESPONSIVE =================
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 400);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= TOGGLE STAR =================
  const handleToggleStar = async (repoId) => {
    try {
      setButtonLoading(`star-${repoId}`);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/toggleStar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: myId, repoId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update star");
      }

      toast.success(data?.message || "Star toggled successfully");

      setRepositories((prev) => prev?.filter((r) => r?._id !== repoId));
      setSearchResults((prev) => prev?.filter((r) => r?._id !== repoId));
      setStarredRepoIds((prev) => prev?.filter((id) => id !== repoId));

    } catch (err) {
      toast.error(err?.message || "Failed to update star");
    } finally {
      setButtonLoading(null);
    }
  };

  return (
    <>
      {loading && <TerminalLoader />}

      {/* ================= MAIN UI EXACTLY SAME ================= */}

      {searchResults?.map((repo) => (
        <div key={repo?._id}>
          
          <button
            onClick={() => handleToggleStar(repo?._id)}
            disabled={buttonLoading === `star-${repo?._id}`}
          >
            {buttonLoading === `star-${repo?._id}`
              ? "Updating..."
              : "Unstar"}
          </button>

          <button
            onClick={() => handleDeleteClick(repo?._id)}
          >
            Delete
          </button>

        </div>
      ))}

      {showDeleteModal && (
        <div>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />

          <button
            onClick={confirmDelete}
            disabled={buttonLoading === `delete-${selectedRepoId}`}
          >
            {buttonLoading === `delete-${selectedRepoId}`
              ? "Deleting..."
              : "Confirm"}
          </button>

          <button onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
};

export default StarRepo;
