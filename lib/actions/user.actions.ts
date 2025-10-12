"use server"

import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";

export const getAllUsersForNewsEmail = async()=>{

    try{
       const mongoose = await connectToDatabase();
       const db = mongoose.connection.db;
       if(!db) throw new Error("No database connection");

       const users = await db.collection("users").find(
        {email: {$exists: true}, $ne:null},
        {projection: { _id:1, id:1, email:1, name:1, country:1}}

       ).toArray();

       return users.filter((user)=>user.email && user.name).map((user)=>({
        id: user.id || user._id?.toString(),
        name: user.name,
        email: user.email,
        country: user.country,
       }))
    }
    catch(e){
            console.log("Error in fetcing users", (e));
    }
}