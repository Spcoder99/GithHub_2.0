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
  UsersIcon,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
// import { BookMarkedIcon, BookmarkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";
import "./myrepo.css";

const MyRepo = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 400);
  const [starredRepoIds, setStarredRepoIds] = useState([]);
  const { id } = useParams(); // URL se
  const myId = localStorage.getItem("userId"); // login user

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const profileId = id || myId;

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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

      const data = await res?.json();

      if (!res.ok) {
        return toast.error(data.error);
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


  

  useEffect(() => {
  if (!profileId) return;

  const fetchProfile = async () => {
    try {
      setLoading(true)
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
      setLoading(false);
    }
  };

  fetchProfile();

}, [profileId]);


  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        // अगर profileId है तो वही, नहीं तो मेरी id
        // setLoading(true);
        const idToUse = profileId ? profileId : userId;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/repo/user/${idToUse}`,
        );

        const data = await response?.json();
        // console.log(data);
        setRepositories(Array.isArray(data?.repositories) ? data?.repositories : []);
        // toast.success(data.message);
      } catch (error) {
        console.error("Error while fetching repositories:", error);
        toast.error(error?.message||"Failed to fetch repositories");
      } finally {
        // setLoading(false);
        // setTimeout(() => setLoading(false), 600);
        
      }
    };

    fetchRepositories();
  }, [profileId]); // ⭐⭐⭐ MOST IMPORTANT

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 400);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("REPOSITORIES =", repositories);

  const handleToggleVisibility = async (repoId) => {
    try {
      // setLoading(true);

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
      toast.error(err?.message||"Toggle failed");
    } finally {
      // setLoading(false);
    }
  };

 

  useEffect(() => {
    let reposToShow = [];

    // ⭐ अगर मैं अपनी profile देख रहा हूँ
    if (myId === profileId) {
      reposToShow = repositories; // sab dikhao
    } else {
      // ⭐ kisi aur ki profile → only public
      reposToShow = repositories.filter((repo) => repo?.visibility === true);
    }

    if (searchQuery === "") {
      setSearchResults(reposToShow);
    } else {
      const filtered = reposToShow?.filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQuery?.toLowerCase()),
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories, myId, profileId]);

  useEffect(() => {
    const fetchStarredRepos = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/userProfile/${userId}`);
        const data = await res.json();
        const starredIds =
          data?.user?.starRepos?.map((id) => id?.toString()) || [];
        setStarredRepoIds(starredIds);
      } catch (err) {
        console.error("Failed to fetch starred repos", err);
        toast.error(err?.response?.data?.error || "Failed to fetch starred repos");
      }
    };
    fetchStarredRepos();
  }, []);

  const handleToggleStar = async (repoId) => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/toggleStar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, repoId }),
      });

      const data = await res.json();
      toast.success( data?.message|| "Starred successfully");

      // Update starredRepoIds locally
      setStarredRepoIds((prev) =>
        prev?.includes(repoId)
          ? prev?.filter((id) => id !== repoId)
          : [...prev, repoId],
      );

      // Update repositories and searchResults for cosmetic effect
      const updateRepos = (repos) =>
        repos?.map((repo) =>
          repo?._id === repoId
            ? { ...repo, isStarred: !starredRepoIds?.includes(repoId) }
            : repo,
        );

      setRepositories((prev) => updateRepos(prev));
      setSearchResults((prev) => updateRepos(prev));
    } catch (err) {
      console.error(err);
      toast.error( err?.response?.data?.error||"Failed to update star");
    }
  };

  // if (!user) return <div>Loading...</div>;

  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}
      <nav className="nav1JKLP">
        {!isMobile && (
          <div>
            <div onClick={() => (className = `kloJKLP`)}>
              <BookOpenIcon className="iconnJKLP" />
              Overview
            </div>
            <div>
              <BookMarkedIcon className="iconnJKLP" />
              Repositories
            </div>
            <div>
              <GridIcon className="iconnJKLP" />
              Projects
            </div>
            <div>
              <BoxIcon className="iconnJKLP" />
              Packages
            </div>
            <div>
              <StarIcon className="iconnJKLP" />
              Stars
            </div>
          </div>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <div className="hamburgerJKLP" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </div>
        )}
      </nav>

      <div className="mmopJKLP">
        <div className="klJKLP">
          <div className="divOJKLP">
            <div className="divPJKLP">
              <img
                className="imgOJKLP"
                src="https://avatars.githubusercontent.com/u/96306036?v=4"
                alt="dummy"
              ></img>
              <p className="paraJKLP">{user?.user?.username}</p>
            </div>
            {myId !== profileId ? (
              <>
                <button className="buttonOPJKLP">Follow</button>
                <div className="ddiivJKLP">
                  <UsersIcon className="iooJKLP" />
                  <div>
                    <p className="ppppJKLP">7k Followers 💠 0 following</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="gh-bio1JKLP">XYZ UNIVERSITY STUDENT</p>

                {/* <button className="edit-btn1JKLP">Edit profile</button> */}
                <Link to="/user/edit">
                  <button className="edit-btn1">Edit profile</button>
                </Link>

                <div className="gh-info1JKLP">
                  <div>
                    <MapPin size={16} />
                    <span>Delhi, India</span>
                  </div>
                  <div>
                    <Clock size={16} />
                    <span>17:45 (UTC +05:30)</span>
                  </div>
                </div>

                <div className="gh-highlights1JKLP">
                  <h4>Highlights</h4>
                  <div className="pro-pill1JKLP">
                    <Star size={14} />
                    PRO
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="jklpJKLP">
          <div className="main1JKLP">
            <h2 className="juipJKLP">My Repositories</h2>
            <div className="email-wrapper1JKLP">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search Repo..."
                className="email-input1JKLP"
                // required
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="lplJKLP">
              {searchResults?.map((repo) => (
                <div className="trending-card1JKLP" key={repo?._id}>
                  <div className="trending-header1JKLP">
                    <a href="#" className="trending-link1JKLP">
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
                  <div className="repo-info1JKLP">
                    <img
                      src="https://avatars.githubusercontent.com/u/9919?s=40&v=4"
                      alt="repo avatar"
                      className="repo-avatar1JKLP"
                    />

                    <Link
                      to={
                        !repo?.files || repo?.files.length === 0
                          ? `/repo/${repo?._id}/empty`
                          : `/repo/${repo?._id}/files`
                      }
                      className="repo-name1JKLP"
                    >
                      {repo?.name}/{repo?.description}
                    </Link>
                    <div className="star-btn-group1JKLP">
                      <button
                        className="star-btn1"
                        onClick={() => handleToggleStar(repo?._id)}
                        style={{
                          backgroundColor:
                            starredRepoIds.includes(repo?._id.toString()) &&
                            "#f87171",
                          color: "black",
                        }}
                      >
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                        </svg>
                        {starredRepoIds?.includes(repo?._id.toString())
                          ? "Unstar"
                          : "Star"}
                      </button>
                    </div>
                  </div>
                  <div className="repo-desc1JKLP">
                    <span>
                      {/* {repo.content.map((cont) => (
                        <p># {cont}</p>
                      ))} */}
                    </span>
                  </div>
                  <div className="repo-meta1JKLP">
                    <span className="repo-lang1JKLP">
                      <span
                        className="lang-dot1JKLP"
                        style={{ background: "#e34c26" }}
                      ></span>
                      HTML
                    </span>
                    <span className="repo-stars1JKLP">
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
                      className="star-btn1JKLP ULALALA_LALP"
                      onClick={() => navigate(`/repo/update/${repo?._id}`)}
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        // marginLeft: "5px",
                        border: "2px double black",
                        borderRadius: "10px",
                        opacity: "0.8"
                        // position: "relative",
                        // right: "0px",
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="star-btn1JKLP ULALALA_LALP"
                      onClick={() => handleDeleteClick(repo?._id)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        // marginLeft: "5px",
                        border: "2px double black",
                        borderRadius: "10px",
                        opacity: "0.8"
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="star-btn1JKLP ULALALA_LALP"
                      onClick={() => handleToggleVisibility(repo?._id)}
                      style={{
                        backgroundColor: repo.visibility ? "#6b7280" : "#238636",
                        color: "white",
                        // marginLeft: "5px",
                        border: "2px double black",
                        borderRadius: "10px",
                        opacity: "0.8"
                      }}
                    >
                      {repo?.visibility ? "Private" : "Public"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              <p style={{ margin: "30px" }}>No repositories found.</p>
            )}
          </div>
        </div>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
};

export default MyRepo;
