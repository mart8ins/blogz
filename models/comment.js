const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        // type: Schema.Types.ObjectId,
        // ref: "User",
        type: String,
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
        title: {
            type: String,
            reqired: true
        },
        id: {
            type: String,
            reqired: true
        },
        categorie: {
            type: String,
            reqired: true
        }
    }
})

module.exports = mongoose.model("Comment", commentSchema);