 const express = require("express");
 const userRouter = require("./user.router");
 const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router");
const passwordRouter = require("./password.router");

 const mainRouter = express.Router();

 mainRouter.use(userRouter)
 mainRouter.use(repoRouter)
 mainRouter.use(issueRouter);
 mainRouter.use(passwordRouter);

 mainRouter.get("/", (req, res) => {
     res.send("Namaste");
 })



 module.exports = mainRouter