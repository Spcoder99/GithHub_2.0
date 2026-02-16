import axios from "axios";
import {
  ArrowUpDown,
  AtSign,
  CheckCircle2,
  Clock,
  MessageSquare,
  Plus,
  Search,
  Smile,
  User2
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import IssueModal from "./issuemodel/IssueModal";
import "./IssuesPage.css";
import TerminalLoader from "./Loader/TerminalLoader";

const IssuesPage = () => {
  const { currentUser } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [openD, setOpenD] = useState(false);

  const location = useLocation();


  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        if (!currentUser) {
          setError("Please login first");
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/issues/me`, {
          headers: {
            userId: currentUser,
          },
        });

        // ⭐⭐⭐ ONLY OPEN ISSUES ⭐⭐⭐
        const openIssues = res?.data?.filter(
          (issue) => issue?.status === "open"
        );

        setIssues(openIssues);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch issues"
        );

        toast.error(error || "Failed to fetch issues");
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchIssues();
  }, [currentUser]);

  useEffect(() => {
    setOpenD(false);
  }, [location.pathname]);



  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}
      <div className="issues-layout">
        {/* Sidebar */}
        <aside className="issues-sidebar">
          <div className="sidebar-item ">
            <User2 size={16} />
            <span>Assigned to me</span>
          </div>

          <div className="sidebar-item active">
            <Smile size={16} />
            <span>Created by me</span>
          </div>

          <div className="sidebar-item">
            <AtSign size={16} />
            <span>Mentioned</span>
          </div>

          <div className="sidebar-item">
            <Clock size={16} />
            <span>Recent activity</span>
          </div>

          <div className="views">
            <span>Views</span>
            <Plus size={16} />
          </div>
        </aside>

        {/* Main */}
        <main className="issues-main">
          <div className="issues-top">
            <h2>Assigned to me</h2>

            <button onClick={() => {
              setOpenD(true);
            }} className="new-issue-btn">New issue</button>

          </div>

          {openD && <IssueModal onClose={() => setOpenD(false)} />}
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-input">
              <span>
                is:issue state:open archived:false assignee:@me
                sort:updated-desc
              </span>
            </div>
            <Search className="llm" />
          </div>

          {/* Results */}
          <div className="issues-wrapperMG">
            {/* Header */}
            <div className="issues-headerMG">
              <span className="results">
                {issues?.length} result{issues?.length !== 1 && "s"}
              </span>

              <div className="updated-sortMG">
                <ArrowUpDown size={16} />
                <span>Updated</span>
              </div>
            </div>

            {/* Loading */}
            {loading && <p>Loading issues...</p>}

            {/* Error */}
            {error && <p>{error}</p>}

            {/* List */}
            {!loading &&
              !error &&
              issues.map((issue) => (
                <div key={issue?._id} className="issue-rowMG">
                  <div className="issue-left">
                    <CheckCircle2 size={18} className="open-iconMG" />

                    <div className="issue-infoMG">
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/issue/${issue?._id}`}
                      >
                        <h3 className="issue-titleMG">
                          {issue?.title}
                        </h3>
                      </Link>

                      <p className="issue-metaMG">
                        <span className="repoMG">
                          {issue?.repository?.name || "Repository"} /
                          &nbsp;{issue?.author?.username || "Owner"}
                        </span>
                        <span className="hashMG">
                          #{issue?._id.slice(-4)}
                        </span>
                        {" · "}
                        You opened this
                      </p>
                    </div>
                  </div>

                  <div className="issue-commentsMG">
                    <MessageSquare size={16} />
                    <span>{issue?.comments?.length || 0}</span>
                  </div>
                </div>
              ))}

            {/* No Issues */}
            {!loading && !error && issues.length === 0 && (
              <div style={{ padding: "20px" }}>
                <h3>No open issues</h3>
              </div>
            )}
          </div>
        </main>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
};

export default IssuesPage;
