import axios from "axios";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./issueModal.css";
import toast from "react-hot-toast";

export default function IssueModal({ onClose }) {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [open, setOpen] = useState(false);
  const dropRef = useRef();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true)
        const userId = localStorage.getItem("userId");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/repo/user/${userId}`,
        );

        setRepos(Array.isArray(res?.data?.repositories) ? res?.data?.repositories : []);

        if (res?.data?.repositories?.length > 0) {
          setSelectedRepo(res?.data?.repositories[0]);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch repositories");
        console.log(error?.response);
      } finally {
         setTimeout(() => setLoading(false), 600);
      }
    };

    fetchRepos();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!dropRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* <Navbar/> */}
      {loading &&
      <div className="gh-overlayMAHAKAL">
        <div className="gh-modalMAHAKAL">
          {/* Header */}
          <div className="gh-headerMAHAKAL">
            <h2>Create new issue</h2>
            <X className="iconMAHAKAL" onClick={onClose} />
          </div>

          {/* Repository */}
          <div className="gh-sectionMAHAKAL">
            <label>
              Repository <span>*</span>
            </label>

            <div
              className="repo-selectMAHAKAL"
              onClick={() => setOpen((p) => !p)}
              style={{ position: "relative" }}
              ref={dropRef}
            >
              <div className="repo-leftMAHAKAL">
                <div className="repo-iconMAHAKAL" />
                {selectedRepo
                  ? `${selectedRepo?.owner?.username}/${selectedRepo?.name}`
                  : "Select repository"}
              </div>
              <ChevronDown size={16} />

              {open && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #d0d7de",
                    borderRadius: "6px",
                    zIndex: 20,
                    maxHeight: "200px",
                    overflowY: "auto",
                    // overscrollBehavior: "contain",   // ⭐ MAGIC LINE
                  }}
                >
                  {repos.map((repo) => (
                    <div
                      key={repo?._id}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // ⭐ important
                        setSelectedRepo(repo);
                        setOpen(false);
                      }}
                    >
                      {repo?.owner?.username}/{repo?.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Templates */}
          <div className="template-headerMAHAKAL">Templates and forms</div>

          <div className="template-itemMAHAKAL">
            <div>
              <div className="titleMAHAKAL">Blank issue</div>
              <Link
                to="/createIssue"
                state={{ repo: selectedRepo }}
                className="subtitleMAHAKAL"
                style={{ textDecoration: "none" }}
              >
                Create a new issue from scratch
              </Link>
            </div>
            <Link to="/createIssue" state={{ repo: selectedRepo }} style={{textDecoration: "none"}}><ArrowRight size={18} /></Link>
          </div>
        </div>
      </div>}
      {/* <GithubFooter /> */}
    </>

  );
}
