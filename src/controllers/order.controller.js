import { Order } from "../model/order.model.js"
import { Product } from "../model/product.model.js"
import { User } from "../model/user.model.js"


const createOrder = async (req, res) => {
  try {
    console.log("code was here")
    const Admin = await User.findById(req.user._id)
    console.log(Admin)
    if (Admin.isAdmin) {
      return res.status(403).json({
        message: "Forbidden request"
      })
    }
    let mapped_products = []
    for (let product of req.body.products) {
      const dbProduct = await Product.findById(product.product_id)

      mapped_products.push({
        product_id: dbProduct._id,
        name: dbProduct.title,
        price: dbProduct.price,
        quantity: product.quantity || 1
      })


    }
    const order = await Order.create({
      products: mapped_products,
      created_by: req.user._id
    })

    return res.status(201).json({
      data: order,
      message: "Order Created Successfully"
    })
  } catch (error) {
    console.log("Error in creating order", error)
    return res.status(500).json({
      message: "Wrobd"
    })
  }
}




const totalOrder = async (req,res) =>{
  try {
    const Admin = await User.findById(req.user._id)
    if (!Admin.isAdmin) {
      return res.status(403).json({ message: "forbidden request" })
    }

    const orders = await Order.find().populate("created_by", "name ")

    console.log('orders', orders)

    return res.status(200).json({
      data: orders,
      message: "orders fetched successfully"
    })
  } catch (error) {
    console.log('error in order', error);
    return res.status(500).json({
      message: "Something went wrong"
    })
  }
}

const usersOrder = async (req,res)=>{
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(401).json("Unauthorized request")
    }
    const orders = await Order.find({ created_by: req.user._id }).populate("created_by", "name ")
    if (!orders.length) {
      console.log('error while fetching orders')
      return res.status(404).json({ message: "No orders found" })
    }

    return res.status(200).json({
      data: orders,
      message: "Orders fetched "
    })
  } catch (error) {
    console.log('error while fetching order by user', error)
    res.stauts(500).json("Something went wrong")
  }
}




export {
  createOrder,
  totalOrder,
  usersOrder
}