const {createServer} = require("http");
const {genRoomId} = require('./myutils');
//const fs = require("fs");
const express = require("express");
//const cors = require("cors");
const mongoose = require("mongoose");

const Room = require('./models/Room')
require("dotenv").config();

const socket = require("socket.io");
const genRoomID = require("./myutils");
const users = [];
const rooms = [];


const app = express();

const httpServer = createServer(app);

const io = socket(httpServer,{
    cors:{
        origin:["http://localhost:3000","https://glowing-kashata-ddb2c9.netlify.app"],
        methods:["GET","POST"]
    }
});
let count =0;

const uri = process.env.ATLAS_URI
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true})
.catch((err)=>{
    console.log("Connection database error",err);
})

mongoose.connection.once('open',()=>{
    console.log("database connected");
}).on('error',(error)=>{
    console.log('error connecting to database',error);
})

io.on("connection",(socket)=>{
    count++;
    console.log(socket.id,"connected",count);
    users.push(socket);

    io.emit('server',{message:`${count} connected in server`});
//Messages
    socket.on('globalMessage',(msg)=>{
        socket.broadcast.emit('globalMessage',msg);
        console.log(msg)
    })
//Room server messages
    socket.on('roomMessage',msgInfo=>{
        io.sockets.in(msgInfo.roomId).emit('roomsg',{message:msgInfo.message})
    })    
//Gen Room
    socket.on("createRoom",(data)=>{
        const id = genRoomID();
        const roomInfo = {...data,ID:id};
        const room = new Room({
            roomName:data.Name,
            roomId:id,
            roomOwner:((socket.id==data.Owner)?data.Owner:null)
        })
        room.save().then(()=>{
            console.log("room saved in database");
        }).catch((err)=>{
            console.log(err);
        })
        rooms.push(roomInfo);
        console.log(rooms);
        socket.join(id);
        io.sockets.in(id).emit(`${id}msg`,{message:`${socket.id} joined room ${id}`});
        console.log(socket.rooms)
        socket.emit("roomJoined",{roomName:roomInfo.Name,roomId:roomInfo.ID,roomOwner:socket.id});
    })  
    var currId;
    socket.on("joinRoom",id=>{
        if(!id) return;
        Room.find({"roomId":id}).
        then((roomdata)=>{
            if(roomdata){
                console.log(roomdata);
                currId = id;
                socket.join(id);
                socket.emit('roomJoined',roomdata[0]);
                io.sockets.in(id).emit(`${id}RoomMsg`,{message:`${socket.id} joined room ${id}`});
                console.log(`joined room ${id}`);
            }
            else{
                console.log("room does'nt exist")
            }
        }).catch(err=>console.log(err))
        
    })

    //Leave room
    socket.on('leaveRoom',(room)=>{
        socket.leave(room);
        console.log('leaved room',room);
    })

//Messages are handled here
    socket.on('message',(msg)=>{
        socket.to(`${msg.to}`).emit(`${msg.to}`,msg);
        console.log(msg);
    })

    socket.on("disconnect",()=>{
        count--;
        users.pop(socket);
        console.log(socket.id,"disconnected");
        io.emit('server',{message:`${count} connected`});
    })
})

app.get('/',(req,res)=>{
    res.send("Hello there i am in port 5000");
})



httpServer.listen(process.env.PORT || 5000,()=>{
    console.log("server started on port",5000)
})