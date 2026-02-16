import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import TerminalLoader from "../Loader/TerminalLoader";
import "./editissue.css";

const EditIssue = () => {
  const { issueId } = useParams();
  const userId = localStorage.getItem("userId");

  const [issue, setIssue] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);

  // For editing comments
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchIssue();
  }, [issueId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/userProfile/${userId}`);
        setUser(res?.data?.user);
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.error || "Failed to fetch user");
      }
    };
    fetchUser();
  }, [userId]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/issue/${issueId}`);
      const data = res?.data?.issue;
      setIssue(data);
      setTitle(data?.title);
      setDescription(data?.description);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to fetch issue");
    } finally {
      // setLoading(false);
      setTimeout(() => setLoading(false), 600);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/issue/update/${issueId}`,
        { title, description, status: issue.status },
        { headers: { userid: userId } }
      );

      setIssue(res?.data?.issue);
      toast.success( res?.data?.message || "Issue updated successfully");
      navigate(-1);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to update issue");
    }
  };

  const handleCloseIssue = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/issue/close/${issueId}`,
        {},
        { headers: { userid: userId } }
      );

      setIssue(res?.data?.issue);
      toast.success( res?.data?.message ||"Issue closed successfully");
      navigate("/issues");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to close issue");
      console.log(err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/issue/comment/${issueId}`,
        { text: comment },
        { headers: { userid: userId } }
      );

      setIssue(res?.data?.issue);
      setComment("");
    toast.success( res?.data?.message ||"Comment added successfully");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to add comment");
    }
  };

  // ✅ Update a comment
  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/issue/${issueId}/comment/${commentId}`,
        { text: editText },
        { headers: { userid: userId } }
      );
      setIssue(res?.data?.issue);
      setEditingCommentId(null);
      setEditText("");
      toast.success( res?.data?.message ||"Updated comment successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to update comment");
    }
  };

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


  // ✅ Delete a comment
  const handleDeleteComment = async (commentId) => {
   const ok = await confirmDelete();

    if (!ok) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/issue/${issueId}/comment/${commentId}`,
        { headers: { userid: userId } }
      );
      setIssue(res?.data?.issue);
      toast.success( res?.data?.message ||"Deleted comment successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to delete comment");
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (!issue) return <div>Not found</div>;
  
  const isMine = issue?.author?._id?.toString() === userId;

  return (
    <>
      {loading && <TerminalLoader />}
      <div className="issue-wrapper-IPHONE">
        <div className="top-tabs-IPHONE">
          <span>Code</span>
          <span className="active-IPHONE">
            Issues <span className="count-IPHONE">1</span>
          </span>
          <span className="MADARCHOD">Pull requests</span>
          <span className="MADARCHOD">Agents</span>
          <span className="MADARCHOD">Actions</span>
          <span className="MADARCHOD">Projects</span>
          <span className="MADARCHOD">Security</span>
          <span>Insights</span>
        </div>

        <div className="issue-title-row-IPHONE">
          <input
            className="title-input-IPHONE"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isMine}
          />
          <div className="div-IPHONE">
            <button onClick={handleUpdate} className="btn-green-IPHONE">
              Save
            </button>
            <button onClick={handleClose} className="btn-secondary-IPHONE">
              Cancel
            </button>
          </div>
        </div>

        <div className="status-row-IPHONE">
          <div className="open-badge-IPHONE">
            <CheckCircle size={16} />
            {issue?.status}
          </div>
        </div>

        <div className="issue-content-IPHONE">
          <div className="left-section-IPHONE">
            {/* Issue description */}
            <div className="comment-card-IPHONE">
              <div className="comment-header-IPHONE">
                <strong>{issue.authorName || "Unknown"}</strong>
                <span className="light-text-IPHONE">
                  opened on {new Date(issue?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="comment-body-IPHONE">
                <textarea
                  className="desc-textarea-IPHONE"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isMine}
                />
              </div>
            </div>

            {/* Comments */}
            {issue?.comments?.map((c) => {
              const isMyComment = c?.user === userId;
              const isEditing = editingCommentId === c?._id;

              return (
                <div key={c?._id} className="comment-card-IPHONE">
                  <div className="comment-header-IPHONE">
                    <div className="comment-user-IPHONE">
                      <div className="avatar-IPHONE">{(c?.userName || "U")[0]}</div>
                      <strong>{c?.userName || user?.username || "User"}</strong>
                    </div>

                    {isMyComment && !isEditing && (
                      <div className="POPOPOPUIOIPOIOIO" style={{ marginTop: "5px" }}>
                        <button
                          className="btn-secondary-IPHONE"
                          onClick={() => {
                            setEditingCommentId(c?._id);
                            setEditText(c?.text);
                          }}
                          style={{ marginRight: "5px" }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-red-IPHONE"
                          onClick={() => handleDeleteComment(c?._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    <span className="light-text-IPHONE">
                      commented on {new Date(c?.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="comment-body-IPHONE">
                    {isEditing ? (
                      <>
                        <textarea
                        className="desc-textarea-IPHONE"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <button
                          className="btn-secondary-IPHONE"
                          onClick={() => handleUpdateComment(c?._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-red-IPHONE"
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
            <div className="comment-box-IPHONE">
              <h3>Add a comment</h3>
              <textarea
                placeholder="Write your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="comment-actions-IPHONE">
                <button
                  className="btn-secondary-IPHONE"
                  onClick={handleCloseIssue}
                  disabled={!isMine || issue?.status === "closed"}
                >
                  Close issue
                </button>

                <button
                  className="btn-green-IPHONE"
                  onClick={handleAddComment}
                  disabled={issue?.status === "closed"}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="right-section-IPHONE">
            <SidebarItem
              title="Assignees"
              value={issue.assignees || "No one assigned"}
            />
            <SidebarItem title="Labels" value={issue.labels || "No labels"} />
            <SidebarItem
              title="Projects"
              value={issue.projects || "No projects"}
            />
            <SidebarItem
              title="Milestone"
              value={issue.milestone || "No milestone"}
            />
            <SidebarItem
              title="Relationships"
              value={issue.relationships || "None yet"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarItem = ({ title, value }) => (
  <div className="sidebar-item-IPHONE">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default EditIssue;
