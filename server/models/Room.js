const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const roomSchema = new Schema({
    roomName:{
        type:String,
        required:true
    },
    roomId:{
        type:String,
        required:true
    },
    roomOwner:{
        type:String,
        required:true
    }
},{timestamps:true})

const roomModel = mongoose.model("Room",roomSchema);

module.exports = roomModel