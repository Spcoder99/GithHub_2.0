const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { formatDateWithAt } = require("../extrafxn/formatDateWithAt");

async function commitRepo(message) {
    const repoPath = path.resolve(process.cwd(), ".Git-Replica");
    const stagingPath = path.join(repoPath, "staging");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitId = uuidv4();
        const commitDir = path.join(commitsPath, commitId);
        await fs.mkdir(commitDir, { recursive: true });
        const files = await fs.readdir(stagingPath);

        for (const file of files) {
            await fs.copyFile(path.join(stagingPath, file), path.join(commitDir, file));
        }

        await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify({
            message, date: formatDateWithAt(new Date().toISOString()
            )
        }));

        console.log(`Commit with ID: ${commitId} created with message: ${message}!`);

    } catch (error) {
        console.error("Error commiting files: ", error);
    }
}

module.exports = { commitRepo };