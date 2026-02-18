import {
  BookMarkedIcon,
  BookOpenIcon,
  BoxIcon,
  Calendar,
  ChevronDown,
  Clock,
  GridIcon,
  MapPin,
  Menu,
  Star,
  StarIcon,
  Trophy,
  UsersIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
// import { BookMarkedIcon, BookmarkIcon } from "lucide-react";
import HeatMap from "@uiw/react-heat-map";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [starredRepoIds, setStarredRepoIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 400);

  const [loadingButtons, setLoadingButtons] = useState({}); // ✅ NEW


  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // URL se
  const myId = localStorage.getItem("userId"); // login user

  const profileId = id || myId;
  console.log(profileId);

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
      toast.error( error?.response?.data?.error||"Delete failed");
    } finally {
      setLoading(false);
    }
  };


  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/userProfile/${profileId}`);
      const data = await res.json();
      setUser(data);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to fetch profile");
      console.error(err);
    } finally {
      // setLoading(false);
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    const fetchStarredRepos = async () => {
      try {
        setLoading(true)
        const userId = localStorage.getItem("userId");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/userProfile/${userId}`);
        const data = await res.json();
        const starredIds =
          data?.user?.starRepos?.map((id) => id?.toString()) || [];
        setStarredRepoIds(starredIds);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch starred repos");
        console.error("Failed to fetch starred repos", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchStarredRepos();
  }, []);

  const handleToggleStar = async (repoId) => {
    try {
      const userId = localStorage.getItem("userId");

      setLoadingButtons((prev) => ({ ...prev, [`star-${repoId}`]: true })); // ✅ BUTTON LOADING

      const res = await fetch(`${import.meta.env.VITE_API_URL}/toggleStar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, repoId }),
      });

      const data = await res.json();
      toast.success(data?.message || "Starred Repo successfully");

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
            ? { ...repo, isStarred: !starredRepoIds.includes(repoId) }
            : repo,
        );

      setRepositories((prev) => updateRepos(prev));
      setSearchResults((prev) => updateRepos(prev));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to update star");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [`star-${repoId}`]: false })); // ✅ STOP BUTTON LOADING
    }
  };

  const handleFollow = async () => {
    try {
       setLoadingButtons((prev) => ({ ...prev, follow: true }));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/follow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myId,
          targetUserId: profileId,
        }),
      });

      const data = await res.json();

      toast.success(data?.message || "Followed user successfully");
      // fetchProfile();
      // ✅ Update user state locally instead of refetching
    setUser((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        followers: [...prev.user.followers, myId],
      },
    }));
    } catch (err) {
      toast.error( err?.response?.data?.error||"Error");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, follow: false }));
    }
  };

  useEffect(() => {
    if (!profileId) return;

    setUser(null);
    fetch(`${import.meta.env.VITE_API_URL}/userProfile/${profileId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error(err));
  }, [profileId]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        // अगर profileId है तो वही, नहीं तो मेरी id
        setLoading(true);
        const idToUse = profileId ? profileId : userId;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/repo/user/${idToUse}`,
        );

        const data = await response.json();

        // setRepositories(data.repositories || []);
        setRepositories(Array.isArray(data?.repositories) ? data?.repositories : []);
        // toast.success(data?.message || "Repositories fetched successfully");
      } catch (error) {
        console.error("Error while fetching repositories:", error);
        toast.error( error?.message ||"Failed to fetch repositories");
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 500);
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

 

  useEffect(() => {
    let reposToShow = [];

    // ⭐ अगर मैं अपनी profile देख रहा हूँ
    if (myId === profileId) {
      reposToShow = repositories; // sab dikhao
    } else {
      // ⭐ kisi aur ki profile → only public
      reposToShow = repositories?.filter((repo) => repo?.visibility === true);
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

  const generateActivityData = (startDate, endDate) => {
    const data = [];
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    while (currentDate <= endDateObj) {
      data.push({
        date: currentDate.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 50),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  const getPanelColors = (maxCount) => {
    const colors = {};
    for (let i = 0; i <= maxCount; i++) {
      const greenValue = Math.floor((i / maxCount) * 255);
      colors[i] = `rgb(0, ${greenValue}, 0)`;
    }

    return colors;
  };

  const handleUnfollow = async () => {
    try {
      setLoadingButtons((prev) => ({ ...prev, unfollow: true }));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/unfollow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myId,
          targetUserId: profileId,
        }),
      });

      const data = await res.json();
      toast.success(data?.message || "Unfollowed user successfully");
      // fetchProfile();
      // ✅ Update state locally
    setUser((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        followers: prev.user.followers.filter(id => id !== myId),
      },
    }));
    } catch (err) {
      toast.error( data?.message || "Error while unfollowing");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, unfollow: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const startDate = "2026-01-01";
      const endDate = "2026-06-30";
      const data = generateActivityData(startDate, endDate);
      setActivityData(data);
      const maxCount = Math.max(...data.map((item) => item?.count));
      setPanelColors(getPanelColors(maxCount));
    };

    fetchData();
  }, []);

  const isFollowing = user?.user?.followers?.includes(myId);


  const handleToggleVisibility = async (repoId) => {
    try {
      // setLoading(true);

      setLoadingButtons((prev) => ({ ...prev, [`visibility-${repoId}`]: true }));

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
      toast.error(err?.response?.data?.error || "Toggle failed");
    }  finally {
      setLoadingButtons((prev) => ({ ...prev, [`visibility-${repoId}`]: false }));
    }
  };


  // if (!user) return <div>Loading...</div>;

  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}
      <nav className="nav1">
        {!isMobile && (
          <div>
            <div onClick={() => (className = `klo`)}>
              <BookOpenIcon className="iconn" />
              Overview
            </div>
            <div>
              <BookMarkedIcon className="iconn" />
              Repositories
            </div>
            <div>
              <GridIcon className="iconn" />
              Projects
            </div>
            <div>
              <BoxIcon className="iconn" />
              Packages
            </div>
            <div>
              <StarIcon className="iconn" />
              Stars
            </div>
          </div>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <div className="hamburger" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </div>
        )}
      </nav>

      <div className="mmop">
        <div className="kl">
          <div className="divO">
            <div className="divP">
              <img
                className="imgO"
                src="https://avatars.githubusercontent.com/u/96306036?v=4"
                alt="dummy"
              ></img>
              <p className="para">{user?.user?.username}</p>
            </div>
            {myId !== profileId ? (
              <>
                {isFollowing ? (
                  <button className="buttonOP" onClick={handleUnfollow} disabled={loadingButtons.unfollow}>
                     {loadingButtons.unfollow ? "Loading..." : "Unfollow"}
                  </button>
                ) : (
                  <button className="buttonOP" onClick={handleFollow}  disabled={loadingButtons.follow}>
                     {loadingButtons.follow ? "Loading..." : "Follow"}
                  </button>
                )}

                <div className="ddiiv">
                  <UsersIcon className="ioo" />
                  <div>
                    <p className="pppp">
                      {user?.user?.followers?.length} Followers 💠{" "}
                      {user?.user?.followedUsers?.length} following
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="gh-bio1">XYZ UNIVERSITY STUDENT</p>

                <Link to="/user/edit">
                  <button className="edit-btn1">Edit profile</button>
                </Link>

                <div className="gh-info1">
                  <div>
                    <MapPin size={16} />
                    <span>Delhi, India</span>
                  </div>
                  <div>
                    <Clock size={16} />
                    <span>17:45 (UTC +05:30)</span>
                  </div>
                </div>

                <div className="gh-highlights1">
                  <h4>Highlights</h4>
                  <div className="pro-pill1">
                    <Star size={14} />
                    PRO
                  </div>
                </div>
              </>
            )}
          </div>
          {myId === profileId ? (
            ""
          ) : (
            <>
              <div className="Block">
                <p className="popo">Achievements</p>
                <img
                  className="kiop"
                  src="https://github.githubassets.com/assets/starstruck-default-b6610abad518.png"
                ></img>
                <p className="lo">Block or Report</p>
              </div>
            </>
          )}

          <div className="card">
            {/* Top Gradient */}
            <div className="cardHeader">
              {/* Medal */}
              <div className="medal">
                <Trophy size={60} />
              </div>
            </div>

            {/* Content */}
            <div className="cardBody">
              <div className="titleRow">
                <h2>Starstruck</h2>
                <span className="count">x3</span>
              </div>

              <p className="subtitle">
                <span className="link">@{user?.user?.username}</span> created a repository
                that has many stars.
              </p>

              <hr />

              <h4 className="historyTitle">History</h4>

              <div className="history">
                <div className="historyItem">
                  <Trophy size={18} />
                  <span>
                    Bronze and Silver unlocked · First unlocked on  {new Date().toLocaleDateString()}
                  </span>
                </div>

                <div className="timeline">
                  <div className="dot" />
                  <a href="#">Shubhantak/ReactJS</a>
                  <span className="stars">
                    <Star size={16} /> 16 stars
                  </span>
                </div>

                <div className="timeline">
                  <div className="dot" />
                  <a href="#">Shubhantak/NodeJs</a>
                  <span className="stars">
                    <Star size={16} /> 128 stars
                  </span>
                </div>

                <div className="timeline">
                  <div className="dot" />
                  <a href="#">Shubhantak/Python</a>
                  <span className="stars">
                    <Star size={16} /> 512 stars
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="jklp">
          <div className="main1">
            <h2 className="juip">My Repositories</h2>
            <div className="email-wrapper1">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search Repo..."
                className="email-input1"
                // required
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="lpl">
              {searchResults?.length === 0 ? (
                <p style={{ margin: "34px" }}>No Repositories Found.</p>
              ) : (
                searchResults?.map((repo) => (
                  // <div key={repo._id}>
                  //   <p>{repo.name}</p>
                  //   <p>{repo.description}</p>
                  // </div>

                  <div className="trending-card1" key={repo?._id}>
                    <div className="trending-header1">
                      <a href="#" className="trending-link1">
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
                    <div className="repo-info1">
                      <img
                        src="https://avatars.githubusercontent.com/u/9919?s=40&v=4"
                        alt="repo avatar"
                        className="repo-avatar1"
                      />
                      <Link
                        to={
                          !repo?.files || repo?.files.length === 0
                            ? `/repo/${repo?._id}/empty`
                            : `/repo/${repo?._id}/files`
                        }
                        className="repo-name1"
                      >
                        {repo?.name}/{repo?.description}
                      </Link>
                      <div className="star-btn-group1">
                        {/* <button className="star-btn1">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                        </svg>
                        Star
                      </button> */}
                        <button
                          className="star-btn1"
                          onClick={() => handleToggleStar(repo?._id)}
                          style={{
                            backgroundColor:
                              starredRepoIds.includes(repo?._id.toString()) &&
                              "#f87171",
                            color: "black",
                          }}
                           disabled={loadingButtons[`star-${repo?._id}`]}
                        >
                          
                           {loadingButtons[`star-${repo?._id}`] ? "Loading..." : starredRepoIds.includes(repo?._id.toString()) ? 
                           <>
                           <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                          </svg>
                             Unstar
                           </> : <>
                           <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M8 12.027l-4.472 2.353.854-4.98L1.18 5.97l5.013-.728L8 1.25l1.807 3.992 5.013.728-3.202 3.43.854 4.98z" />
                          </svg>
                             Star
                           </>}
                        </button>
                      </div>
                    </div>
                    <div className="repo-desc1">
                      <span>
                        {/* {repo.content.map((cont) => (
                        <p># {cont}</p>
                      ))} */}
                      </span>
                    </div>
                    <div className="repo-meta1">
                      <span className="repo-lang1">
                        <span
                          className="lang-dot1"
                          style={{ background: "#e34c26" }}
                        ></span>
                        HTML
                      </span>
                      <span className="repo-stars1">
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
                      {myId === profileId && <>
                        <button
                          className="star-btn1 btnopop"
                          onClick={() => navigate(`/repo/update/${repo?._id}`)}
                          style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            // marginLeft: "5px",
                            border: "2px double black",
                            borderRadius: "10px",
                            opacity: "0.8",
                            // position: "relative",
                            // right: "0px",
                          }}
                        >
                          Update
                        </button>

                        <button
                          className="star-btn1 btnopop"
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
                          className="star-btn1 btnopop"
                          onClick={() => handleToggleVisibility(repo?._id)}
                          style={{
                            backgroundColor: repo?.visibility ? "#6b7280" : "#238636",
                            color: "white",
                            // marginLeft: "5px",
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

                      </>}
                    </div>
                  </div>
                ))
              )}
            </div>
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

          <section className="contributions2">
            <div className="contrib-header2">
              <span>contributions in the year</span>

              <button className="contrib-settings2">
                Contribution settings
                <ChevronDown size={14} />
              </button>

              <button className="year-btn2">2026</button>
            </div>

            <HeatMap
              className="graph2"
              value={activityData}
              weekLabels={["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"]}
              startDate={new Date("2026-01-01")}
              space={4}
              rectSize={26}
              rectProps={{ rx: 4 }}
              panelColors={panelColors}
            >
            </HeatMap>

            <div className="graph-footer2">
              <span>Less</span>
              <div className="legend2">
                <div
                  style={{
                    backgroundColor: "#00EF00",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: "#00C500",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: "#00A100",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: "#005800",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: "#005809",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: "#005800",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: "#004800",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: "#000000",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                ></div>
              </div>
              <span>More</span>
            </div>
          </section>

          {/* Activity */}
          <section className="activity2">
            <h3>Contribution activity</h3>

            <div className="activity-month2">
              <Calendar size={16} />
              <span>February 2026</span>
            </div>

            <p className="muted2">
              {user?.user?.username} has no activity yet for this period.
            </p>

            <button className="show-more2">Show more activity</button>
          </section>
        </div>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
};

export default ProfilePage;
