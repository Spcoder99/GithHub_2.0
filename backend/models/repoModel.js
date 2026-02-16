const mongoose = require("mongoose");
const { Schema } = mongoose;

const RepositorySchema = new Schema({

  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  files: [
    {
      name: { type: String, required: true },   // file name
      key: { type: String, required: true },    // S3 key including folders
      size: { type: Number, required: true },
      type: { type: String, required: true },
      path: { type: String, default: "" },      // relative folder path
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  visibility: Boolean,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue"
    }
  ]
},  { timestamps: true } );

const Repository = mongoose.model("Repository", RepositorySchema);
module.exports = Repository;
