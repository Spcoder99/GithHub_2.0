import {
  Accessibility,
  Book,
  BookMarkedIcon,
  BookPlus,
  Building2,
  CircleDot,
  CircleDotIcon,
  Cloud,
  Code,
  FolderPlus,
  GitPullRequestArrowIcon,
  Heart,
  Laptop,
  LogOut,
  Menu,
  MessageSquareDotIcon,
  PlusIcon,
  SearchIcon,
  Settings,
  Smile,
  Sparkles,
  Star,
  Sun,
  Trash2Icon,
  Upload,
  User
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import IssueModal from "./issuemodel/IssueModal";
import "./navbar.css";
import SideDrawer from "./sidebar/SideDrawer";


const Navbar = () => {
  const [openS, setOpenS] = useState(false);
  const location = useLocation();

  const ref = useRef();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [openD, setOpenD] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null)
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8000/userProfile/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to fetch user");
        console.log(error.message);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  useEffect(() => {
    setOpen(false);
    setOpenS(false);
    setOpenD(false);
    setDrawerOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpenS(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);



  
  return (
    <div className="navbar">
      <div className="section1">
        <Menu className="icon1" onClick={() => setDrawerOpen(true)} />

        <Link to="/">
          <img
            className="img1"
            style={{ color: "bisque" }}
            src="https://pngimg.com/uploads/github/github_PNG40.png"
            alt="logiIcon"
          ></img>
        </Link>
        <h4 className="h41">Dashboard</h4>
      </div>

      <div className="section2">
        <SearchIcon className="icon8" />
        <input
          type="text"
          className="inp1"
          placeholder="Type To Search"
        ></input>
      </div>
      <div className="section3">
        <div className="ic1">
          <img
            className="img2"
            src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-copilot-icon.png"
            alt=""
          />
          |
          <Cloud className="icon2" />
        </div>
        <div className="ic2">
          <div className="plus-wrapper" ref={ref}>
            {/* Button */}
            <div className="plus-btn" onClick={() => setOpenS(!openS)}>
              <PlusIcon className="icon3" />
            </div>

            {/* DROPDOWN */}
            {openS && (
              <div className="plus-menu">
                <Link
                  onClick={() => {
                    setOpenD(true);
                    setOpenS(false);
                  }}
                  className="plus-item"
                >
                  <CircleDot size={16} />
                  New issue
                </Link>

                <Link to="/createRepo" className="plus-item">
                  <BookPlus size={16} />
                  New repository
                </Link>

                <Link to="/import" className="plus-item">
                  <Upload size={16} />
                  Import repository
                </Link>

                <div className="divider" />

                <Link to="/agent" className="plus-item">
                  <Cloud size={16} />
                  New agent session
                </Link>

                <Link to="/codespace" className="plus-item">
                  <Laptop size={16} />
                  New codespace
                </Link>

                <Link to="/gist" className="plus-item">
                  <Code size={16} />
                  New gist
                </Link>

                <div className="divider" />

                <Link to="/org/new" className="plus-item">
                  <Building2 size={16} />
                  New organization
                </Link>

                <Link to="/project/new" className="plus-item">
                  <FolderPlus size={16} />
                  New project
                </Link>
              </div>
            )}

            {/* {openD && <IssueModal onClose={() => setOpenD(false)} />} */}

          </div>

          <Link to={"/issues"}>
            <CircleDotIcon className="icon4" />
          </Link>
          <Link to="/pullRequest"><GitPullRequestArrowIcon className="icon5" /></Link>
          <BookMarkedIcon className="icon6" />
          <Link to={"/notifications"}><MessageSquareDotIcon className="icon7" /></Link>
        </div>
        <div className="gh-wrapper" ref={dropdownRef}>
          <img
            src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png"
            alt="User"
            className="avatar"
            onClick={() => setOpen(!open)}
          />

          {open && (
            <div className="gh-dropdown">
              <div className="gh-header">
                <div className="gh-username">{user?.user?.username}</div>
                <div className="gh-name">{user?.user?.email}</div>
              </div>

              <div className="gh-item">
                <Smile size={16} />
                <span>Set status</span>
              </div>

              <div className="gh-divider" />

              <Link style={{ textDecoration: "none" }} to={"/profile"}>
                <MenuItem icon={<User size={16} />} text="Profile" />
              </Link>
              <Link to={"/myrepo"} style={{ textDecoration: "none" }}>
                <MenuItem icon={<Book size={16} />} text="Repositories" />
              </Link>
              <Link
                to={`/starRepos`}
                style={{ textDecoration: "none" }}
              >
                <MenuItem icon={<Star size={16} />} text="Stars" />
              </Link>
              <Link

                style={{ textDecoration: "none" }}
                onClick={() => {
                  setOpenD(true);
                  setOpen(false);
                }}
              >
                <MenuItem icon={<CircleDot size={16} />} text="New issue" />
              </Link>
              <Link style={{ textDecoration: "none" }} to="/createRepo"><MenuItem icon={<BookPlus size={16} />} text="New Repository" /></Link>
              {/* <MenuItem icon={<Trash2Icon size={16} />} text="Delete account" /> */}
              <Link to="/settings/delete" style={{ textDecoration: "none" }}>
                <MenuItem icon={<Trash2Icon size={16} />} text="Delete account" />
              </Link>

              <Link to="/sponsors" style={{ textDecoration: "none" }}><MenuItem icon={<Heart size={16} />} text="Sponsors" /></Link>

              <div className="gh-divider" />

              <Link to="/settings" style={{ textDecoration: "none" }}><MenuItem icon={<Settings size={16} />} text="Settings" /></Link>
              <MenuItem icon={<Sparkles size={16} />} text="Copilot settings" />
              <MenuItem
                icon={<Sparkles size={16} />}
                text="Feature preview"
                badge="New"
              />
              <Link to="/appearance" style={{ textDecoration: "none" }}><MenuItem icon={<Sun size={16} />} text="Appearance" /></Link>
              <MenuItem
                icon={<Accessibility size={16} />}
                text="Accessibility"
              />
              <MenuItem text="Try Enterprise" badge="Free" />

              <div className="gh-divider" />

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  setCurrentUser(null);
                  window.location.href = "/auth";
                }}
                style={{
                  all: "unset",
                  width: "257px",
                  font: "inherit",
                  color: "inherit",
                  cursor: "pointer",
                  background: "none",
                }}
              >
                <MenuItem icon={<LogOut size={16} />} text="Sign out" />
              </button>
            </div>
          )}
          {openD && <IssueModal onClose={() => setOpenD(false)} />}
        </div>
      </div>

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

function MenuItem({ icon, text, badge }) {
  return (
    <div className="gh-item">
      {icon && icon}
      <span>{text}</span>
      {badge && <span className="gh-badge">{badge}</span>}
    </div>
  );
}

{
  /* <SideDrawer */
}

export default Navbar;
