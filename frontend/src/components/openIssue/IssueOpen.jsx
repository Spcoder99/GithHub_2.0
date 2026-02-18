import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";
import "./IssueOpen.css";
import IssueModal from "../issuemodel/IssueModal";

const IssueOpen = () => {
  const { issueId } = useParams();
  const userId = localStorage.getItem("userId");

  const [issue, setIssue] = useState(null);
  const [isMine, setIsMine] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);

    const [loadingButtons, setLoadingButtons] = useState({}); // ✅ Per-button loading

  // For editing comments
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const [openD, setOpenD] = useState(false);

  const navigate = useNavigate();

  // Add comment
  const handleAddComment = async () => {
    const buttonKey = "addComment";
    if (!comment.trim()) return;

    try {
       setLoadingButtons(prev => ({ ...prev, [buttonKey]: true }));
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/issue/comment/${issueId}`,
        { text: comment },
        { headers: { userid: userId } }
      );

      setIssue(res?.data?.issue); // re-render with new comment
      setComment("");
      toast.success(res?.data?.message || "Comment added successfully");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to add comment");
      console.log(err);
    } finally {
      setLoadingButtons(prev => ({ ...prev, [buttonKey]: false }));
    }
  };

  // Fetch issue
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/issue/${issueId}`, {
          headers: { userid: userId },
        });

        setIssue(res?.data?.issue);
        setIsMine(res?.data?.issue?.author?._id?.toString() === userId);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch issue");
        console.error("Error fetching issue:", err);
      } finally {
        // setLoading(false);
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchIssue();
  }, [issueId, userId]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/userProfile/${userId}`);
        setUser(res?.data?.user);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch user");
        console.error(err);
      } finally {
        // setLoading(false);
          setTimeout(() => setLoading(false), 500)
      }
    };
    fetchUser();
  }, [userId]);

  // Close issue
  const handleCloseIssue = async () => {
    const buttonKey = "closeIssue";
    try {
      setLoadingButtons(prev => ({ ...prev, [buttonKey]: true }));
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/issue/close/${issueId}`,
        {},
        { headers: { userid: userId } }
      );

      setIssue(res?.data?.issue);
      toast.success("Issue closed successfully");
      navigate(-1);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to close issue");
      console.log(err);
    } finally {
      setLoadingButtons(prev => ({ ...prev, [buttonKey]: false }));
    }
  };



  const confirmDelete = () =>
    new Promise((resolve) => {
      toast((t) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span>Are you sure you want to delete this issue?</span>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #d0d7de",
                background: "#f6f8fa",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#d1242f",
                color: "white",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ), { duration: Infinity });
    });


  // Delete issue
  const handleDeleteIssue = async () => {
    // if (!window.confirm("Are you sure you want to delete this issue?")) return;
 const buttonKey = "deleteIssue";
    const ok = await confirmDelete();

    if (!ok) return;

    try {
      setLoadingButtons(prev => ({ ...prev, [buttonKey]: true }));
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/issue/delete/${issueId}`, {
        headers: { userid: userId },
      });

      toast.success(res?.data?.message || "Issue deleted successfully");
      navigate("/issues");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete issue");
      console.log(err);
    } finally {
      setLoadingButtons(prev => ({ ...prev, [buttonKey]: false }));
    }
  };

  // if (!issue) return <div>Issue not found</div>;

  return (
    <>
      {loading && <TerminalLoader />}
      <div className="issue-wrapper-QUIOP">
        {/* Top tabs */}
        <div className="top-tabs-QUIOP">
          <span>Code</span>
          <span className="active-QUIOP">
            Issues {/*<span className="count-QUIOP">1</span>*/}
          </span>
          <span>Pull requests</span>
          <span className="LAUDA-LEHSUN">Agents</span>
          <span className="LAUDA-LEHSUN">Actions</span>
          <span className="LAUDA-LEHSUN">Projects</span>
          <span className="LAUDA-LEHSUN">Security</span>
          <span className="LAUDA-LEHSUN">Insights</span>
        </div>

        {/* Issue title */}
        <div className="issue-title-row-QUIOP">
          <h1>
            {issue?.title} <span>#{issue?._id}</span>
          </h1>

          <div className="HONDA">
            <button  onClick={() => {
                  setOpenD(true);
                }} className="btn-green-QUIOP">New issue</button>

            {isMine && (
              <>
                <Link to={`/issue/${issue?._id}/edit`}>
                  <button
                    disabled={issue?.status === "closed"}
                    className="btn-secondary-QUIOP"
                  >
                    Edit
                  </button>
                </Link>
                 <button
                  onClick={handleDeleteIssue}
                  className="btn-red-QUIOP"
                  style={{ marginLeft: "10px" }}
                >
                  {loadingButtons["deleteIssue"] ? "Deleting..." : "Delete"}
                </button>    {/* disabled={loadingButtons["deleteIssue"]} */}
              </>
            )}
          </div>
        </div>

        {openD && <IssueModal onClose={() => setOpenD(false)} />}

        {/* Status */}
        <div className="status-row-QUIOP">
          <div className="open-badge-QUIOP">
            <CheckCircle size={16} />
            {issue?.status}
          </div>

          <span className="light-text-QUIOP">{issue?.description}</span>
        </div>

        {/* Issue content */}
        <div className="issue-content-QUIOP">
          <div className="left-section-QUIOP">
            {/* Issue description */}
            <div className="comment-card-QUIOP">
              <div className="comment-header-QUIOP">
                <strong>{issue?.authorName || "Unknown"}</strong>
                <span className="light-text-QUIOP">
                  opened on {new Date(issue?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="comment-body-QUIOP">
                <p>{issue?.description}</p>
              </div>
            </div>

            {/* Comments */}
            {issue?.comments?.map((c) => {
              const isMyComment = c?.user === userId;
              const isEditing = editingCommentId === c?._id;

              const confirmDelete = () =>
                new Promise((resolve) => {
                  toast((t) => (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <span>Are you sure you want to delete this comment?</span>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          onClick={() => {
                            toast.dismiss(t.id);
                            resolve(false);
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #d0d7de",
                            background: "#f6f8fa",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => {
                            toast.dismiss(t.id);
                            resolve(true);
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            background: "#d1242f",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ), { duration: Infinity });
                });

              const handleUpdate = async () => {
                 const buttonKey = `updateComment-${c._id}`;
                if (!editText.trim()) return;
                try {
                   setLoadingButtons(prev => ({ ...prev, [buttonKey]: true }));
                  const res = await axios.put(
                    `${import.meta.env.VITE_API_URL}/issue/${issueId}/comment/${c?._id}`,
                    { text: editText },
                    { headers: { userid: userId } }
                  );
                  setIssue(res?.data?.issue);
                  setEditingCommentId(null);

                  setEditText("");
                  toast.success("Updated comment successfully");
                } catch (err) {
                  toast.error(err?.response?.data?.error || "Failed to update comment");
                } finally {
      setLoadingButtons(prev => ({ ...prev, [buttonKey]: false }));
    }
              };

              const handleDelete = async () => {
                  const buttonKey = `deleteComment-${c._id}`;
                const ok = await confirmDelete();

                if (!ok) return;

                try {
                  setLoadingButtons(prev => ({ ...prev, [buttonKey]: true }));
                  const res = await axios.delete(
                    `${import.meta.env.VITE_API_URL}/issue/${issueId}/comment/${c?._id}`,
                    { headers: { userid: userId } }
                  );
                  setIssue(res?.data?.issue);
                  toast.success("Comment deleted successfully");
                } catch (err) {
                  toast.error(err?.response?.data?.error || "Failed to delete comment");
                } finally {
      setLoadingButtons(prev => ({ ...prev, [buttonKey]: false }));
    }
              };

              return (
                <div key={c?._id} className="comment-card-QUIOP">
                  <div className="comment-header-QUIOP">
                    <div className="comment-user-QUIOP">
                      <div className="avatar-QUIOP">{(c?.userName || "U")[0]}</div>
                      <strong>{c?.userName || user?.username || "User"}</strong>
                    </div>
                    {isMyComment && !isEditing && (
                      <div className="DIVDI_OPOPOP" style={{ marginTop: "5px" }}>
                         <button
                          className="btn-secondary-QUIOP"
                          onClick={() => { setEditingCommentId(c?._id); setEditText(c?.text); }}
                          disabled={loadingButtons[`updateComment-${c._id}`]}
                        >
                          {loadingButtons[`updateComment-${c._id}`] ? "Saving..." : "Edit"}
                        </button>
                        <button
                          className="btn-red-QUIOP"
                          onClick={handleDelete}
                          disabled={loadingButtons[`deleteComment-${c._id}`]}
                        >
                          {loadingButtons[`deleteComment-${c._id}`] ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                    <span className="light-text-QUIOP">
                      commented on {new Date(c?.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="comment-body-QUIOP">
                    {isEditing ? (
                      <>
                        <textarea
                          className="desc-textarea-QUIOP"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <button
                          className="btn-secondary-QUIOP"
                          onClick={handleUpdate}
                          disabled={loadingButtons[`updateComment-${c._id}`]}
                        >
                          {loadingButtons[`updateComment-${c._id}`] ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="btn-red-QUIOP"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <p>{c?.text}</p>
                    )}
                  </div>


                </div>
              );
            })}

            {/* Add comment box */}
            <div className="comment-box-QUIOP">
              <h3>Add a comment</h3>

              <textarea
                placeholder="Write your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="comment-actions-QUIOP">

                <button
                  className="btn-secondary-QUIOP"
                  onClick={handleCloseIssue}
                  disabled={!isMine || issue?.status === "closed" || loadingButtons["closeIssue"]}
                >
                  {loadingButtons["closeIssue"] ? "Closing..." : "Close issue"}
                </button>

                <button
                  className="btn-green-QUIOP"
                  onClick={handleAddComment}
                  disabled={issue?.status === "closed" || loadingButtons["addComment"]}
                >
                  {loadingButtons["addComment"] ? "Adding..." : "Comment"}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="right-section-QUIOP">
            <SidebarItem title="Assignees" value={issue?.assignees || "No one assigned"} />
            <SidebarItem title="Labels" value={issue?.labels || "No labels"} />
            <SidebarItem title="Projects" value={issue?.projects || "No projects"} />
            <SidebarItem title="Milestone" value={issue?.milestone || "No milestone"} />
            <SidebarItem title="Relationships" value={issue?.relationships || "None yet"} />
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarItem = ({ title, value }) => (
  <div className="sidebar-item-QUIOP">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default IssueOpen;
