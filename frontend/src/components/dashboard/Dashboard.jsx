import { BookmarkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ChangelogCard from "../ChangelogCard";
import TerminalLoader from "../Loader/TerminalLoader";
import "./dashboard.css";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQueryS, setSearchQueryS] = useState("");
  const [searchResultsS, setSearchResultsS] = useState([]);
  const [starredRepoIds, setStarredRepoIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // ✅ NEW button loading state
  const [buttonLoading, setButtonLoading] = useState(null);

  const navigate = useNavigate();

  const handleDeleteClick = (repoId) => {
    setSelectedRepoId(repoId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setButtonLoading(`delete-${selectedRepoId}`);

      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/repo/delete/${selectedRepoId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: deletePassword,
            userId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data?.error);
      }

      toast.success(data?.message);

      setRepositories((prev) =>
        prev?.filter((repo) => repo?._id !== selectedRepoId)
      );

      setShowDeleteModal(false);
      setDeletePassword("");

    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setButtonLoading(null);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchStarredRepos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/userProfile/${userId}`);
        const data = await res.json();
        const starredIds =
          data?.user?.starRepos?.map((id) => id?.toString()) || [];
        setStarredRepoIds(starredIds);
      } catch (err) {
        toast.error("Failed to fetch starred repos");
      }
    };

    fetchStarredRepos();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/repo/user/${userId}`
        );

        const data = await response.json();
        setRepositories(Array.isArray(data?.repositories) ? data?.repositories : []);
      } catch (error) {
        toast.error("Failed to fetch repositories");
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(Array.isArray(data?.repositories) ? data?.repositories : []);
      } catch (error) {
        toast.error("Failed to fetch suggested repositories");
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filtered = repositories?.filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories]);

  useEffect(() => {
    const publicRepos = suggestedRepositories?.filter(
      (repo) => repo?.visibility === true
    );

    if (searchQueryS === "") {
      setSearchResultsS(publicRepos);
    } else {
      const filtered = publicRepos?.filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQueryS?.toLowerCase())
      );
      setSearchResultsS(filtered);
    }
  }, [searchQueryS, suggestedRepositories]);

  const handleToggleStar = async (repoId) => {
    try {
      setButtonLoading(`star-${repoId}`);

      const userId = localStorage.getItem("userId");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/toggleStar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, repoId }),
      });

      const data = await res.json();

      toast.success(data?.message || "Success");

      setStarredRepoIds((prev) =>
        prev?.includes(repoId)
          ? prev?.filter((id) => id !== repoId)
          : [...prev, repoId]
      );

    } catch (err) {
      toast.error("Failed to update star");
    } finally {
      setButtonLoading(null);
    }
  };

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
        prev?.map((repo) =>
          repo?._id === repoId
            ? { ...repo, visibility: newVisibility }
            : repo
        )
      );

    } catch (error) {
      toast.error("Toggle failed");
    } finally {
      setButtonLoading(null);
    }
  };

  return (
    <>
      {loading && <TerminalLoader />}

      <section id="dashboard">

        <main className="main">
          <h2>My Repositories</h2>

          {searchResults?.map((repo) => (
            <div className="trending-card" key={repo?._id}>

              <div className="repo-info">
                <Link
                  to={`/repo/${repo?._id}/files`}
                  className="repo-name"
                >
                  {repo?.name}
                </Link>

                {/* ⭐ STAR BUTTON */}
                <button
                  className="star-btn"
                  onClick={() => handleToggleStar(repo?._id)}
                  disabled={buttonLoading === `star-${repo?._id}`}
                  style={{
                    opacity:
                      buttonLoading === `star-${repo?._id}` ? "0.6" : "1",
                  }}
                >
                  {buttonLoading === `star-${repo?._id}`
                    ? "Loading..."
                    : starredRepoIds?.includes(repo?._id.toString())
                    ? "Unstar"
                    : "Star"}
                </button>

                {/* 👁 VISIBILITY BUTTON */}
                <button
                  className="star-btn btn3"
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
                        : "0.8",
                  }}
                >
                  {buttonLoading === `visibility-${repo?._id}`
                    ? "Loading..."
                    : repo?.visibility
                    ? "Private"
                    : "Public"}
                </button>

                {/* 🗑 DELETE BUTTON */}
                <button
                  className="star-btn btn3"
                  onClick={() => handleDeleteClick(repo?._id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}
        </main>
      </section>
    </>
  );
};

export default Dashboard;
