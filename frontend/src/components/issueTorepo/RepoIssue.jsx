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
import "./myissue.css";
// import Navbar from "./Navbar";
// import { useAuth } from "../context/authContext";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import TerminalLoader from "../Loader/TerminalLoader";
import IssueModal from "../issuemodel/IssueModal";

const RepoIssue = () => {
  const { currentUser } = useAuth();
  const { repoId } = useParams();
  //   const [issues, setIssues] = useState([]);
  const [repoIssues, setRepoIssues] = useState([]);
  const [loading, setLoading] = useState(false);


  const [openD, setOpenD] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const fetchRepoIssues = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/issues/repo/${repoId}`,
        );
        setRepoIssues(res?.data);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        toast.error(err?.response?.data?.error || "Failed to fetch issues");
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchRepoIssues();
  }, [repoId]);

  const openIssues = repoIssues?.filter(issue => issue?.status === "open") || [];

  useEffect(() => {
    setOpenD(false);
  }, [location.pathname]);


  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}
      <div className="issues-layoutGAND">
        {/* Sidebar */}
        <aside className="issues-sidebarGAND">
          <div className="sidebar-itemGAND ">
            <User2 size={16} />
            <span>Assigned to me</span>
          </div>

          <div className="sidebar-itemGAND activeGAND">
            <Smile size={16} />
            <span>Created by me</span>
          </div>

          <div className="sidebar-itemGAND">
            <AtSign size={16} />
            <span>Mentioned</span>
          </div>

          <div className="sidebar-itemGAND">
            <Clock size={16} />
            <span>Recent activity</span>
          </div>

          <div className="viewsGAND">
            <span>Views</span>
            <Plus size={16} />
          </div>
        </aside>

        {/* Main */}
        <main className="issues-mainGAND">
          <div className="issues-topGAND">
            <h2>Assigned to me</h2>

            <button onClick={() => setOpenD(true)} className="new-issue-btnGAND">New issue</button>
          </div>

          {/* Filter Bar */}
          <div className="filter-barGAND">
            <div className="filter-inputGAND">
              <span>
                is:issue state:open archived:false assignee:@me
                sort:updated-desc
              </span>
            </div>
            <Search className="llmGAND" />
          </div>

          {openD && <IssueModal onClose={() => setOpenD(false)} />}

          {/* Results */}


          <div className="issues-wrapperMGGAND">
            {/* Header */}
            <div className="issues-headerMGGAND">
              {/* <span className="results">1 result</span> */}
              <span className="resultsGAND">
                {/* {repoIssues?.length} result{repoIssues?.length !== 1 && "s"} */}
                {openIssues.length} result{openIssues.length !== 1 && "s"}
              </span>

              <div className="updated-sortMGGAND">
                <ArrowUpDown size={16} />
                <span>Updated</span>
              </div>
            </div>

            {/* {repoIssues.map((issue) => (
              <div key={issue?._id} className="issue-rowMGGAND">
                <div className="issue-leftGAND">
                  <CheckCircle2 size={18} className="open-iconMGGAND" />

                  <div className="issue-infoMGGAND">
                    <h3 className="issue-titleMGGAND">{issue?.title}</h3>

                    <p className="issue-metaMGGAND">
                      <span className="repoMGGAND">
                        {issue?.repository?.name || "Repository"} / &nbsp;
                        {issue?.author?.username || "Owner"}
                      </span>
                      <span className="hashMGGAND">#{issue?._id.slice(-4)}</span>
                      {" · "}
                      You opened this
                    </p>
                  </div>
                </div>

                <div className="issue-commentsMGGAND">
                  <MessageSquare size={16} />
                  <span>0</span>
                </div>
              </div>
            ))} */}

            {repoIssues?
              .filter(issue => issue?.status === "open") // केवल open issues
              .map((issue) => (
                <div key={issue?._id} className="issue-rowMGGAND">
                  <div className="issue-leftGAND">
                    <CheckCircle2 size={18} className="open-iconMGGAND" />

                    <div className="issue-infoMGGAND">
                     <Link to={`/issue/${issue?._id}`} style={{textDecoration: "none"}}><h3 className="issue-titleMGGAND">{issue?.title}</h3></Link> 

                      <p className="issue-metaMGGAND">
                        <span className="repoMGGAND">
                          {issue?.repository?.name || "Repository"} / &nbsp;
                          {issue?.author?.username || "Owner"}
                        </span>
                        <span className="hashMGGAND">#{issue?._id.slice(-4)}</span>
                        {" · "}
                        You opened this
                      </p>
                    </div>
                  </div>

                  <div className="issue-commentsMGGAND">
                    <MessageSquare size={16} />
                    {/* <span>0</span> */}
                     <span>{issue?.comments?.length || 0}</span>
                  </div>
                </div>
              ))}

          </div>
        </main>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
};

export default RepoIssue;
