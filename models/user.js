const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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

userSchema.statics.validUser = async function(username, password){
    if(username && password){
        // if both inputs exists then check if username exists in db
        let usernameTaken = await this.findOne({username: username});
        // if username exists - compare passwords
        if(usernameTaken) {
            const passwordMatch = await bcrypt.compare(password, usernameTaken.password);
            if(passwordMatch){
                return usernameTaken
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

module.exports = mongoose.model("User", userSchema)