const mongoose = require("mongoose");
const Issue = require("../models/issueModel");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");


const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const author = req.headers.userid;
  const { id: repoID } = req.params;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and Description are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(repoID)) {
    return res.status(400).json({ error: "Invalid Repository Id" });
  }

  try {
    const repository = await Repository.findById(repoID);
    if (!repository) return res.status(404).json({ error: "Repository not found" });

    // 🔒 NEW VALIDATION ADDED
const existingIssue = await Issue.findOne({
  title: title.trim(),
  author: author
});

if (existingIssue) {
  return res.status(400).json({
    error: "You have already created an issue with this title"
  });
}
    
    const issue = new Issue({
      title,
      description,
      repository: repoID,
      author,
      status: "open"
    });

    await issue.save();

    repository.issues.push(issue._id);
    await repository.save();

    // ✅ Correct populate
    await issue.populate(["repository", "author"]);

    res.status(201).json({
      message: "Issue Created Successfully",
      issue
    });
  } catch (error) {
    console.error("Error while creating issue:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getIssuesCreatedByUser = async (req, res) => {
  // \
   const userId = req.headers.userid;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const issues = await Issue.find({ author: userId })
      .populate("repository")
      .populate("author")      
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    console.log("Error fetching issues:", error.message);
    res.status(500).send("Internal Server Error");
  }

};



// const updateIssueById = async (req, res) => {
//   const { id: issueID } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(issueID)) {
//     return res.status(400).json({ error: "Invalid Issue Id" });
//   }

//   const { title, description, status } = req.body;


//   if (!title || !description || !status) {
//     return res.status(400).json({ error: "Title, Description and Status is required" });
//   }

//   try {
//     const issue = await Issue.findById({ _id: issueID });

//     if (!issue) {
//       return res.status(404).json({ error: "Issue not found" });
//     }

//     issue.title = title;
//     issue.description = description;
//     issue.status = status;

//     await issue.save();
//     res.status(200).json({ message: "Issue Updated Successfully", issue: issue });
//   } catch (error) {
//     console.log("Error While Updating Issue", error.message);
//     res.status(500).send("Internal Server Error");
//   }
// }

const updateIssueById = async (req, res) => {
  const { id: issueID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(issueID)) {
    return res.status(400).json({ error: "Invalid Issue Id" });
  }

  const { title, description, status } = req.body;

  if (!title || !description || !status) {
    return res.status(400).json({ error: "Title, Description and Status is required" });
  }

  try {
    // Update issue in Issue collection
    const issue = await Issue.findById(issueID);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();

    // Populate repository and author before sending response
    await issue.populate("repository");
    await issue.populate("author");

    // No need to update Repository.issues array, since it's just ObjectIds
    // Fetching repository with populate will always give the latest issue data

    res.status(200).json({ message: "Issue Updated Successfully", issue });
  } catch (error) {
    console.log("Error While Updating Issue", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// const deleteIssueById = async (req, res) => {
//   const { id: issueID } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(issueID)) {
//     return res.status(400).json({ error: "Invalid Issue Id" });
//   }

//   try {
//     const issue = await Issue.findByIdAndDelete(issueID);

//     if (!issue) {
//       return res.status(404).json({ error: "Issue not found" });
//     }

//     res.status(200).json({ message: "Issue Deleted Successfully" });
//   } catch (error) {
//     console.log("Error While Deleting Issue", error.message);
//     res.status(500).send("Internal Server Error");
//   }
// }

const deleteIssueById = async (req, res) => {
  const { id: issueID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(issueID)) {
    return res.status(400).json({ error: "Invalid Issue Id" });
  }

  try {
    const issue = await Issue.findByIdAndDelete(issueID);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Remove issue from repository.issues array
    await Repository.findByIdAndUpdate(issue.repository, {
      $pull: { issues: issue._id },
    });

    res.status(200).json({ message: "Issue Deleted Successfully" });
  } catch (error) {
    console.log("Error While Deleting Issue", error.message);
    res.status(500).send("Internal Server Error");
  }
};


const getAllIssues = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Repository Id" });
  }

  try {
    const issues = await Issue.find({ repository: id }).populate("repository").populate("author");

    if (issues.length === 0) {
      return res.status(404).json({ message: "No Issues Found" });
    }

    res.status(200).json(issues);

  } catch (error) {
    console.log("Error While Fetching Issues", error);
    res.status(500).send("Internal Server Error");
  }
}


const getIssuesByRepository = async (req, res) => {
  const { repoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(repoId)) {
    return res.status(400).json({ error: "Invalid Repository Id" });
  }

  try {
    const issues = await Issue.find({ repository: repoId })
      .populate("repository")
      .populate("author")
      .sort({ createdAt: -1 });

    // Return empty array if no issues found
    return res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues for repo:", error.message);
    res.status(500).send("Internal Server Error");
  }
};


const closeIssue = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid issue id" });
  }

  try {
    const issue = await Issue.findById(id);

    if (!issue) return res.status(404).json({ error: "Issue not found" });

    issue.status = "closed";
    await issue.save();

    await issue.populate("repository");
    await issue.populate("author");

    res.status(200).json({ message: "Issue closed", issue });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.headers.userid;

  if (!text) return res.status(400).json({ error: "Comment required" });

  try {
    const issue = await Issue.findById(id).populate("repository").populate("author");
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    issue.comments.push({
      user: userId,
      text,
    });

    await issue.save();

    res.status(200).json({ message: "Comment added", issue });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};



const getIssueById = async (req, res) => {
  const { id: issueID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(issueID)) {
    return res.status(400).json({ error: "Invalid Issue Id" });
  }



  try {
    const issue = await Issue.findById({ _id: issueID }).populate("repository").populate("author");

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(200).json({ message: "Issue Fetched Successfully!!", issue: issue });
  } catch (error) {
    console.log("Error While Fetching Issue", error.message);
    res.status(500).send("Internal Server Error");
  }
}

// Update a comment
const updateComment = async (req, res) => {
  const { issueId, commentId } = req.params;
  const { text } = req.body;
  const userId = req.headers.userid;

  if (!text) return res.status(400).json({ error: "Comment text required" });

  try {
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    // Find the comment
    const comment = issue.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Only allow author to update
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: "You can only update your own comments" });
    }

    comment.text = text;
    comment.updatedAt = new Date();

    await issue.save();

    // Populate repository and author before sending
    await issue.populate(["repository", "author"]);

    res.status(200).json({ message: "Comment updated", issue });
  } catch (err) {
    console.error("Error updating comment:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { issueId, commentId } = req.params;
  const userId = req.headers.userid;

  try {
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    const comment = issue.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Only allow author to delete
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own comments" });
    }

    // ✅ Proper way to remove a subdocument
    
    // ✅ Replace with:
    issue.comments.pull(commentId); 

    await issue.save();

    await issue.populate(["repository", "author"]);

    res.status(200).json({ message: "Comment deleted", issue });
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
  getIssuesCreatedByUser,
  getIssuesByRepository,
  closeIssue,
  addComment,
  updateComment,
  deleteComment
}


