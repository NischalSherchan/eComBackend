 import mongoose from "mongoose";
import { Product } from "./product.model.js";

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product_id: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true
          },
          name: {
            type: String,
            required: true
          },
          price: {
            type: Number,
            min: 0,
            required: true
          },
          quantity: {
            type: Number,
            min: 1,
            required: true
          },
          status: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'REJECTED'],
            required: true,
            default: 'PENDING'
          }
        }
      ],
      required: true,
      validate: {
        validator: function (value) {
          if (value.length === 0) return false
        },
        message: "At least one product needed"
      }


    },

    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
)


orderSchema.post("save", async function (order) {
  for (let product of order.products) {
    await Product.findByIdAndUpdate(product.product_id,
      {
        $inc: {
          in_stock: -(product.quantity)
        }
      }
    )
  }
})

export const Order = mongoose.model("Order", orderSchema)