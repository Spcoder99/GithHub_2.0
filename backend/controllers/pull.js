const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

// Doubt In This, how it is working and i will understand it tomorrow afternoon :)
async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".Git-Replica");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const data = await s3.listObjectsV2({ Bucket: S3_BUCKET, Prefix: "commits/" }).promise();

        const objects = data.Contents;

        for(const object of objects) {
            const Key = object.Key
           
            const commitDir = path.join(commitsPath, path.dirname(Key).split("/").pop());
            
            await fs.mkdir(commitDir, {recursive: true})
            const params = {
                Bucket: S3_BUCKET,
                Key: Key,
            }

            const fileContent = await s3.getObject(params).promise();
            await fs.writeFile(path.join(repoPath, Key), fileContent.Body);
             
            
        }
        console.log("All commits pulled from S3!!");
    } catch (error) {
        console.error("Unable to pull from S3: ", error);
    }
}

module.exports = { pullRepo };