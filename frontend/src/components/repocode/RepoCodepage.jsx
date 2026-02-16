import {
  BarChart2,
  BookOpen,
  Check,
  CircleDot,
  Cloud,
  Code,
  Code2Icon,
  Copy,
  Eye,
  GitFork,
  GitPullRequest,
  Laptop,
  LayoutGrid,
  Pin,
  Play,
  Settings,
  Shield,
  Star,
  UserPlus,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import "./repocode.css";
// import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TerminalLoader from "../Loader/TerminalLoader";

const RepoCodePage = () => {
  // const { repoId } = useParams();
  const { id } = useParams();
  // const [loading, setLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  const [copied, setCopied] = useState(false);

  const [repo, setRepo] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/repo/${id}`)
      .then((res) => setRepo(Array.isArray(res?.data?.repository) ? res?.data?.repository : []))
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/userProfile/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to fetch user");
        console.log(error.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (userId) fetchUser();

  }, [userId]);


  const copyToClipboard = () => {
    const content = `https://github.com/${user?.user?.username}/hh.git`;
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2s
      })
      .catch((err) => console.error("Failed to copy:", err), toast.error(err?.response?.data?.error || "Failed to copy to clipboard"));
  };


  return (
    <>
      {/* <Navbar /> */}
      {loading && <TerminalLoader />}
      <div className="repo-pageXTYUIOP">
        {/* Top tabs */}
        <div className="repo-tabsXTYUIOP">
          <Tab icon={<Code size={16} />} active text="Code" />
          <Tab icon={<CircleDot size={16} />} text="Issues" />
          <Tab
            className="popopopo"
            icon={<GitPullRequest size={16} />}
            text="Pull requests"
          />
          <Tab className="popopopo" icon={<Cloud size={16} />} text="Agents" />
          <Tab className="popopopo" icon={<Play size={16} />} text="Actions" />
          <Tab
            className="popopopo"
            icon={<LayoutGrid size={16} />}
            text="Projects"
          />
          <Tab className="popopopo" icon={<BookOpen size={16} />} text="Wiki" />
          <Tab
            className="popopopo"
            icon={<Shield size={16} />}
            text="Security"
          />
          <Tab
            className="popopopo"
            icon={<BarChart2 size={16} />}
            text="Insights"
          />
          <Tab icon={<Settings size={16} />} text="Settings" />
          <Link to={`/repo/${id}/addfile`} style={{ textDecoration: "none" }}>
            <Tab icon={<Code2Icon size={16} />} text={"Add File"} />
          </Link>
        </div>

        {/* Repo header */}
        <div className="repo-headerXTYUIOP">
          <div className="repo-leftXTYUIOP">
            <img
              src="https://avatars.githubusercontent.com/u/1?v=4"
              alt=""
              className="repo-avatarXTYUIOP"
            />
            <span className="repo-nameXTYUIOP">{repo?.[0]?.name}</span>
            <span className="repo-pillXTYUIOP">{repo?.[0]?.visibility ? "Public" : "Private"}</span>
          </div>

          <div className="repo-actionsXTYUIOP">
            <Action icon={<Pin size={14} />} text="Pin" />
            <Action icon={<Eye size={14} />} text="Watch" count="0" />
            <Action icon={<GitFork size={14} />} text="Fork" count="0" />
            <Action icon={<Star size={14} />} text="Star" count="0" />
          </div>
        </div>

        {/* Cards */}
        <div className="repo-cardsXTYUIOP">
          <Card
            icon={<Laptop size={20} />}
            title="Start coding with Codespaces"
            text="Add a README file and start coding in a secure, configurable, and dedicated development environment."
            button="Create a codespace"
          />

          <Card
            icon={<UserPlus size={20} />}
            title="Add collaborators to this repository"
            text="Search for people using their GitHub username or email address."
            button="Invite collaborators"
          />
        </div>

        {/* Quick setup */}
        <div className="quick-setupXTYUIOP">
          <h3>Quick setup — if you’ve done this kind of thing before</h3>

          <div className="setup-rowXTYUIOP">
            <button className="btnXTYUIOP">Set up in Desktop</button>
            <span>or</span>
            <div className="pillXTYUIOP">HTTPS</div>
            <div className="pillXTYUIOP">SSH</div>

            <div className="copy-boxXTYUIOP">
              https://github.com/{user?.user?.username}/hh.git
              {/* <Copy style={{cursor: "pointer"}} onClick={copyToClipboard} size={16} /> */}
              {copied ? (
                <Check size={16} />
              ) : (
                <Copy style={{ cursor: "pointer" }} onClick={copyToClipboard} size={16} />
              )}

            </div>
          </div>

          <p className="setup-textXTYUIOP">
            Get started by <a href="#">creating a new file</a> or{" "}
            <a href="#">uploading an existing file</a>. We recommend every
            repository include a <a href="#">README</a>, <a href="#">LICENSE</a>
            , and <a href="#">.gitignore</a>.
          </p>
        </div>

        {/* CLI sections */}
        <CliBlock
          title="…or create a new repository on the command line"
          lines={[
            'echo "# hh" >> README.md',
            "git init",
            "git add README.md",
            'git commit -m "first commit"',
            "git branch -M main",
            `git remote add origin https://github.com/${user?.user?.username}/hh.git`,
            "git push -u origin main",
          ]}
        />

        <CliBlock
          title="…or push an existing repository from the command line"
          lines={[
            `git remote add origin https://github.com/${user?.user?.username}/hh.git`,
            "git branch -M main",
            "git push -u origin main",
          ]}
        />

        <div className="protipXTYUIOP">
          💡 <strong>ProTip!</strong> Use the URL for this page when adding
          GitHub as a remote.
        </div>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
};

const Tab = ({ icon, text, active, className = "" }) => (
  <div
    className={`repo-tabXTYUIOP ${active ? "activeXTYUIOP" : ""} ${className}`}
  >
    {icon}
    {text}
  </div>
);

const Action = ({ icon, text, count }) => (
  <button className="action-btnXTYUIOP">
    {icon}
    {text}
    {count !== undefined && <span className="countXTYUIOP">{count}</span>}
  </button>
);

const Card = ({ icon, title, text, button }) => (
  <div className="repo-cardXTYUIOP">
    {icon}
    <h4>{title}</h4>
    <p>{text}</p>
    <button className="btnXTYUIOP secondaryXTYUIOP">{button}</button>
  </div>
);

// const CliBlock = ({ title, lines }) => (
//   <div className="cli-block">
//     <h4>{title}</h4>
//     <pre>
//       <code>
//         {lines.map((l, i) => (
//           <div key={i}>{l}</div>
//         ))}
//       </code>
//     </pre>
//     <Copy size={16} className="copy-iconXTYUIOP" />
//   </div>
// );

const CliBlock = ({ title, lines }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const content = lines.join("\n");

    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy to clipboard", { id: "cli-copy-error" });
      });
  };

  return (
    <div className="cli-block">
      <h4>{title}</h4>
      <pre>
        <code>
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </code>
      </pre>

      {copied ? (
        <Check size={16} className="copy-iconXTYUIOP" />
      ) : (
        <Copy
          size={16}
          className="copy-iconXTYUIOP"
          onClick={handleCopy}
        />
      )}
    </div>
  );
};


export default RepoCodePage;
