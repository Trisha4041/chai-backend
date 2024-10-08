import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse} from "../utils/ApiResponse.js";
const registerUser=asyncHandler(async (req,res)=>{
    const {fullName,email,username,password}=req.body
    console.log("email: ",email);
    if ([fullName,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"Full name is required")
    }
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username exist")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    //const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is require");
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if(!avatar){
        throw new ApiError(400,"Avatar file is require");
    }
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshTocken" 
    )
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

})
export {registerUser}