// require('dotenv').config({path:'./env'})

import connectDB from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({path:'./env'})

connectDB()

/*
import mongoose from "mongoose";
import {DB_NAME} from "./constants";
import express from "express"
const app=express()
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Err: ",error)
            throw error
        })
        app.listen(procee.env.PORT,()=>{
            console.log(`App is listning on ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ",error)
        throw err
    }
})()
    */