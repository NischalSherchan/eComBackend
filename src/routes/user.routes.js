import { Router } from "express";
import { userRegister,userLogin,userLogout,getUser, refreshTokenAccess, changePassword, changeProfilePic,changeUserDetails } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { VerifyToken } from "../middleware/auth.middleware.js";
import Joi from "joi";
import fs from 'fs'


const router = Router()

const registerValidationSchema = Joi.object({
  name: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(14).required().pattern(new RegExp("^(?=.*[^A-Z0-9])(?=.*[A-Z])(?=.*\\d).{8,}$")).messages({
    "string.pattern.base": "Password must include at least one special character, one uppercase letter, and one digit."
  })
})


router.route('/register').post(upload.single("profile_pic"), async (req, res, next) => {
  try {
    await registerValidationSchema.validateAsync(req.body);
    next();
  } catch (error) {
    console.error("Validation Error:", error.message);

    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    const errorMessage = error.details.map((err) => err.message.replaceAll('"', ''))
    return res.status(400).json({
      message: errorMessage
    });
  }
}, userRegister)


router.route("/login").post(userLogin)
router.route('/logout').post(VerifyToken, userLogout)
router.route('/getUser').get(VerifyToken,getUser)
router.route('/getRefreshToken').post(refreshTokenAccess)
router.route('/changePassword').post(VerifyToken,changePassword)
router.route('/changeProfilePic').patch(upload.single('profile_pic'),VerifyToken,changeProfilePic)
router.route('/changeUserDetails').post(changeUserDetails)
export default router