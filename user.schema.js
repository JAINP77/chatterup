import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:String,
    status:String
});

export const userModel = new mongoose.model('users',userSchema);