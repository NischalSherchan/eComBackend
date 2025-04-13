import { Router } from "express";
import { addProduct, deleteProduct, fetchProductDetails, fetchSingleProduct, updateProduct } from "../controllers/product.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { VerifyToken } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/addProduct").post(upload.single('image'),VerifyToken,addProduct)
router.route("/fetchProducts").get(fetchProductDetails)
router.route('/delete-product/:_id').delete(VerifyToken,deleteProduct)
router.route('/fetchSingleProduct/:id').get(fetchSingleProduct)
router.route('/update-product/:id').patch(VerifyToken, upload.single("image"), updateProduct)
export default router