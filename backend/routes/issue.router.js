const express = require("express");
const issueController = require("../controllers/issueController")

const issueRouter = express.Router();

issueRouter.post("/issue/create/:id", issueController.createIssue);

issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);

issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.get('/issue/:id', issueController.getIssueById)
issueRouter.get("/issues/me", issueController.getIssuesCreatedByUser);

issueRouter.get("/issues/repo/:repoId", issueController.getIssuesByRepository);

issueRouter.put("/issue/close/:id", issueController.closeIssue);
issueRouter.post("/issue/comment/:id", issueController.addComment);

// issueRouter.put("/issue/:issueId/comment/:commentId", Headers: { userid }
// Body: { text: "Updated comment" }, issueController.updateComment);


issueRouter.put("/issue/:issueId/comment/:commentId", issueController.updateComment);

// Delete comment
issueRouter.delete("/issue/:issueId/comment/:commentId", issueController.deleteComment);

module.exports = issueRouter;