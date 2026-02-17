import axios from "axios";
import {
  ChevronDown,
  Eye,
  EyeOff,
  Github,
  PlusCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./CreateRepository.css";
import TerminalLoader from "../Loader/TerminalLoader";

export default function CreateRepository() {
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // public
  const [open, setOpen] = useState(false);
  const dropRef = useRef();
  const [addReadme, setAddReadme] = useState(false);
  const [gitignoreTemplate, setGitignoreTemplate] = useState("");
  const [gitOpen, setGitOpen] = useState(false);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

    const [loadingButtons, setLoadingButtons] = useState({}); // Per-button loading

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId"); // same key as set in login
        if (!userId) {
          console.error("No userID found in localStorage");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/userProfile/${userId}`,
        );
        setUser(res?.data?.user);
      } catch (err) {
        console.error("Error fetching current user:", err);
        toast.error(err?.response?.data?.error || "Failed to fetch user");
      } finally {
        // setLoading(false);
        // setTimeout(() => setLoading(false), 600);
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // const navigate = useNavigate();

  const handleCreateRepo = async () => {
    const buttonKey = "createRepo"; 
    try {
      setLoadingButtons(prev => ({ ...prev, [buttonKey]: true }));
      const owner = localStorage.getItem("userId"); // or from auth

      if (!owner) {
        console.error("No owner found in localStorage");
        toast.error("No owner found in localStorage");
        return;
      }

      if (!repoName.trim()) {
        toast.error("Repository name is required");
        return;
      }

      if (!description.trim()) {
        toast.error("Description is required");
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/repo/create`, {
        owner,
        name: repoName,
        description,
        visibility,
        issues: [],
        content: [],
        addReadme,
        gitignoreTemplate, //
      });

      toast.success("Repository created 🚀");
      navigate(`/myrepo`);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Error creating repo");
    } finally {
      setLoadingButtons(prev => ({ ...prev, [buttonKey]: false }));
    }
  };

  // if (loading) return <p>Loading...</p>;
  // if (!user) return <p>No user found</p>;

  return (
    <>
      {/* <Navbar /> */}
      {loading && <TerminalLoader/>}
      
      <div className="pageKL">
        <div className="containerKL">
          <h1 className="h1kl">Create a new repository</h1>
          <p className="subtitleKL">
            Repositories contain a project's files and version history. Have a
            project elsewhere? <a href="#">Import a repository</a>.
          </p>
          <p className="requiredKL">
            Required fields are marked with an asterisk (*).
          </p>

          {/* Section 1 */}
          <div className="sectionKL">
            <div className="section-headerKL">
              <span className="stepKL">1</span>
              <h2>General</h2>
            </div>

            <div className="rowKL">
              <div className="fieldKL">
                <label>Owner *</label>
                <div className="selectKL">
                  <Github size={16} />
                  <span>{user?.username}</span>
                  <ChevronDown size={16} />
                </div>
              </div>

              <span className="slashKL">/</span>

              <div className="fieldKL growKL">
                <label>Repository name *</label>
                {/* <input /> */}
                <input
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                />

                <small>
                  Great repository names are short and memorable. How about{" "}
                  <a href="#" className="jiop">
                    laughing-journey
                  </a>
                  ?
                </small>
              </div>
            </div>

            <div className="fieldKL lolo">
              <label>Description</label>
              {/* <input /> */}
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <small>0 / 350 characters</small>
            </div>
          </div>

          {/* Section 2 */}
          <div className="sectionKL">
            <div className="section-headerKL">
              <span className="stepKL">2</span>
              <h2>Configuration</h2>
            </div>

            <div className="cardKL">
              <div className="card-rowKL">
                <div>
                  <label className="NAJA-NAJA">Choose visibility *</label>
                  <p className="jklopi">
                    Choose who can see and commit to this repository
                  </p>
                </div>
                {/* <button className="dropdownKL">
                  <Eye size={16} />
                  Public
                  <ChevronDown size={16} />
                </button> */}
                <div style={{ position: "relative" }} ref={dropRef}>
                  <button
                    className="dropdownKL"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    {visibility ? <Eye size={16} /> : <EyeOff size={16} />}
                    {visibility ? "Public" : "Private"}
                    <ChevronDown size={16} />
                  </button>

                  {open && (
                    <div
                      style={{
                        position: "absolute",
                        top: "110%",
                        right: 0,
                        background: "#fff",
                        border: "1px solid #d0d7de",
                        borderRadius: "8px",
                        width: "220px",
                        boxShadow: "0 8px 24px rgba(140,149,159,0.2)",
                        zIndex: 100,
                        padding: "6px 0",
                      }}
                    >
                      {/* Public */}
                      <div
                        onClick={() => {
                          setVisibility(true);
                          setOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: visibility ? 600 : 400,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f6f8fa")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Eye size={16} />
                          Public
                        </div>
                        {visibility && <span>✓</span>}
                      </div>

                      {/* Divider */}
                      <div
                        style={{
                          height: "1px",
                          background: "#d0d7de",
                          margin: "4px 0",
                        }}
                      />

                      {/* Private */}
                      <div
                        onClick={() => {
                          setVisibility(false);
                          setOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: !visibility ? 600 : 400,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f6f8fa")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          🔒 Private
                        </div>
                        {!visibility && <span>✓</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-rowKL">
                <div>
                  <label className="NAJA-NAJA">Add README</label>
                  <p className="jklopi">
                    READMEs can be used as longer descriptions.
                  </p>
                </div>
                <label className="switchKL">
                  {/* <input type="checkbox" /> */}
                  {/* <input
                    type="checkbox"
                    checked={addReadme}
                    onChange={(e) => setAddReadme(e.target.checked)}
                  /> */}
                  <input
                    type="checkbox"
                    checked={addReadme}
                    onChange={() => setAddReadme(!addReadme)}
                  />

                  <span className="sliderKL" />
                </label>
              </div>

              <div className="card-rowKL">
                <div>
                  <label className="NAJA-NAJA">Add .gitignore</label>
                  <p className="jklopi">
                    .gitignore tells git which files not to track.
                  </p>
                </div>
                {/* <button className="dropdownKL">
                  No .gitignore <ChevronDown size={16} />
                </button> */}
                <div style={{ position: "relative" }}>
                  <button
                    className="dropdownKL"
                    onClick={() => setGitOpen((prev) => !prev)}
                  >
                    {gitignoreTemplate || "No .gitignore"}
                    <ChevronDown size={16} />
                  </button>

                  {gitOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "110%",
                        right: 0,
                        background: "#fff",
                        border: "1px solid #d0d7de",
                        borderRadius: "8px",
                        width: "200px",
                        boxShadow: "0 8px 24px rgba(140,149,159,0.2)",
                        zIndex: 100,
                        padding: "6px 0",
                      }}
                    >
                      {["Node", "React", "Java", "Python"].map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setGitignoreTemplate(item);
                            setGitOpen(false);
                          }}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#f6f8fa")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="card-rowKL">
                <div>
                  <label className="NAJA-NAJA">Add license</label>
                  <p className="jklopi">
                    Licenses explain how others can use your code.
                  </p>
                </div>
                <button className="dropdownKL">
                  No license <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="sectionKL">
            <div className="section-headerKL">
              <span className="stepKL">3</span>
              <h2>
                Jumpstart your project with Copilot{" "}
                <span className="optionalKL">(optional)</span>
              </h2>
            </div>

            <div className="fieldKL">
              <label className="njio">Prompt</label>
              <p className="hj">
                Tell Copilot coding agent what you want to build in this
                repository. After creation, Copilot will open a pull request
                with generated files - such as a basic app, starter code, or
                other features you describe - then request your review when it's
                ready.
              </p>
              <textarea
                className="jklop"
                placeholder="Describe what you want Copilot to build"
              />
              <small>0 / 500 characters</small>
            </div>
          </div>

          {/* <button className="create-btnKL" onClick={handleCreateRepo}>
            <PlusCircle size={16} />
            Create repository
          </button> */}

          <button
            className="create-btnKL"
            onClick={handleCreateRepo}
            disabled={loadingButtons["createRepo"]}
          >
            <PlusCircle size={16} />
            {loadingButtons["createRepo"] ? "Creating..." : "Create repository"}
          </button>

        </div>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
}
