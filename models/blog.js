const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    categorie: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    rating: [
        {
        _id : false,
        userId: {
            type: String
        },
        rate: {
            type: Number, 
        }
    }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    comments: [
        {type: Schema.Types.ObjectId, ref: "Comment"}
    ]
})

module.exports = mongoose.model("Blog", blogSchema);