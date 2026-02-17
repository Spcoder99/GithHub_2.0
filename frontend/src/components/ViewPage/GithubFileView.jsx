import axios from "axios";
import {
  BarChart2,
  Bot,
  Check,
  CircleDot,
  Code,
  Copy,
  Download,
  GitBranch,
  GitPullRequest,
  History,
  LayoutGrid,
  Pencil,
  Play,
  Search,
  Shield,
  Trash2Icon
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";
import "./github-file.css";

export default function GithubFileView() {
  const { repoId, fileKey } = useParams();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();


  const [repo, setRepo] = useState([]);
  const userId = localStorage.getItem("userId");

  const [fileName, setFileName] = useState("");



  useEffect(() => {
    const fetchRepo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/repo/${repoId}`);
        // console.log(res.data);
        setRepo(Array.isArray(res?.data?.repository) ? res?.data?.repository : []);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch repo");
        console.error("Error fetching repo:", err);
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchRepo();
  }, [repoId]);



  // Function to download any string content as a file
  function downloadFile(content, fileName, mimeType = "text/plain") {
    const blob = new Blob([content], { type: mimeType }); // create a blob
    const url = URL.createObjectURL(blob); // create temporary URL
    const a = document.createElement("a"); // create anchor element
    a.href = url;
    a.download = fileName; // set filename
    document.body.appendChild(a);
    a.click(); // trigger download
    document.body.removeChild(a); // remove anchor
    URL.revokeObjectURL(url); // release URL
  }


  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        setLoading(true);
        console.log(import.meta.env.VITE_API_URL);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/repo/${repoId}/file/content?key=${encodeURIComponent(fileKey)}`,
        );
        setContent(res?.data?.content);
        setFileName(res?.data?.fileName);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch file content");
        console.error("Error fetching file content:", err);
        setContent("// Unable to load file");
      } finally {
        // setLoading(false);
         setTimeout(() => setLoading(false), 500);
      }
    };

    fetchFileContent();
  }, [repoId, fileKey]);



  const handleDeleteFile = async () => {

    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/repo/${repoId}/file/delete`,
        { data: { key: fileKey } }, // DELETE body
      );
      toast.success( res?.data?.message||"File deleted successfully!");
      navigate(`/repo/${repoId}/files`);
      // /repo/:repoId/files
    } catch (err) {
      console.error("Failed to delete file:", err);
      toast.error( err?.response?.data?.error||"Failed to delete file");
    }
  };


  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2s
      })
      .catch((err) => console.error("Failed to copy:", err), toast.error(  err?.response?.data?.error||"Failed to copy to clipboard"));
  };

  // console.log(content);
  const openIssue = repo?.[0]?.issues?.filter(issue => issue?.status === "open") || [];

  const code = content?.split("\n");

  // if (loading) return <p>Loading...</p>;
  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}
      <div className="gh-rootCHUTH">
        {/* TOP NAV */}
        <div className="gh-tabsCHUTH">
          <Tab icon={Code} label="Code" active />
          <Link style={{ textDecoration: "none" }} to={`/issues/repo/${repoId}`}><Tab icon={CircleDot} label="Issues" badge={openIssue?.length} /></Link>
          <Tab icon={GitPullRequest} label="Pull requests" />
          <Tab className="MOROCCO" icon={Bot} label="Agents" />
          <Tab className="MOROCCO" icon={Play} label="Actions" />
          <Tab className="MOROCCO" icon={LayoutGrid} label="Projects" />
          <Tab className="MOROCCO" icon={Shield} label="Security" />
          <Tab className="MOROCCO" icon={BarChart2} label="Insights" />
        </div>

        {/* PATH BAR */}
        <div className="path-barCHUTH">
          <div className="branchCHUTH">
            <GitBranch size={14} />
            <span>main</span>
          </div>

          <div className="pathCHUTH">
            <span className="linkCHUTH">Github</span>
            <span>/</span>
            <span className="linkCHUTH">File_Name</span>
            <span>/</span>
            <span className="fileCHUTH">{fileName}</span>
          </div>

          <div className="path-actionsCHUTH">
            <Search size={16} />
            <Link style={{ textDecoration: "none" }} to={`/repo/${repoId}/files`}><span  className="go-fileCHUTH">Go to file</span></Link>
            <kbd>t</kbd>
          </div>
        </div>

        {/* COMMIT INFO */}
        <div className="commit-barCHUTH">
          <div className="commit-leftCHUTH">
            <img src="https://avatars.githubusercontent.com/u/1?v=4" alt="" />
            <span className="authorCHUTH">my-project</span>
            <span className="messageCHUTH">Add Project Files</span>
          </div>

          <div className="commit-rightCHUTH">
            <span>cb82516</span>
            <span>· 2 years ago</span>
            <History size={14} />
          </div>
        </div>

        {/* FILE META */}
        <div className="file-metaCHUTH">
          <span>42 lines</span>
          <span>(37 loc)</span>
          <span>·</span>
          <span>606 Bytes</span>
        </div>

        {/* FILE ACTION BAR */}
        <div className="file-actionsCHUTH">
          <div className="leftCHUTH">
            <button className="activeCHUTH">Code</button>
            <button>Blame</button>
          </div>

          <div className="rightCHUTH">
            <IconBtn disabled={userId !== repo?.[0]?.owner?._id} onClick={handleDeleteFile} icon={Trash2Icon} />
            <IconBtn icon={copied ? Check : Copy} onClick={copyToClipboard} />
            <IconBtn
              icon={Download}
              onClick={() => downloadFile(content, fileKey?.split("/").pop())}
            />
            <Link

              to={`/repo/${repoId}/file/${encodeURIComponent(fileKey)}/edit`}
              style={{ textDecoration: "none" }}
            >
              <IconBtn disabled={(userId !== repo?.[0]?.owner?._id)} icon={Pencil} />
            </Link>
          </div>
        </div>

        {/* CODE VIEW */}
        {/* <div className="code-box">
        {code.map((line, i) => (
          <div className="code-line" key={i}>
            <span className="ln">{i + 1}</span>
            <span className="code">{line}</span>
          </div>
        ))}
      </div> */}

        <div className="code-boxCHUTH">
          {(
            code.map((line, i) => (
              <div className="code-lineCHUTH" key={i}>
                <span className="lnCHUTH">{i + 1}</span>
                <span className="codeCHUTH">{line}</span>
              </div>
            ))
          )}
        </div>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
}

function Tab({ icon: Icon, label, badge, active, className = "" }) {
  return (
    <div className={`tabCHUTH ${active ? "activeCHUTH" : ""} ${className}`}>
      <Icon size={16} />
      <span>{label}</span>
      {badge && <span className="badgeCHUTH">{badge}</span>}
    </div>
  );
}

function IconBtn({ icon: Icon, onClick, disabled }) {
  return (
    <button className="icon-btnCHUTH" onClick={onClick} disabled={disabled}>
      <Icon size={16} />
    </button>
  );
}


// const code = [content];
// const code = content.split("\n");
