import { Router } from "express";
import { addProduct } from "../controllers/product.controller.js";
import {upload} from "../middleware/multer.middleware.js"


const router = Router()

router.route("/addProduct").post(upload.single('image'),addProduct)

export default router