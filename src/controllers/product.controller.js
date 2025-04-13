import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const addProduct = async (req, res) => {
  try {
    const { title, description, price, in_stock, Categories, rating } =
      req.body;
    console.log("files", req?.file);
    const imagePath = `/public/images/${req.file.filename}`;

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
  const { title, description, price, Categories } = req.body;
  console.log(req.params,'params')
  const { id } = req.params;

  try {
    const products = await Product.findById("67f8afe6f6849e5d376c4762");

    if (!products) {
      console.log("No product found with that ID");
    } else {
      console.log("Product found:", products);
    }
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "invalid id" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "product not found" });

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (Categories !== undefined) product.Categories = Categories;



    if (req.file) {
      try {
        await fs.promises.unlink(`.${product.image}`);
      } catch (err) {
        if (err.code !== "ENOENT") throw err;
      }
      product.image = `/public/images/${req.file.filename}`;
    }

    await product.save();
    return res.status(200).json({
      data: product,
      message: "Product updated successfully",
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateProductImage = async (req, res) => {
  try {
    const AdminHora = await User.findById(req.user._id);
    if (!AdminHora) {
      return console.log("level nai milyana");
    }
    const product = await req.Product._id;
    if (!product) {
      return res.status(400).json({
        message: "product  not found",
      });
    }
    if (product.image) {
      const oldImg = path.join("public", Product.image);
      if (fs.existsSync(oldImg)) {
        fs.unlinkSync(oldImg);
      }
    }

    const newImg = `public.images/${req.file.filename}`;
    product.image = newImg;
    await product.save();
    res.status(200).json({
      message: "product image updated",
      data: product,
    });
  } catch (error) {
    console.log("file updating img");
    return res.status(500).json({
      message: "operaion failed",
    });
  }
};

const fetchProductDetails = async (req, res) => {
  try {
    let perPage = parseInt(req.query.perPage) || 5;
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category;

    let productFilter = {};
    if (category) {
      productFilter.Categories = category;
    }

    let products = await Product.find(productFilter)
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
    console.log("error while fetch products", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const fetchSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log("product signle", product);

    if (!product) {
      return res.status(404).json({
        msg: "product not found",
      });
    }

    return res.status(200).json({
      msg: "product found",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "error fetching products",
    });
  }
};

export {
  addProduct,
  deleteProduct,
  updateProduct,
  fetchProductDetails,
  updateProductImage,
  fetchSingleProduct,
};
