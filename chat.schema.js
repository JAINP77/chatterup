import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    timestamp:{
        type:String,
        default:Date.now
    },
    profilePicture:{
        type:String,
        default:null
    }
})

export const chatModel = new mongoose.model('chats',chatSchema);