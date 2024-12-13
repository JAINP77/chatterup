import mongoose from "mongoose";

export const connectToMongoose = async()=>{
    await mongoose.connect('mongodb+srv://abhiprince:IzHkcfxjZch7ysnV@chatterup.bwxdz.mongodb.net/chatterup?retryWrites=true&w=majority&appName=ChatterUp');
    console.log('mongodb connected using mongoose');    
}