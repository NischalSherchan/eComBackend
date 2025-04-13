import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";


export const VerifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
   const token = req.cookies?.accessToken || (authHeader && authHeader.replace('Bearer ',''))

    if (!token) {
        return res.status(401).json({
        message: "user not herer found",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({
        message: "User not found in auth",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message123e: `Error: ${error.message}`,
    });
  }
};
