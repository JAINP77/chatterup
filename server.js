import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import { connectToMongoose } from './config.js';
import { chatModel } from './chat.schema.js';
import { userModel } from './user.schema.js';

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['*']
    }
})

io.on('connection',(socket)=>{
    console.log('connection is established');

    socket.on('join',async(user)=>{
        socket.username = user;
        console.log(`${socket.username || 'anonymous'} is joined`);
        try {
            const newUser = new userModel({
                username:user,
                status:'active'
            })
            await newUser.save();
            const users = await userModel.find({status:'active'}).limit(50);
            const usernames = users.map(u => u.username);
            io.emit('broadcast_user', usernames);

            await chatModel.find({}).sort({timestamp:1}).limit(50)
            .then((messages)=>{
                socket.emit('old_messages',messages);
            })
            .catch((err)=>{
                console.log(err);            
            })
            socket.broadcast.emit('notify_users', `${user} has joined the chat`);
        } catch (error) {
            console.log(error);            
        }
    })

    socket.on('new_message',(message)=>{
        let userMessage = {
            username:socket.username,
            message:message,
            timestamp:new Date().toLocaleTimeString(),
            profilePicture:'https://media1.thehungryjpeg.com/thumbs2/ori_3677422_7yqyaegyy913s21kj9b50h6m2cy996ze9924hcln_ninja-esport-mascot-logo-design.png'
        };
        const newChat = chatModel({
            username:socket.username,
            message:message,
            timestamp:new Date().toLocaleTimeString(),
            profilePicture:'https://media1.thehungryjpeg.com/thumbs2/ori_3677422_7yqyaegyy913s21kj9b50h6m2cy996ze9924hcln_ninja-esport-mascot-logo-design.png'
        });

        newChat.save();
        socket.broadcast.emit('broadcast_message',userMessage);
    })

    socket.on('typing',(user)=>{
        socket.broadcast.emit('broadcast_typing',user);
    })

    socket.on('disconnect',async()=>{
        console.log(`${socket.username || 'anonymous'} is disconnected`);
        try {
            await userModel.deleteMany({username:socket.username});
            const users = await userModel.find({status:'active'}).limit(50);
            const usernames = users.map(u => u.username);
            io.emit('broadcast_user', usernames);
        } catch (error) {
            console.log(error);
        }
    })
    
})



server.listen(1500,()=>{
    console.log('port running at 1500');
    connectToMongoose();    
})