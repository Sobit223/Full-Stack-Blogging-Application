import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        lowercase:true,
        require:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    userposts: []
}, {timestamps:true})


export const User = mongoose.model('User', userSchema)