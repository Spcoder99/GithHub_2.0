import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";

const ProfilePage = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [starredRepoIds, setStarredRepoIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");

  const userId = localStorage.getItem("userId");

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/userProfile/${userId}`
        );

        const data = await res.json();

        setRepositories(data?.repositories || []);
        setSearchResults(data?.repositories || []);

        const starredIds =
          data?.user?.starRepos?.map((id) => id?.toString()) || [];

        setStarredRepoIds(starredIds);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // ================= DELETE =================
  const handleDeleteClick = (repoId) => {
    setSelectedRepoId(repoId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setButtonLoading(`delete-${selectedRepoId}`);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/repo/delete/${selectedRepoId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            password: deletePassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data?.error || "Delete failed");
      }

      toast.success(data?.message);

      setRepositories((prev) =>
        prev.filter((repo) => repo?._id !== selectedRepoId)
      );

      setSearchResults((prev) =>
        prev.filter((repo) => repo?._id !== selectedRepoId)
      );

      setShowDeleteModal(false);
      setDeletePassword("");

    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setButtonLoading(null);
    }
  };

  // ================= STAR =================
  const handleToggleStar = async (repoId) => {
    try {
      setButtonLoading(`star-${repoId}`);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/toggleStar`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, repoId }),
        }
      );

      const data = await res.json();
      toast.success(data?.message || "Updated");

      setStarredRepoIds((prev) =>
        prev.includes(repoId)
          ? prev.filter((id) => id !== repoId)
          : [...prev, repoId]
      );

    } catch (err) {
      toast.error("Failed to update star");
    } finally {
      setButtonLoading(null);
    }
  };

  // ================= VISIBILITY =================
  const handleToggleVisibility = async (repoId) => {
    try {
      setButtonLoading(`visibility-${repoId}`);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/repo/toggle/${repoId}`,
        { method: "PATCH" }
      );

      const data = await res.json();

      if (!res.ok) {
        return toast.error("Toggle failed");
      }

      const newVisibility = data?.repository?.visibility;

      setRepositories((prev) =>
        prev.map((repo) =>
          repo?._id === repoId
            ? { ...repo, visibility: newVisibility }
            : repo
        )
      );

      setSearchResults((prev) =>
        prev.map((repo) =>
          repo?._id === repoId
            ? { ...repo, visibility: newVisibility }
            : repo
        )
      );

    } catch (err) {
      toast.error("Toggle failed");
    } finally {
      setButtonLoading(null);
    }
  };

  return (
    <>
      {loading && <TerminalLoader />}

      <section>

        <h2>My Profile Repositories</h2>

        {searchResults?.map((repo) => (
          <div key={repo?._id} className="trending-card">

            <Link to={`/repo/${repo?._id}/files`}>
              {repo?.name}
            </Link>

            {/* ⭐ STAR BUTTON */}
            <button
              onClick={() => handleToggleStar(repo?._id)}
              disabled={buttonLoading === `star-${repo?._id}`}
              style={{
                opacity:
                  buttonLoading === `star-${repo?._id}` ? "0.6" : "1"
              }}
            >
              {buttonLoading === `star-${repo?._id}`
                ? "Loading..."
                : starredRepoIds.includes(repo?._id)
                ? "Unstar"
                : "Star"}
            </button>

            {/* 👁 VISIBILITY BUTTON */}
            <button
              onClick={() => handleToggleVisibility(repo?._id)}
              disabled={buttonLoading === `visibility-${repo?._id}`}
              style={{
                backgroundColor: repo?.visibility
                  ? "#6b7280"
                  : "#238636",
                color: "white",
                opacity:
                  buttonLoading === `visibility-${repo?._id}`
                    ? "0.6"
                    : "0.9",
              }}
            >
              {buttonLoading === `visibility-${repo?._id}`
                ? "Loading..."
                : repo?.visibility
                ? "Private"
                : "Public"}
            </button>

            {/* 🗑 DELETE BUTTON */}
            <button onClick={() => handleDeleteClick(repo?._id)}>
              Delete
            </button>

          </div>
        ))}

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="modal">
            <h3>Confirm Delete</h3>

            <input
              type="password"
              value={deletePassword}
              onChange={(e) =>
                setDeletePassword(e.target.value)
              }
              placeholder="Enter Password"
            />

            <button
              onClick={confirmDelete}
              disabled={
                buttonLoading === `delete-${selectedRepoId}`
              }
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                opacity:
                  buttonLoading === `delete-${selectedRepoId}`
                    ? "0.6"
                    : "1",
              }}
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

      </section>
    </>
  );
};

export default ProfilePage;
