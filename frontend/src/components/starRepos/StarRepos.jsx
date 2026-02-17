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
  const [loadingButtons, setLoadingButtons] = useState({}); // ✅ NEW

  // const { id } = useParams();
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

  const confirmDelete = async () => {
    try {
      setLoading(true);
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
        return toast.error(data?.error || "Delete failed");
      }

      toast.success(data?.message || "Repository deleted successfully");

      // UI update
      setRepositories((prev) =>
        prev?.filter((repo) => repo?._id !== selectedRepoId)
      );

      setSearchResults((prev) =>
        prev?.filter((repo) => repo?._id !== selectedRepoId)
      );

      setShowDeleteModal(false);
      setDeletePassword("");

    } catch (error) {
      toast.error( error?.message||"Delete failed");
    } finally {
      setLoading(false);
    }
  };


  // ================= USER PROFILE =================
  useEffect(() => {
  if (!profileId) return;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setUser(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/userProfile/${profileId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setUser(data);

    } catch (err) {
      console.error(err);
    } finally {
      // setLoading(false)
      setTimeout(() => setLoading(false), 500);
    }
  };

  fetchProfile();

}, [profileId]);


  // ================= FETCH STARRED REPOS =================
  useEffect(() => {
    const fetchStarredRepos = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/repo/starred/${myId}`
        );
        const data = await res.json();

        setRepositories(Array.isArray(data?.repositories) ? data?.repositories : []);
        setSearchResults(Array.isArray(data?.repositories) ? data?.repositories : []);

        
        const ids =
          data?.repositories?.map((repo) => repo?._id?.toString()) || [];
        setStarredRepoIds(ids);
        toast.success(data?.message || "Starred repositories fetched successfully");
      } catch (error) {
        console.error(error);
        toast.error( error?.response?.data?.error||"Failed to fetch starred repositories");
      } finally {
        setLoading(false);
        // setTimeout(() => setLoading(false), 500);
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
        repo?.name?.toLowerCase().includes(searchQuery?.toLowerCase()),
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
      setLoadingButtons((prev) => ({ ...prev, [`star-${repoId}`]: true }));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/toggleStar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: myId, repoId }),
      });

      const data = await res.json();
      toast.success(data?.message || "Star toggled successfully");

      // ⭐ starred page है → unstar मतलब remove
      setRepositories((prev) => prev?.filter((r) => r?._id !== repoId));
      setSearchResults((prev) => prev?.filter((r) => r?._id !== repoId));
      setStarredRepoIds((prev) => prev?.filter((id) => id !== repoId));
    } catch (err) {
      console.error(err);
      toast.error( err?.response?.data?.error||"Failed to update star");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [`star-${repoId}`]: false })); // ✅ STOP BUTTON LOADING
    }
  };

  const handleToggleVisibility = async (repoId) => {
    try {
      // setLoading(true);
       setLoadingButtons((prev) => ({ ...prev, [`visibility-${repoId}`]: true })); // 

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/repo/toggle/${repoId}`,
        { method: "PATCH" }
      );

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data?.message || "Toggle failed");
      }

      toast.success(data?.message || "Visibility toggled successfully");

      const newVisibility = data?.repository?.visibility;

      // update repositories
      setRepositories((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, visibility: newVisibility } : repo
        )
      );

      // ⭐⭐⭐ THIS ONE WAS MISSING ⭐⭐⭐
      setSearchResults((prev) =>
        prev?.map((repo) =>
          repo?._id === repoId ? { ...repo, visibility: newVisibility } : repo
        )
      );

    } catch (err) {
      console.error(err);
      toast.error( err?.response?.data?.error||"Toggle failed");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [`visibility-${repoId}`]: false })); // ✅ STOP BUTTON LOADING
      // setLoading(false);
    }
  };


  // if (!user) return <div>Loading...</div>;

  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}
      <nav className="nav1JKLPPOPOIUT">
        {!isMobile && (
          <div>
            <div>
              <BookOpenIcon className="iconnJKLPPOPOIUT" />
              Overview
            </div>
            <div>
              <BookMarkedIcon className="iconnJKLPPOPOIUT" />
              Repositories
            </div>
            <div>
              <GridIcon className="iconnJKLPPOPOIUT" />
              Projects
            </div>
            <div>
              <BoxIcon className="iconnJKLPPOPOIUT" />
              Packages
            </div>
            <div>
              <StarIcon className="iconnJKLPPOPOIUT" />
              Stars
            </div>
          </div>
        )}

        {isMobile && (
          <div className="hamburgerJKLPPOPOIUT" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </div>
        )}
      </nav>

      <div className="mmopJKLPPOPOIUT">
        <div className="klJKLPPOPOIUT">
          <div className="divOJKLPPOPOIUT">
            <div className="divPJKLPPOPOIUT">
              <img
                className="imgOJKLPPOPOIUT"
                src="https://avatars.githubusercontent.com/u/96306036?v=4"
                alt="dummy"
              />
              <p className="paraJKLPPOPOIUT">{user?.user?.username}</p>
            </div>


            <p className="gh-bio1JKLPPOPOIUT">XYZ UNIVERSITY STUDENT</p>

            <Link to="/user/edit">
              <button className="edit-btn1">Edit profile</button>
            </Link>

            <div className="gh-info1JKLPPOPOIUT">
              <div>
                <MapPin size={16} />
                <span>Delhi, India</span>
              </div>
              <div>
                <Clock size={16} />
                <span>17:45 (UTC +05:30)</span>
              </div>
            </div>

            <div className="gh-highlights1JKLPPOPOIUT">
              <h4>Highlights</h4>
              <div className="pro-pill1JKLPPOPOIUT">
                <Star size={14} />
                PRO
              </div>
            </div>

          </div>
        </div>

        {/* ================= MAIN ================= */}
        <div className="jklpPOPOIUTJKLPPOPOIUT">
          <div className="main1JKLPPOPOIUT">
            <h2 className="juipJKLPPOPOIUT">Starred Repositories</h2>

            <div className="email-wrapper1JKLPPOPOIUT">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search Repo..."
                className="email-input1JKLPPOPOIUT"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="lplJKLPPOPOIUT">
              {searchResults?.map((repo) => (
                <div key={repo?._id} className="trending-card1JKLPPOPOIUT">
                  <div className="trending-header1JKLPPOPOIUT">
                    <a href="#" className="trending-link1JKLPPOPOIUT">
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

                  <div className="repo-info1JKLPPOPOIUT">
                    <img
                      src="https://avatars.githubusercontent.com/u/9919?s=40&v=4"
                      alt="repo avatar"
                      className="repo-avatar1JKLPPOPOIUT"
                    />

                    <Link to={
                      !repo?.files || repo?.files.length === 0
                        ? `/repo/${repo?._id}/empty`
                        : `/repo/${repo?._id}/files`
                    } className="repo-name1JKLPPOPOIUT">
                      {repo?.name}/{repo?.description}
                    </Link>

                    <div className="star-btn-group1JKLPPOPOIUT">
                      
                      <button
                        className="star-btn1"
                        onClick={() => handleToggleStar(repo?._id)}
                        style={{
                          backgroundColor: "#f87171",
                          color: "black",
                        }}
                        disabled={loadingButtons[`star-${repo?._id}`]}
                      >
                        {loadingButtons[`star-${repo?._id}`] ? "Loading..." : (
                          <>
                            <svg viewBox="0 0 16 16">
                              <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                            </svg>
                            Unstar
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="repo-meta1JKLPPOPOIUT">
                    <span className="repo-lang1JKLPPOPOIUT">
                      <span
                        className="lang-dot1JKLPPOPOIUT"
                        style={{ background: "#e34c26" }}
                      ></span>
                      HTML
                    </span>
                    <span className="repo-stars1JKLPPOPOIUT">
                      ⭐ 282
                    </span>
                    {myId === repo["owner"] ?
                      <>
                        <button
                          className="star-btn1JKLPPOPOIUT KRUNAL_PANDYA"
                          onClick={() => navigate(`/repo/update/${repo?._id}`)}
                          style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            // marginLeft: "5px",
                            border: "2px double black",
                            borderRadius: '10px',
                            // position: "relative",
                            // right: "0px",
                            opacity: "0.8"
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="star-btn1JKLPPOPOIUT KRUNAL_PANDYA"
                          onClick={() => handleDeleteClick(repo?._id)}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "white",
                            // marginLeft: "5px",
                            border: "2px double black",
                            borderRadius: "10px",
                            // position: "relative",
                            // right: "0px",
                            opacity: "0.8"
                          }}
                        >
                          Delete
                        </button>

                     
                        <button
                          className="star-btn1JKLPPOPOIUT KRUNAL_PANDYA"
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

                      </> : ""
                    }
                  </div>
                </div>
              ))}
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

              {searchResults?.length === 0 && (
                <p style={{ margin: "30px" }}>No Starred Repositories Found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
};

export default StarRepo;
