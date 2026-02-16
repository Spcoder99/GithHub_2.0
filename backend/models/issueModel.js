const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true
    }
    ,
    author: {                 // ⭐ VERY IMPORTANT
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comments: [
        {
            user: { type: Schema.Types.ObjectId, ref: "User" },
            text: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],

}, { timestamps: true })

const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue