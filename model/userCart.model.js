import mongoose, { Types } from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        userName:{
            Types:mongoose.Types.ObjectId,
            ref:user,
        },
        productId:{
            Types:String,
            required: true,
        },
        price:{
            Types:Number,
            required:true,
        },
        seller:{
            types:mongoose.types.ObjectId,
            ref: seller,
        },
        category:{
            types:String,
            required:true,
        }
    }
)

export const cart = mongoose.model("cart",cartSchema)