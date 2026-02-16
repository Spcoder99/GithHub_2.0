import axios from "axios";
import {
  BarChart2,
  BookOpen,
  ChevronDown,
  CircleDot,
  Cloud,
  Code,
  Eye,
  FileText,
  Folder,
  GitFork,
  GitPullRequest,
  LayoutGrid,
  Pencil,
  Play,
  Shield,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";
import "./repoFiles.css";

export default function RepoFilesPage() {
  const { repoId } = useParams(); // <-- get repoId from URL
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [repo, setRepo] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/repo/${repoId}`);
        setRepo(Array.isArray(res?.data?.repository) ? res?.data?.repository : []);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch repo");
        console.error("Error fetching repo:", err);
      }
    };
    fetchRepo();
  }, [repoId]);


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/repo/${repoId}/files`);

        setFiles(res?.data);

        // console.log(res.data);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch repo files");
        console.error("Error fetching repo files:", err);
      } finally {
        // setLoading(false);  // ⭐ important
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchFiles();
  }, [repoId]);

  const readmeExists = files.some((file) =>
    file?.key.toLowerCase().endsWith("readme.md")
  );

  const openIssues = repo?.[0]?.issues?.filter(issue => issue?.status === "open") || [];

  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}

      <div className="repo-wrapCDO">
        {/* Tabs */}
        <div className="repo-tabsCDO">
          <Tab icon={<Code size={16} />} active text="Code" />
          <Link style={{ textDecoration: "none" }} to={`/issues/repo/${repoId}`}><Tab icon={<CircleDot size={16} />} text="Issues" badge={openIssues?.length} /></Link>
          <Tab icon={<GitPullRequest size={16} />} text="Pull requests" />
          <Tab className="KLRAHUL" icon={<Cloud size={16} />} text="Agents" />
          <Tab className="KLRAHUL" icon={<Play size={16} />} text="Actions" />
          <Tab className="KLRAHUL" icon={<LayoutGrid size={16} />} text="Projects" />
          <Tab className="KLRAHUL" icon={<Shield size={16} />} text="Security" />
          <Tab className="KLRAHUL" icon={<BarChart2 size={16} />} text="Insights" />
        </div>

        {/* Header */}
        <div className="repo-headerCDO">
          <div className="repo-titleCDO">
            <img
              src="https://avatars.githubusercontent.com/u/1?v=4"
              alt=""
            />
            <h1>{repo?.[0]?.name}</h1>
            <span className="pillCDO">{repo?.[0]?.visibility ? "Public" : "Private"}</span>
          </div>

          <div className="repo-actionsCDO">
            <Action icon={<Eye size={16} />} text="Watch" count="4" />
            <Action icon={<GitFork size={16} />} text="Fork" count="40" />
            <Action icon={<Star size={16} />} text="Star" count="80" />
          </div>
        </div>

        <div className="repo-bodyCDO">
          {/* Left */}
          <div className="repo-mainCDO">
            <div className="repo-toolbarCDO">
              <button className="ghostCDO">
                main <ChevronDown size={14} />
              </button>
              <span>1 Branch</span>
              <span>0 Tags</span>

              <input placeholder="Go to file" />
              <Link to={`/repo/${repoId}/addfile`} style={{ textDecoration: "none" }}><button disabled={userId !== repo?.[0]?.owner?._id} className="ghostCDO">Add file</button></Link>
              <button className="code-btnCDO">Code</button>
            </div>

            {/* File Table */}
            <div className="file-tableCDO">
              {files.map((file) => (
                <FileRow
                  key={file?.key}
                  icon={file?.key.endsWith("/") ? <Folder /> : <FileText />}
                  name={file?.key.split("/").pop()}
                  url={file?.url}
                  repoId={repoId}
                  fileKey={file?.key}
                  msg="" // optional commit message if available
                  time="" // optional commit time if available
                />
              ))}
            </div>

            {/* README Section */}
            {!loading && !readmeExists && (<div className="readmeCDO">
              <div className="readme-headerCDO">
                <BookOpen size={16} />
                <Link to={`/repo/${repoId}/files/readme`}><button disabled={userId !== repo?.[0]?.owner?._id} style={{ backgroundColor: "#2DA44E", padding: "7px", border: "1px solid transparent", borderRadius: "5px" , cursor: "pointer"}}>README</button></Link>
                <Pencil size={14} />
              </div>

              <h2>Github_Clone</h2>
              <p>
                A MERN based Github replica with custom version control
                implemented from scratch.
              </p>
            </div>)}
          </div>

          {/* Right Sidebar */}
          <aside className="repo-sideCDO">
            <h4>About</h4>
            <p>
              A MERN based Github replica with custom version control implemented
              from scratch.
            </p>

            <ul className="repo_UL_CDOP">
              <li>📘 Readme</li>
              <li>📈 Activity</li>
              <li>⭐ 80 stars</li>
              <li>👀 4 watching</li>
              <li>🍴 40 forks</li>
            </ul>

            <h4>Releases</h4>
            <p>No releases published</p>

            <h4>Packages</h4>
            <p>No packages published</p>

            <h4>Languages</h4>
            <div className="lang-barCDO">
              <span className="jsCDO" />
              <span className="cssCDO" />
              <span className="htmlCDO" />
            </div>
            <div className="lang-legendCDO">
              <span>JavaScript 86.1%</span>
              <span>CSS 13.2%</span>
              <span>HTML 0.7%</span>
            </div>
          </aside>
        </div>
      </div>
      {/* <GithubFooter/> */}
    </>
  );
}

/* ---------- helpers ---------- */

const Tab = ({ icon, text, badge, active, className = "" }) => (
  <div className={`tabCDO ${active ? "activeCDO" : ""} ${className}`}>
    {icon}
    {text}
    {badge && <span className="badgeCDO">{badge}</span>}
  </div>
);

const Action = ({ icon, text, count }) => (
  <button className="actionCDO">
    {icon}
    {text}
    <span>{count}</span>
  </button>
);

const FileRow = ({ icon, name, url, msg, time, repoId, fileKey }) => {
  // const openFile = () => {
  //   if (url) window.open(url, "_blank");
  // };
  const navigate = useNavigate();
  const openFile = () => {
    navigate(`/repo/${repoId}/file/${encodeURIComponent(fileKey)}`);
  };

  return (
    <div className="file-rowCDO" onClick={openFile} style={{ cursor: "pointer" }}>
      <div className="file-leftCDO">
        {icon}
        {name}
      </div>
      {msg && <div className="file-msgCDO">{msg}</div>}
      {time && <div className="file-timeCDO">{time}</div>}
    </div>
  );
};
