const mongoose = require("mongoose");

const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const bcrypt = require("bcryptjs");

const { s3, S3_BUCKET } = require("../config/aws-config");



const createRepository = async (req, res) => {
  try {
    const { owner, name, description, visibility, addReadme, gitignoreTemplate } = req.body;

    // basic validation
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    if (!description)
      return res.status(400).json({ error: "Description is required" });

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid owner id" });
    }

    // ✅ create repo
    const repo = await Repository.create({
      owner,
      name,
      description: description || "",
      visibility: visibility ?? true,
      files: [],
    });

    let readmeCreated = false;
    let gitignoreCreated = false;

    // =====================================================
    // ✅ README (YOUR ORIGINAL LOGIC - UNTOUCHED)
    // =====================================================
    if (addReadme) {
      const key = `${owner}/${repo._id}/readme.md`;

      const content = `#Hello ${name}\nI Hope You Like My Web App, If You Find Something That I Can Improve Please Let Me Know. Thank You😊😊\n${description || "Project description"
        }`;

      await s3
        .putObject({
          Bucket: S3_BUCKET,
          Key: key,
          Body: content,
          ContentType: "text/markdown",
        })
        .promise();

      repo.files.push({
        name: "readme.md",
        key,
        size: content.length,
        type: "text/markdown",
        path: "",
      });

      await repo.save();
      readmeCreated = true;
    }

    // =====================================================
    // ✅ NEW → GITIGNORE (ADDED WITHOUT CHANGING ANYTHING)
    // =====================================================
    if (gitignoreTemplate) {
      let gitContent = "";

      switch (gitignoreTemplate) {
        case "Node":
          gitContent = `node_modules/
.env
dist/
npm-debug.log`;
          break;

        case "React":
          gitContent = `node_modules/
build/
.env
coverage/`;
          break;

        case "Java":
          gitContent = `target/
*.class
*.jar`;
          break;

        case "Python":
          gitContent = `__pycache__/
*.pyc
venv/
.env`;
          break;

        default:
          gitContent = "";
      }

      const key = `${owner}/${repo._id}/.gitignore`;

      await s3
        .putObject({
          Bucket: S3_BUCKET,
          Key: key,
          Body: gitContent,
          ContentType: "text/plain",
        })
        .promise();

      repo.files.push({
        name: ".gitignore",
        key,
        size: gitContent.length,
        type: "text/plain",
        path: "",
      });

      await repo.save();
      gitignoreCreated = true;
    }

    // ✅ send response
    res.status(201).json({
      success: true,
      repositoryId: repo._id,
      readmeCreated,
      gitignoreCreated,
    });
  } catch (error) {
    console.log("Create Repo Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


const getRepoFiles = async (req, res) => {
  const { repoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(repoId)) {
    return res.status(400).json({ error: "Invalid repo id" });
  }

  try {
    // Check if repo exists
    const repo = await Repository.findById(repoId);
    if (!repo) return res.status(404).json({ error: "Repo not found" });

    // List S3 objects under repo folder
    const params = {
      Bucket: S3_BUCKET,
      // Prefix: `repos/${repoId}/`, // ✅ must match createRepository
      Prefix: `${repo.owner}/${repo._id}/`, // ownerId के साथ path
    };

    const data = await s3.listObjectsV2(params).promise();

    const files = data.Contents.map((file) => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
      url: s3.getSignedUrl("getObject", {
        Bucket: S3_BUCKET,
        Key: file.Key,
        Expires: 60 * 5, // 5 minutes
      }),
    }));

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching repo files:", error);
    res.status(500).json({ error: "Server error" });
  }
};



const getFileContent = async (req, res) => {
  const { repoId } = req.params;

  if (!repoId) return res.status(400).json({ error: "Repo id is required" });

  const { key } = req.query; // file key from frontend

  // );
  try {
    const repo = await Repository.findById(repoId);
    if (!repo) return res.status(404).json({ error: "Repo not found" });

    const s3Key = `${key}`; // ✅ make sure this matches upload path


    const path = s3Key.split('/').pop();
    const fileName = path.split('/').pop(); // 'n.java.java'
    

    const data = await s3.getObject({
      Bucket: S3_BUCKET,
      Key: s3Key
    }).promise();

    res.status(200).json({ content: data.Body.toString("utf-8"), message: "File content fetched successfully", fileName });
  } catch (err) {
    console.error("Error fetching file content:", err);
    res.status(500).json({ error: "Server error" });
  }
};


const deleteFileFromRepo = async (req, res) => {
  const { repoId } = req.params;
  const { key } = req.body; // S3 file key to delete

  if (!repoId || !key) {
    return res.status(400).json({ error: "repoId and key are required" });
  }

  try {
    // 1️⃣ Find repo in DB
    const repo = await Repository.findById(repoId);
    if (!repo) return res.status(404).json({ error: "Repository not found" });

    // 2️⃣ Check if file exists in repo.files
    const fileIndex = repo.files.findIndex(f => f.key === key);
    if (fileIndex === -1) {
      return res.status(404).json({ error: "File not found in repository" });
    }

    // 3️⃣ Remove file from DB
    repo.files.splice(fileIndex, 1);
    await repo.save();

    // 4️⃣ Delete file from S3
    await s3.deleteObject({
      Bucket: S3_BUCKET,
      Key: key,
    }).promise();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getStarredRepositories = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User Id" });
    }

    const user = await User.findById(userId).populate("starRepos");

    if (!user) {
      return res.status(404).json({ repositories: [], message: "User not found" });
    }

    if (user.starRepos.length === 0) {
      return res.status(200).json({ repositories: [], message: "No starred repositories found" });
    }

    res.status(200).json({
      repositories: user.starRepos,
      message: "Starred repositories fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching starred repos:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const getAllRepositories = async (req, res) => {
  try {

    const repositories = await Repository.find({}).populate("owner").populate("issues");


    if (repositories.length === 0) {
      return res.status(404).json({ repositories: [], message: "No Repositories Found" });
    }

    res.status(200).json({ repositories, message: "Repositories Fetched Successfully" });

  } catch (error) {
    console.log("Error While Fetching Repositories", error.message);
    res.status(500).send("Internal Server Error");
  }
}

const fetchRepositoryById = async (req, res) => {

  const { id: repoID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(repoID)) {
    return res.status(400).json({ error: "Invalid Repository Id" });
  }

  try {

    const repository = await Repository.find({ _id: repoID }).populate("owner").populate("issues");


    if (repository.length === 0) {
      return res.status(404).json({ repository: [], message: "No Repository Found" });
    }

    res.status(200).json({ repository, message: "Repository Fetched Successfully" });
  }
  catch (error) {
    console.log("Error While Fetching Repository By Id", error.message);
    res.status(500).send("Internal Server Error");
  }
}

const fetchRepositoryByName = async (req, res) => {
  const { name: repoName } = req.params;

  if (!repoName) {
    return res.status(400).json({ error: "Repository Name is required" });
  }

  try {

    const repository = await Repository.find({ name: repoName }).populate("owner").populate("issues");

    if (repository.length === 0) {
      return res.status(404).json({ repository: [], message: "No Repository Found" });
    }

    res.status(200).json({ repository, message: "Repository Fetched Successfully" });
  }
  catch (error) {
    console.log("Error While Fetching Repository By Name", error.message);
    res.status(500).send("Internal Server Error");
  }
}


const fetchRepositoriesForCurrentUser = async (req, res) => {

  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid User Id" });
  }

  try {

    const repositories = await Repository.find({ owner: userId }).populate("owner").populate("issues");


    if (repositories.length === 0) {
      return res.status(404).json({ repositories: [], message: "No Repositories Found. Make First" });
    }

    res.status(200).json({ repositories, message: "Repositories Fetched Successfully" });
  }

  catch (error) {
    console.log("Error While Fetching Repository For Current User", error.message);
    res.status(500).send("Internal Server Error");
  }
}



const updateRepositoryById = async (req, res) => {
  const { id: repoID } = req.params;

  // ✅ Check if repoID is a valid Mongo ObjectId
  if (!mongoose.Types.ObjectId.isValid(repoID)) {
    return res.status(400).json({ error: "Invalid Repository Id" });
  }

  // frontend से name और description लेंगे
  const { name, description } = req.body;


  if (!name || !description) {
    return res.status(400).json({ error: "Name and Description are required" });
  }

  try {
    // ✅ Find repository by ID
    const repositoryToUpdate = await Repository.findOne({ _id: repoID });

    if (!repositoryToUpdate) {
      return res.status(404).json({ message: "No Repository Found" });
    }

    // ✅ Validation logic as per original
    if (name) repositoryToUpdate.name = name; // content की जगह name
    if (description) repositoryToUpdate.description = description;

    // ✅ Save changes
    const result = await repositoryToUpdate.save();

    res.status(200).json({
      message: "Repository Updated Successfully",
      repository: result
    });

  } catch (error) {
    console.log("Error While Updating Repository By Id", error.message);
    res.status(500).send("Internal Server Error");
  }
};


const toggleVisibilityOfRepositoryById = async (req, res) => {

  const { id: repoID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(repoID)) {
    return res.status(400).json({ error: "Invalid Repository Id" });
  }

  try {
    const repositoryToUpdate = await Repository.findOne({ _id: repoID });

    if (!repositoryToUpdate) {
      return res.status(404).json({  message: "No Repository Found" });
    }

    repositoryToUpdate.visibility = !repositoryToUpdate.visibility;

    const result = await repositoryToUpdate.save();

    res.status(200).json({ message: "Repository toggled Successfully", repository: result });

  } catch (error) {
    console.log("Error While  toggling Repository Visibility By Id", error.message);
    res.status(500).send("Internal Server Error");
  }
}




const deleteRepositoryById = async (req, res) => {
  const { id: repoID } = req.params;
  const { password, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(repoID)) {
    return res.status(400).json({ error: "Invalid Repository Id" });
  }

  if (!password || !userId) {
    return res.status(400).json({ error: "Password and User Id are required" });
  }

  try {
    const repository = await Repository.findById(repoID).populate("owner");

    if (!repository) {
      return res.status(404).json({ message: "No Repository Found" });
    }

    // ✅ Owner check
    if (repository.owner._id.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // ✅ Get user with password
    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // ===============================
    // 🔥 DELETE FILES FROM S3
    // ===============================
    if (repository.files && repository.files.length > 0) {
      const deleteParams = {
        Bucket: S3_BUCKET,
        Delete: {
          Objects: repository.files.map(file => ({ Key: file.key }))
        }
      };

      await s3.deleteObjects(deleteParams).promise();
    }

    // ===============================
    // 🔥 DELETE ALL ISSUES OF THIS REPOSITORY
    // ===============================
    await Issue.deleteMany({ repository: repoID });

    // ===============================
    // 🔥 DELETE REPOSITORY FROM DB
    // ===============================
    await repository.deleteOne();

    res.status(200).json({
      message: "Repository, Files & Issues Deleted Successfully"
    });

  } catch (error) {
    console.log("Delete Repo Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityOfRepositoryById,
  deleteRepositoryById,
  getRepoFiles,
  getFileContent,
  deleteFileFromRepo,
  getStarredRepositories

}



