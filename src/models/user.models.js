import mongoose from "mongoose";
import mongooose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudinary url
        required:true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:[true,'Password ia Required']
    },
    refreshTocken:{
        type:String,
    }
},{timestamps:true})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password){
   await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessTocken=function(){
   return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOCKEN_SECRET,
    {
        expiresIn:process.env.process.ACCESS_TOCKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshTocken=function(){
    return jwt.sign({
        _id:this._id,
        
    },
    process.env.REFRESH_TOCKEN_SECRET,
    {
        expiresIn:process.env.process.REFRESH_TOCKEN_EXPIRY
    })
}
export const User= mongoose.model("User",userSchema)