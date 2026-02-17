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
import "./addread.css";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";

export default function AddRead() {
  const { repoId } = useParams();
  const [fileName, setFileName] = useState("readme.md");
  const [content, setContent] = useState("");
 
  const [repo, setRepo] = useState([]);

  // ✅ Per-button loading
  const [loadingButtons, setLoadingButtons] = useState({});

  const [loading, setLoading] = useState(false);

  const isCommitDisabled = content.trim() === "";

  const navigate = useNavigate();

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
        throw new Error(data?.message || "Commit failed");
      }
      // toast.success(data.message);
      toast.success(data?.message || "File created");
      setTimeout(() => navigate(`/repo/${repoId}/files`), 600);

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
        // setRepo(res.data || []);
        setRepo(Array.isArray(res?.data?.repository) ? res?.data?.repository : []);
      } catch (err) {
        console.log(err?.response?.data?.error || "Failed to fetch repo");
        toast.error("Failed to fetch repo");
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchRepo();
  }, [repoId]);


  const cancelToggle=() => {
    navigate(-1);
  }


  return (
    <>
      {loading && <TerminalLoader />}
      {/* <Navbar /> */}
      <div className="gh-pageLUND">
        {/* TOP NAV TABS */}
        <div className="top-tabsLUND">
          <Tab icon={Code} label="Code" active />
          <Tab icon={CircleDot} label="Issues" />
          <Tab icon={GitPullRequest} label="Pull requests" />
          <Tab className="MANALI-KULLI" icon={Play} label="Actions" />
          <Tab className="MANALI-KULLI" icon={LayoutGrid} label="Projects" />
          <Tab className="MANALI-KULLI" icon={BookOpen} label="Wiki" />
          <Tab className="MANALI-KULLI" icon={Shield} label="Security" />
          <Tab className="MANALI-KULLI" icon={BarChart} label="Insights" />
          <Tab className="MANALI-KULLI" icon={Settings} label="Settings" />
        </div>

        {/* CONTENT */}
        <div className="gh-containerLUND">
          {/* BREADCRUMB */}
          <div className="breadcrumbLUND">
            <span className="repoLUND">
              {repo && repo?.length > 0 ? repo?.[0]?.name : "Loading..."}
            </span>

            <span>/</span>
            <input
              placeholder="Name your file..."
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />

            <span className="TRIVENDRAM">in</span>
            <span className="branchLUND">main</span>

            <div className="breadcrumb-actionsLUND">
              <button className="btnLUND secondaryLUND" onClick={cancelToggle}>Cancel changes</button>
               <button
                className="btnLUND primaryLUND"
                disabled={isCommitDisabled || loadingButtons["commitFile"]}
                onClick={handleCommit}
                style={{
                  opacity: isCommitDisabled ? 0.5 : 1,
                  cursor: isCommitDisabled ? "not-allowed" : "pointer",
                  pointerEvents: isCommitDisabled ? "none" : "auto",
                }}
              >
                {loadingButtons["commitFile"] ? "Committing..." : "Commit changes…"}
              </button>
            </div>
          </div>

          {/* EDITOR TOOLBAR */}
          <div className="editor-toolbarLUND">
            <div className="leftLUND">
              <button className="tab-btnLUND activeLUND">Edit</button>
              <button className="tab-btnLUND">Preview</button>
            </div>

            <div className="rightLUND">
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
          <div className="editor-boxLUND">
            <textarea
              spellCheck={false}
              placeholder="Enter file contents here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* FOOTER */}
          <div className="editor-footerLUND">
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
    <div className={`tabLUND ${active ? "activeLUND" : ""} ${className}`}>
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
}
