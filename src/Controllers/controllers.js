import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"

const options = {
    httpOnly:true
}

const verifyJWT = async(req, res,next)=> {
    const accesstoken = req.cookies?.accesstoken
    if(!accesstoken){
        return res.status(301).json({message:"Invalid User"})
    }

    try {
        const userAccessToken = jwt.verify(accesstoken, process.env.SECRETACCESSTOKEN)
        if(userAccessToken){
            const usernametrimmed = userAccessToken.username.toLowerCase().trim()
            const user = await User.findOne({username:usernametrimmed})
            req.user = user
            return next()
        }
    } catch (error) {
        return res.status(301).json("Please Login Again, You session has expired")
    }
}

const generateTokens = (payload)=> {
    const accesstoken = jwt.sign(payload, process.env.SECRETACCESSTOKEN, {expiresIn:'5m'})
    return {accesstoken}
}

const registerUser = async(req, res)=> {
    const {username, password} = req.body
    console.log(username)

    if(!username || !password){
        return res.status(401).json({
            message:"All fields should be Filled"
        })
    }
    const {accesstoken} = generateTokens({username})
    const newUser = new User({username, password})

    try {
        await newUser.save()
    } catch (error) {
        if(error.errorResponse?.keyPattern?.username){
            return res.status(401).json({
                message:"Duplicate Username",
                Details:"User with the same Username already exists"
            })
        }
        else{
            return res.status(401).json({
                message:"Error while Registering",
                error:error
            })
        }
    }

    res.cookie('accesstoken', accesstoken, options)

    return res.status(200).json({
        message:"You are Successfully Registered.",
        username:username
    })   
}

const userLogin = async(req, res)=> {
    const {username,password} = req.body
    if(!username || !password){
        return res.status(301).json({
            message:"All fields should be filled"
        })
    }

    const user = await User.findOne({username:username.toLowerCase().trim()})
    if(!user){
        return res.status(401).json({"message":"UnAuthorizedUser"})
    }

    if(user.password === password){
        const {accesstoken} = generateTokens({username})
        res.cookie("accesstoken", accesstoken)
        return res.status(202).json({
            message:"You are SuccessFully Logged In"
        })
    }
    else{
        res.status(401).json("Invalid Password")
    }
}

const blogPost = async(req, res)=> {
    const {title, description} = req.body
    if(!title || !description){
        return res.status(301).json({message:"Please fill all the Fields"})
    }

    const user = await User.findById(req.user._id)
    user.userposts.push({title,description})
    await user.save()
    return res.status(200).json({"message":"SuccessFully Uploaded"})
}

const getuserblogs = async(req, res)=> {
    return res.status(200).json({username:req.user.username, blogs:req.user.userposts})
}

const getallPost = async (req, res) => {
    try {
        const allData = await User.find({}, { userposts: 1,username:1, _id: 0 })
        return res.status(200).json({message:"Data fetched Successfully", Data: allData})
        
    } catch (error) {
        res.status(401).json({message:"Something went wrong"})
    }
  };
  
export 
{   getallPost,
    registerUser,
    verifyJWT,
    userLogin,
    blogPost,
    getuserblogs
}