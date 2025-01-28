import mongoose, { Types } from "mongoose"

const userSchema = new mongoose.Schema(
    {
        Name:{
            Types:String,
            required: true,

        },
        userName:{
            type: String,
            required: true,
            unique: true,
            lowerCase: true,
        },
        phnNum:{
            type:Number,
            required:true,
            unique:true,
        },
        address:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required: true,
        },
        password:{
            type:String,
            required:true,
        }
    },
    {
        timestamps: true,
    }
)

export const users = mongoose.model("user",userSchema)