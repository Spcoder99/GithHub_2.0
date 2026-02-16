import {
  BarChart,
  BookOpen,
  CircleDot,
  Code,
  GitPullRequest,
  LayoutGrid,
  Play,
  Settings,
  Shield,
} from "lucide-react";
import "./editfile.css";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";

export default function EditFile() {
  // const { repoId } = useParams();
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  // //  const { repoId } = useParams();
  const [repo, setRepo] = useState([]);

  const { repoId, fileKey } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepoAndFile = async () => {
      try {
        // Fetch repo info (optional)
        setLoading(true);
        const repoRes = await axios.get(`http://localhost:8000/repo/${repoId}`);
      
        setRepo(Array.isArray(repoRes?.data?.repository) ? repoRes?.data?.repository : []);

      
        const fileRes = await axios.get(
          `http://localhost:8000/repo/${repoId}/file/content?key=${encodeURIComponent(fileKey)}`,
        );

        setFileName(fileKey?.split("/").pop()); // set filename automatically
        setContent(fileRes?.data?.content); // populate textarea
      } catch (err) {
        console.error("Error fetching repo or file:", err);
        toast.error(err?.response?.data?.error || "Failed to fetch repo or file");
      } finally {
        // setLoading(false);
        setLoading(false)
      }
    };

    fetchRepoAndFile();
  }, [repoId, fileKey]);


  const handleClose = () => {
    navigate(-1); // or any route you want to go when closing
  };


  const handleCommit = async () => {
    try {

      if (!fileName.trim()) {
        toast.error("File name is required");
        return;
      }

      const formData = new FormData();

      const originalName = fileKey?.split("/").pop(); // OLD NAME
      const file = new File([content], originalName);

      formData.append("file", file);
      formData.append("oldKey", fileKey);        // MOST IMPORTANT
      formData.append("newFileName", fileName); // rename if changed

      const res = await axios.post(
        `http://localhost:8000/repo/${repoId}/update`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res?.data?.message || "File updated");
      // navigate(`/repo/${repoId}/files`);
      setTimeout(() => navigate(`/repo/${repoId}/files`), 400);

    } catch (err) {
      console.error("Error updating file:", err);
      toast.error(err?.response?.data?.error || "Failed to update file");
    }
  };




  useEffect(() => {
    const fetchRepo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/repo/${repoId}`);
        // console.log(res.data);
        // setRepo(res.data || []);
        // console.log(res.data);
        setRepo(Array.isArray(res?.data?.repository) ? res?.data?.repository : []);
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.error || "Failed to fetch repo");
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchRepo();
  }, [repoId]);

  console.log(repo);

  const openIssue = repo?.[0]?.issues?.filter(issue => issue?.status === "open") || [];

  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}
      <div className="gh-pageMCKL">
        {/* TOP NAV TABS */}
        <div className="top-tabsMCKL">
          <Tab icon={Code} label="Code" active />
          <Tab icon={CircleDot} label="Issues" />
          <Tab icon={GitPullRequest} label="Pull requests" />
          <Tab className="VRINDAWAN" icon={Play} label="Actions" />
          <Tab className="VRINDAWAN" icon={LayoutGrid} label="Projects" />
          <Tab className="VRINDAWAN" icon={BookOpen} label="Wiki" />
          <Tab className="VRINDAWAN" icon={Shield} label="Security" />
          <Tab className="VRINDAWAN" icon={BarChart} label="Insights" />
          <Tab className="VRINDAWAN" icon={Settings} label="Settings" />
        </div>

        {/* CONTENT */}
        <div className="gh-containerMCKL">
          {/* BREADCRUMB */}
          <div className="breadcrumbMCKL">
            {/* <span className="repo">{repo[0].name}</span> */}
            <span className="repoMCKL">
              {repo && repo?.length > 0 ? repo?.[0]?.name : "Loading..."}
            </span>

            <span>/</span>
            {/* <input placeholder="Name your file..." /> */}
            <input
              placeholder="Name your file..."
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />

            <span className="PORTUGAL">in</span>
            <span className="branchMCKL">main</span>

            <div className="breadcrumb-actionsMCKL">
              <button className="btnMCKL secondaryMCKL" onClick={handleClose}>Cancel changes</button>
              {/* <button className="btn primary">Commit changes…</button> */}
              <button className="btnMCKL primaryMCKL" disabled={!fileName.trim()} onClick={handleCommit}>
                Commit changes…
              </button>
            </div>
          </div>

          {/* EDITOR TOOLBAR */}
          <div className="editor-toolbarMCKL">
            <div className="leftMCKL">
              <button className="tab-btnMCKL activeMCKL">Edit</button>
              <button className="tab-btnMCKL">Preview</button>
            </div>

            <div className="rightMCKL">
              <select
                style={{
                  padding: "6px",
                  borderRadius: "10px",
                  backgroundColor: "",
                }}
              >
                <option>Spaces</option>
              </select>
              <select
                style={{
                  padding: "6px",
                  borderRadius: "10px",
                  backgroundColor: "",
                }}
              >
                <option>2</option>
              </select>
              <select
                style={{
                  padding: "6px",
                  borderRadius: "10px",
                  backgroundColor: "",
                }}
              >
                <option>No wrap</option>
              </select>
            </div>
          </div>

          {/* EDITOR */}
          <div className="editor-boxMCKL">
            {/* <textarea
            spellCheck={false}
            placeholder="Enter file contents here"
          /> */}
            <textarea
              spellCheck={false}
              placeholder="Enter file contents here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* FOOTER */}
          <div className="editor-footerMCKL">
            Use <kbd>Control</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd> to toggle
            the tab key moving focus. Alternatively, use <kbd>Esc</kbd> then{" "}
            <kbd>Tab</kbd> to move to the next interactive element on the page.
          </div>
        </div>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
}

function Tab({ icon: Icon, label, active, className = "" }) {
  return (
    <div className={`tabMCKL ${active ? "activeMCKL" : ""} ${className}`}>
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
}
