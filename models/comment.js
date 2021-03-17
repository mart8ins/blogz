const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: [true, "Comment is required if you whant to comment."]
    },
    date: {
        type: String,
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        reqired: true
    }
})

module.exports = mongoose.model("Comment", commentSchema);