const express = require("express");
const multer = require("multer");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

const { uploadFileToRepo , updateFile} = require("../controllers/uploadCont/upload");

// const repoRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

repoRouter.post(
  "/repo/:repoId/upload",
  upload.single("file"), // multer middleware
  uploadFileToRepo
);

repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userId", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityOfRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);

repoRouter.post("/repo/:repoId/upload", upload.single("file"), uploadFileToRepo);

repoRouter.post("/repo/:repoId/update", upload.single("file"), updateFile);
repoRouter.get("/repo/:repoId/files", repoController.getRepoFiles);
repoRouter.get("/repo/:repoId/file/content", repoController.getFileContent);
repoRouter.delete("/repo/:repoId/file/delete", repoController.deleteFileFromRepo);

repoRouter.get("/repo/starred/:userId", repoController.getStarredRepositories);

module.exports = repoRouter