const mongoose = require("mongoose");
const Repository = require("../../models/repoModel");
const { s3, S3_BUCKET } = require("../../config/aws-config");


const uploadFileToRepo = async (req, res) => {
  try {


    const { repoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(repoId)) {
      return res.status(400).json({ error: "Invalid repo id" });
    }


    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    if (!file.originalname || !file.originalname.trim()) {
      return res.status(400).json({ error: "File name is required" });
    }


    const repo = await Repository.findById(repoId);
    if (!repo) return res.status(404).json({ error: "Repository not found" });
    const cleanName = file.originalname.split("/").pop();
    const exists = repo.files.some(f => f.name === cleanName);

    // Check if file already exists
    // const exists = repo.files.some(f => f.name === file.originalname);
    if (exists) {
      return res.status(400).json({ error: "File already exists" });
    }

    const key = `${repo.owner.toString()}/${repo._id.toString()}/${file.originalname}`;

    await s3.putObject({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }).promise();

    const fileMetadata = {
      name: file.originalname.split("/").pop(),
      key,
      size: file.size,
      type: file.mimetype,
      path: file.originalname.includes("/") ? file.originalname.replace(/\/[^/]+$/, "") : "",
    };

    try {
      repo.files.push(fileMetadata);
      await repo.save();
    } catch (err) {
      await s3.deleteObject({ Bucket: S3_BUCKET, Key: key }).promise();
      throw err;
    }

    res.status(200).json({ message: "File created successfully", fileName: file.originalname });
  } catch (error) {
    console.error("Create file error:", error);
    res.status(500).json({ error: error.message });
  }
};



const updateFile = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { oldKey, newFileName } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });


    if (!file.originalname || !file.originalname.trim()) {
      return res.status(400).json({ error: "File name is required" });
    }

    if (!oldKey) return res.status(400).json({ error: "oldKey missing" });

    const repo = await Repository.findById(repoId);
    if (!repo) return res.status(404).json({ error: "Repository not found" });

    // find file
    const existingFileIndex = repo.files.findIndex(f => f.key === oldKey);
    if (existingFileIndex === -1) {
      return res.status(404).json({ error: "File does not exist" });
    }

    const existingFile = repo.files[existingFileIndex];

    if (newFileName === existingFile.name && !file) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    if (newFileName && !newFileName.trim()) {
      return res.status(400).json({ error: "Invalid file name" });
    }


    let key = existingFile.key;

    // rename case
    if (newFileName && newFileName !== existingFile.name) {
      const duplicate = repo.files.find(f => f.name === newFileName);
      if (duplicate) {
        return res.status(400).json({ error: "File with this name already exists" });
      }

      const pathPrefix = existingFile.key.replace(/\/[^/]+$/, "");
      key = `${pathPrefix}/${newFileName}`;

      // upload new
      await s3.putObject({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();

      // delete old
      await s3.deleteObject({
        Bucket: S3_BUCKET,
        Key: existingFile.key,
      }).promise();

      existingFile.name = newFileName;
      existingFile.key = key;
    }
    else {
      // only content update
      await s3.putObject({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();
    }

    existingFile.size = file.size;
    existingFile.type = file.mimetype;
    existingFile.updatedAt = new Date();

    repo.files[existingFileIndex] = existingFile;
    await repo.save();

    res.status(200).json({
      message: "File updated successfully",
      fileName: existingFile.name,
      fileKey: key,
    });

  } catch (error) {
    console.error("Update file error:", error);
    res.status(500).json({ error: error.message });
  }
};





module.exports = { uploadFileToRepo, updateFile };
