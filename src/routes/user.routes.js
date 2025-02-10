import { Router } from "express";
import { userRegister,userLogin,userLogout,getUser, refreshTokenAccess, changePassword, changeProfilePic,changeUserDetails } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { VerifyToken } from "../middleware/auth.middleware.js";
const router = Router()

router.route("/register").post(upload.single('profile_pic'),userRegister)
router.route("/login").post(userLogin)
router.route('/logout').post(VerifyToken, userLogout)
router.route('/getUser').get(VerifyToken,getUser)
router.route('/getRefreshToken').post(refreshTokenAccess)
router.route('/changePassword').post(VerifyToken,changePassword)
router.route('/changeProfilePic').patch(upload.single('profile_pic'),VerifyToken,changeProfilePic)
router.route('/changeUserDetails').post(changeUserDetails)
export default router