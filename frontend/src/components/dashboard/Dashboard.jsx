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
  const [loadingButtons, setLoadingButtons] = useState({}); // ✅ NEW

  const [deletePassword, setDeletePassword] = useState("");

  const navigate = useNavigate();

  const handleDeleteClick = (repoId) => {
    setSelectedRepoId(repoId);
    setShowDeleteModal(true);
  };
  

  const confirmDelete = async () => {
    try {
      setLoading(true);   // ✅ loader start
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
      setRepositories(prev =>
        prev?.filter(repo => repo?._id !== selectedRepoId)
      );

      setShowDeleteModal(false);
      setDeletePassword("");

    } catch (error) {
      toast.error( error?.response?.data?.error || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile once
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchStarredRepos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/userProfile/${userId}`);
        const data = await res.json();
        const starredIds =
          data?.user?.starRepos?.map((id) => id?.toString()) || [];
        setStarredRepoIds(starredIds);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch starred repos");
        console.error("Failed to fetch starred repos", err);
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 500);
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
          `${import.meta.env.VITE_API_URL}/repo/user/${userId}`,
        );

        const data = await response.json();
        setRepositories(Array.isArray(data?.repositories) ? data?.repositories : []);
      } catch (error) {
        console.error("Error While fetching repositories:", error);
        toast.error(error?.message || "Failed to fetch repositories");
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 500);
        
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(Array.isArray(data?.repositories) ? data?.repositories : []);
      } catch (error) {
        console.error("Error While fetching repositories:", error);
        toast.error(error?.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepositories = repositories?.filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQuery?.toLowerCase()),
      );
      setSearchResults(filteredRepositories);
    }
  }, [searchQuery, repositories]);

 
  useEffect(() => {
    const publicRepos = suggestedRepositories?.filter(
      (repo) => repo?.visibility === true,
    );

    if (searchQueryS === "") {
      setSearchResultsS(publicRepos);
    } else {
      const filteredRepositories = publicRepos?.filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQueryS?.toLowerCase()),
      );
      setSearchResultsS(filteredRepositories);
    }
  }, [searchQueryS, suggestedRepositories]);

  const handleToggleStar = async (repoId) => {
    try {
      const userId = localStorage.getItem("userId");

      setLoadingButtons((prev) => ({ ...prev, [`star-${repoId}`]: true })); 

      const res = await fetch(`${import.meta.env.VITE_API_URL}/toggleStar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, repoId }),
      });

      const data = await res.json();
      toast.success(data?.message || "Starred successfully");

      // Update local state for cosmetic button
      setRepositories((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, isStarred: data?.starred } : repo,
        ),
      );
      setSearchResults((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, isStarred: data?.starred } : repo,
        ),
      );
      setSuggestedRepositories((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, isStarred: data?.starred } : repo,
        ),
      );
      setSearchResultsS((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, isStarred: data?.starred } : repo,
        ),
      );

      setStarredRepoIds((prev) =>
        prev?.includes(repoId)
          ? prev?.filter((id) => id !== repoId)
          : [...prev, repoId],
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update star" || err?.response?.data?.error);
    }  finally {
      setLoadingButtons((prev) => ({ ...prev, [`star-${repoId}`]: false })); // ✅ STOP BUTTON LOADING
    }
  };


  const handleToggleVisibility = async (repoId) => {
    try {
      setLoadingButtons((prev) => ({ ...prev, [`visibility-${repoId}`]: true })); 
      const res = await fetch(`${import.meta.env.VITE_API_URL}/repo/toggle/${repoId}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data?.message || "Failed to toggle visibility");
      }

      toast.success(data?.message || "Visibility toggled successfully");

      const newVisibility = data?.repository?.visibility;

      // My repositories
      setRepositories((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, visibility: newVisibility } : repo
        )
      );

      // searchResults
      setSearchResults((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, visibility: newVisibility } : repo
        )
      );

      // ⭐ new one
      setSearchResultsS((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, visibility: newVisibility } : repo
        )
      );

      // suggested
      setSuggestedRepositories((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, visibility: newVisibility } : repo
        )
      );

    } catch (error) {
      console.error(error);
      toast.error("Toggle failed" || error?.response?.data?.message);
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [`visibility-${repoId}`]: false })); // ✅ STOP BUTTON LOADING
    }
  };


  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar/> */}
      <section id="dashboard">
        {/* <Navbar /> */}
        {/* <hr /> */}
        <aside className="c1">
          <div className="d1">
            <h3 className="h31">Suggested Repositories</h3>
            <Link to={"/createRepo"} style={{ textDecoration: "none" }}>
              <button className="new-repo-btn">
                <BookmarkIcon className="icon9" />
                New
              </button>
            </Link>
          </div>
          <div className="email-wrapper">
            <input
              type="text"
              value={searchQueryS}
              placeholder="Search Repo..."
              className="email-input"
              // required
              onChange={(e) => setSearchQueryS(e.target.value)}
            />
          </div>

          {searchResultsS?.length > 0
            ? searchResultsS?.map((repo) => (
              <div className="dd1" key={repo?._id}>
                <img
                  src="https://avatars.githubusercontent.com/u/231012855?v=4&size=64"
                  className="imgd"
                  alt="dummy"
                />
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/profile/${repo?.owner?._id}`}
                >
                  <p className="p1">
                    {repo?.owner?.username}/{repo?.name}
                  </p>
                </Link>
                <div className="star-btn-group">
                  <button
                      className="star-btn"
                      onClick={() => handleToggleStar(repo?._id)}
                      style={{
                        backgroundColor:
                          starredRepoIds.includes(repo?._id.toString()) &&
                          "#f87171",
                        color: "black",
                      }}
                      disabled={loadingButtons[`star-${repo?._id}`]}
                    >
                      {loadingButtons[`star-${repo?._id}`] ? "Loading..." : 
                        starredRepoIds.includes(repo?._id.toString()) ? 
                        <>
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                             <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                        </svg>
                        Unstar
                        </>
                        : 
                        <>
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                             <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                        </svg>
                        Star
                        </>}
                    </button>
                </div>
              </div>
            ))
            : <p style={{ margin: "24px" }}>No Repositories Found</p>}
        </aside>
        <main className="main">
          <h2>My Repositories</h2>
          <div className="email-wrapper">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search Repo..."
              className="email-input"
              // required
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchResults?.length > 0
            ? searchResults?.map((repo) => (
              <div className="trending-card" key={repo?._id}>
                <div className="trending-header">
                  <a
                    href="#"
                    style={{ marginBottom: "12px" }}
                    className="trending-link"
                  >
                    See more
                  </a>
                  <button
                    style={{
                      backgroundColor: "#238636",
                      border: "1px solid transparent",
                      borderRadius: "9px",
                      color: "white",
                      padding: "5px 10px",
                      cursor: "pointer",
                      marginRight: "5px",
                      marginBottom: "12px",
                    }}
                  >
                    {repo?.visibility ? "Public" : "Private"}
                  </button>
                </div>
                <div className="repo-info">
                  <img
                    src="https://avatars.githubusercontent.com/u/9919?s=40&v=4"
                    alt="repo avatar"
                    className="repo-avatar"
                  />

                  <Link
                    to={
                      !repo?.files || repo?.files.length === 0
                        ? `/repo/${repo?._id}/empty`
                        : `/repo/${repo?._id}/files`
                    }
                    className="repo-name"
                  >
                    {repo?.name}/{repo?.description}{" "}
                  </Link>

                  {/* <button>Public</button> */}
                  <div className="star-btn-group">
                     <button
                      className="star-btn"
                      onClick={() => handleToggleStar(repo?._id)}
                      style={{
                        backgroundColor:
                          starredRepoIds.includes(repo?._id.toString()) &&
                          "#f87171",
                        color: "black",
                      }}
                      disabled={loadingButtons[`star-${repo?._id}`]}
                    >
                      {loadingButtons[`star-${repo?._id}`] ? "Loading..." : 
                        starredRepoIds.includes(repo?._id.toString()) ? 
                        <>
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                             <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                        </svg>
                        Unstar
                        </>
                        : 
                        <>
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                             <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                        </svg>
                        Star
                        </>}
                    </button>
                  </div>
                </div>
                <div className="repo-desc">
                  <span></span>
                </div>
                <div className="repo-meta">
                  <span className="repo-lang">
                    <span
                      className="lang-dot"
                      style={{ background: "#e34c26" }}
                    ></span>
                    HTML
                  </span>
                  <span className="repo-stars">
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      style={{ color: "green" }}
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                    </svg>
                    282
                  </span>
                  <button
                    className="star-btn btn3"
                    onClick={() => navigate(`/repo/update/${repo?._id}`)}
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      // marginLeft: "5px",
                      border: "2px double black",
                      borderRadius: '10px',
                      opacity: "0.8",
                      // position: "relative",
                      // right: "0px",
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="star-btn btn3"
                    onClick={() => handleDeleteClick(repo?._id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      // marginLeft: "5px",
                      border: "2px double black",
                      borderRadius: "10px",
                      opacity: "0.8",
                    }}
                  >
                    Delete
                  </button>
                  
                    <button
                      className="star-btn btn3"
                      onClick={() => handleToggleVisibility(repo?._id)}
                      style={{
                        backgroundColor: repo?.visibility ? "#6b7280" : "#238636",
                        color: "white",
                        border: "2px double black",
                        borderRadius: "10px",
                        opacity: "0.8",
                      }}
                      disabled={loadingButtons[`visibility-${repo?._id}`]}
                    >
                      {loadingButtons[`visibility-${repo?._id}`]
                        ? "Loading..."
                        : repo?.visibility
                        ? "Private"
                        : "Public"}
                    </button>
                </div>

              </div>

            ))
            : <p style={{ margin: "40px" }}>No Repositories Found</p>}
        </main>
        {showDeleteModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "300px",
                textAlign: "center"
              }}
            >
              <h3>Are you sure you want to delete this repository?</h3>

              <input
                type="password"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "10px"
                }}
              />

              <div style={{ marginTop: "15px" }}>
                <button
                  onClick={confirmDelete}
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white",
                    padding: "6px 12px",
                    marginRight: "10px"
                  }}
                >
                  Confirm
                </button>

                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: "6px 12px"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <aside className="c2">
          <ChangelogCard />
        </aside>
      </section>
      {/* <GithubFooter /> */}
    </>
  );
};

export default Dashboard;
