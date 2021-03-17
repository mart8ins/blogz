const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        unique: true,
        minLength: [3, "Username must be at least 3 characters long"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required."]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: [6, "Password must be at least 6 characters long"]
    }
})

module.exports = mongoose.model("User", userSchema)