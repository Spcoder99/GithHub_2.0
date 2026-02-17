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
import "./addfile.css";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";

export default function AddFile() {
  const { repoId } = useParams();
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [repo, setRepo] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loadingButtons, setLoadingButtons] = useState({}); // ✅ per-button loading


  const handleCommit = async () => {
     const key = "commitFile";
    try {
      if (!fileName.trim()) {
        toast.error("File name is required");
        return;
      }
      setLoadingButtons((prev) => ({ ...prev, [key]: true }));
      const formData = new FormData();
      const file = new File([content], fileName); // fileName can be "folder1/folder2/myfile.txt" if you want folders
      formData.append("file", file);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/repo/${repoId}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Commit failed");
      }
      toast.success(data?.message || "File created");

      navigate(`/repo/${repoId}/files`);

    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Failed to commit file");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [key]: false }));
    }


  };


  useEffect(() => {
    const fetchRepo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/repo/${repoId}`);
        // console.log(res.data);
        setRepo(Array.isArray(res?.data?.repository) ? res?.data?.repository : []);
      } catch (err) {
        console.log(err);
        toast.error( err?.response?.data?.error || "Failed to fetch repo");
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchRepo();
  }, [repoId]);


  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}
      <div className="gh-page">
        {/* TOP NAV TABS */}
        <div className="top-tabs">
          <Tab icon={Code} label="Code" active />
          <Tab icon={CircleDot} label="Issues" />
          <Tab icon={GitPullRequest} label="Pull requests" />
          <Tab className="KERALA" icon={Play} label="Actions" />
          <Tab className="KERALA" icon={LayoutGrid} label="Projects" />
          <Tab className="KERALA" icon={BookOpen} label="Wiki" />
          <Tab className="KERALA" icon={Shield} label="Security" />
          <Tab className="KERALA" icon={BarChart} label="Insights" />
          <Tab className="KERALA" icon={Settings} label="Settings" />
        </div>

        {/* CONTENT */}
        <div className="gh-container">
          {/* BREADCRUMB */}
          <div className="breadcrumb">
            <span className="repo">{repo && repo?.length > 0 ? repo?.[0]?.name : "Loading..."}</span>

            <span>/</span>
            <input
              placeholder="Name your file..."
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />

            <span className="INAMINA">in</span>
            <span className="branch">main</span>

            <div className="breadcrumb-actions">
              <button className="btn secondary" onClick={() => navigate(-1)}>Cancel changes</button>
               <button
                className="btn primary"
                onClick={handleCommit}
                disabled={!fileName?.trim() || loadingButtons["commitFile"]}
              >
                {loadingButtons["commitFile"] ? "Committing..." : "Commit changes…"}
              </button>
            </div>
          </div>

          {/* EDITOR TOOLBAR */}
          <div className="editor-toolbar">
            <div className="left">
              <button className="tab-btn active">Edit</button>
              <button className="tab-btn">Preview</button>
            </div>

            <div className="right">
              <select
                style={{
                  padding: "6px",
                  borderRadius: "10px",
                  backgroundColor: "",
                }}
              >
                <option>Spaces</option>
              </select>
              <select style={{
                padding: "6px",
                borderRadius: "10px",
                backgroundColor: "",
              }}>
                <option>2</option>
              </select>
              <select style={{
                padding: "6px",
                borderRadius: "10px",
                backgroundColor: "",
              }}>
                <option>No wrap</option>
              </select>
            </div>
          </div>

          {/* EDITOR */}
          <div className="editor-box">
            <textarea
              spellCheck={false}
              placeholder="Enter file contents here"
              value={content}
              required
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* FOOTER */}
          <div className="editor-footer">
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
    <div className={`tab ${active ? "active" : ""} ${className}`}>
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
}

