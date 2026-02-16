const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { revertRepo } = require("./controllers/revert");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { commitRepo } = require("./controllers/commit");
const { ENV } = require("./config/env");
const { connectDB } = require("./config/db");
const mainRouter = require("./routes/main.router");

yargs(hideBin(process.argv))
    .command(
        "start", "Start the new server", {}, startServer
    )
    .command(
        "init",
        "Initialize a new repository",
        {}, initRepo
    )
    .command(
        "add <file>",
        "Add a file to the repository",
        (yargs) => {
            yargs.positional("file", {
                describe: "add file to the staging area.",
                type: "string",
            });
        }, (argv) => {
            addRepo(argv.file);
        }
    )
    .command(
        "commit <message>",
        "Commit the staged files",
        (yargs) => {
            yargs.positional("message", {
                describe: "Commit message",
                type: "string",
            });
        },
        (argv) => {
            commitRepo(argv.message);
        }
    )
    .command(
        "push",
        "Push Commits to the S3 Bucket",
        {}, pushRepo
    )
    .command(
        "pull",
        "Pull Commits from the S3 Bucket",
        {}, pullRepo
    )
    .command(
        "revert <commitId>",
        "Revert to a specific commit",
        (yargs) => {
            yargs.positional("commitId", {
                describe: "Commit Id to revert to",
                type: "string",
            });
        },
        (argv) => {
            revertRepo(argv.commitId);
        }
    )
    .demandCommand(1, "You need at least one command")
    .help().argv;


async function startServer() {
    // set up an express app
    const app = express();
    // const port = ENV.PORT || 8000;
    const port = process.env.PORT || 8000;


    app.use(bodyParser.json());
    app.use(express.json());

    connectDB();

    // cors -> what is it use here -> what is the origin -> * , Explain the use of cors
  app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173"
  ],
  credentials: true
}));


   app.use( mainRouter);

    let user = "test";

    // Doubt in it
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    })

    // Doubt in it
    io.on("connection", (socket) => {
        socket.on("joinRoom", (userId) => {
            user = userId
            console.log("++++++++--++++++++")
            console.log(user)
            console.log("++++++++--++++++++")
            socket.join(userId);
        })
    })

    const db = mongoose.connection;
    
    db.once("open", async () => {
        console.log("CRUD Operations Called");
        // CRUD Operations Called

    })

    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}  
