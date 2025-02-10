import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import fs from "fs";
import path from "path";

const addProduct = async (req, res) => {
  try {
    const { title, description, price, in_stock, Categories, rating } =
      req.body;
    if (!req.file) {
      return console.log("no file");
    }

    const imagePath = `/public/img/${req.file.filename}`;
    console.log("files", req.file);

    if (!req.user) {
      return res.status(401).json({
        message: "user not found",
      });
    }

    const Admin = await User.findById(req.user._id);
    console.log("ad", Admin);
    if (!Admin.isAdmin) {
      return res.status(401).json({ message: "Unauthorized action" });
    }

    const product = await Product.create({
      title,
      description,
      price,
      in_stock,
      Categories,
      rating,
      image: imagePath,
    });

    if (!product) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }

    return res.status(201).json({
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log("Error while adding product", error);
    res.status(500).json({
      message: error,
    });
  }
};

const fetchProducts = async (req, res) => {
  try {
    let perPage = parseInt(req.query.perPage) || 5;
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category;

    let productFitler = {};
    if (category) {
      productFitler.Categories = category;
    }

    let products = await Product.find(productFitler)
      .skip((page - 1) * perPage)
      .limit(perPage);

    let totalProducts = await Product.countDocuments(productFilter);

    res.status(200).json({
      page: page,
      perPage: perPage,
      total: totalProducts,
      data: products,
    });
  } catch (error) {
    console.log("error while fetch", error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);

    if (!admin.isAdmin) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    console.log("params", req.params);

    const product = await Product.findById(req.params._id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    await Product.deleteOne({ _id: req.params._id });
    if (product.image) {
      console.log("absolute path", path.resolve());
      console.log("image path", product.image);

      const imagePath = path.join(path.resolve(), product.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("error deleting file", err);
        }
      });
    }
    res.status(200).json({ message: "product deleted sucessfully" });
  } catch (error) {
    console.error("product deleting error", error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const AdminHora = await User.findById(req.user._id);
    if (!AdminHora.isAdmin) {
      return console.log("unauthorize user");
    }
    const { title, description, price, Categories, rating, in_stock } =
      req.body;
    const product = await Product.findByIdAndUpdate(
      req.params._id,
      {
        $set: {
          title,
          description,
          price,
          Categories,
          rating,
          in_stock,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message:"update sucessfilly",
      data:Product
    })
  } catch (error) {
    console.log("error while updating");
    res.status(403).json({
      message:"milyana babu"
    })
    
  }
};

const updateProductImage = async (req,res) =>{
  try {
  const AdminHora = await User.findById(req.user._id);
  if(!AdminHora){
    return console.log('level nai milyana')
  }
  const productImg =await  req.Product._id;
  if(!productImg){
    return res.status(400).json({
      message:'product not found'
    })
  }
  } catch (error) {
    
  }
}

export { addProduct, fetchProducts, deleteProduct,updateProduct };
