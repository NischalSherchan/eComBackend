import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";


export const VerifyToken = async (req, res, next) => {
  try {
   const token = req.cookies?.accessToken;
    if (!token) {
        return res.status(401).json({
        message: "kina milyana",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refresh_token");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: `Error: ${error.message}`,
    });
  }
};
