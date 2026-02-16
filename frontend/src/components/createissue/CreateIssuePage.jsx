import axios from "axios";
import {
  ArrowLeft,
  AtSign,
  Bold,
  CornerUpLeft,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  MessageSquare,
  Smile,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import "./createIssue.css";

export default function CreateIssuePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const location = useLocation();
  const repo = location.state?.repo;

  const navigate = useNavigate();


  if (!repo) {
    return <div style={{margin: "35px", marginTop: "100px"}}>No Repositories Found. Please Make Repository First</div>;
  }


  const handleCreateIssue = async () => {

    try {
      if (!repo?._id) {
        toast.error("Repository data missing");
        return;
      }
      if (!title || !description) {
        toast.error("Title and Description is required");
        return;
      }

      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User ID not found in localStorage");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/issue/create/${repo?._id}`,
        { title, description },
        {
          headers: {
            userid: userId,
          },
        },
      );

      // toast.success("Issue created successfully 🚀");
      toast.success(res?.data?.message || "Issue created successfully 🚀");
      navigate("/issues");
    } catch (error) {
      console.log(error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Error creating issue";

      toast.error(message)
    }

  };

  // Back button (ArrowLeft)
const handleGoBack = () => {
  navigate(-1); // goes back to previous page
};

// Close button (X)
const handleClose = () => {
  navigate("/"); // or any route you want to go when closing
};


  return (
    <>
      {/* <Navbar /> */}
      <div className="issue-wrapper">
        {/* Header */}
        <div className="issue-top">
          <div className="left">
            <ArrowLeft onClick={handleGoBack} size={20} className="top-icon" />
            <span className="LOPA-MUDRA">
              Create new issue in {repo?.owner?.username}/{repo?.name}
            </span>
          </div>
          <X onClick={handleClose} size={20} className="top-icon" />
        </div>

        <div className="issue-body">
          {/* Title */}
          <div className="field">
            <label>
              Add a title <span>*</span>
            </label>
            <input
              className="title-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="field">
            <label>Add a description</label>

            <div className="editor">
              {/* tabs */}
              <div className="tabs">
                <div className="tab active">Write</div>
                <div className="tab">Preview</div>
              </div>

              {/* toolbar */}
              <div className="toolbar">
                <Bold size={16} />
                <Italic size={16} />
                <LinkIcon size={16} />
                <List size={16} />
                <ListOrdered size={16} />
                <AtSign size={16} />
                <MessageSquare size={16} />
                <CornerUpLeft size={16} />
                <Smile size={16} />
              </div>

              {/* textarea */}

              <textarea
                placeholder="Type your description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="file-hint">
              📎 Paste, drop, or click to add files
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="issue-footer">
          <label className="create-more">
            <input type="checkbox" />
            Create more
          </label>

          <div className="actions">
            <button className="cancel" onClick={handleClose}>Cancel</button>
            <button className="create" onClick={handleCreateIssue}>
              Create
            </button>
          </div>
        </div>
      </div>
      {/* <GithubFooter /> */}
    </>
  );
}
