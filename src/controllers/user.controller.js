import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const userRegister = async (req, res) => {
  try {
    //  get data from client
    const { name, email, password } = req.body;
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      res.status(409).json({
        message: "this Email already has account",
      });
    }
    const photoUrl = `public/img/${req.file.filename}`;
    const user = await User.create({
      name,
      email,
      password,

      profile_pic: photoUrl,
    });

    const createUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createUser) {
      res.status(500).json({
        message: "some error occured while registering",
      });
    }
    return res.status(201).json({
      message: "user create sucessfully",
      data: createUser,
    });
  } catch (err) {
    console.log(`error in register: ${err}`);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};



const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "email is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const  accessToken  =  user.generateAccessToken();
    const  refreshToken  = user.generateRefreshToken();


 
    const loggedInUser = await User.findById(user._id).select(
      "-password -refresh_token"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "successfully logged in",
        data: loggedInUser,
      });
  } catch (err) {
    console.log(`some thing went worng: ${err}`);

    res.status(500).json({ message: "ya hora" });
  }
};
const getUser = async (req, res) => {
  try {
    res.status(200).json({
      data: req.user,
      message: "User fetched Successfully",
    });
  } catch (error) {
    console.log("Error while fetching user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// const getRefreshToken = async (req,res)=>{
//   try {

//     if(!req.user || !req.user.refresh_token){
//       return console.log('token not found');
//     }

//     const token = req.cookie?.refresh_token;
//     const decodeRefreshToken = Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
//     const user = await User.findById(decodeRefreshToken?._id).select("-password -refresh_token");

//     generateAccessAndRefreshToken(user)
//       return res.status(200).json({
//       access_token:user.token.access_token,
//       refresh_token:user.token.refresh_token,
//     })
//   } catch (error) {
//     console.log(error);
//   }
// }

// const getToken = async (req,res)=>{
//   if(req.cookies?.jwt){
//     const refreshToken = req.cookies.jwt;

//     jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded)=>{
//       if(err){
//         return res.status(406).json({
//           message:'unauthorize'
//         });
//       }else{
//         const accessToken = jwt.sign({name:user.name,email:user.email},
//           process.env.ACCESS_TOKEN_SECRET,{
//             expriesIn: '234m'
//           }
//         );
//         return res.json({
//           accessToken
//         });
//       }
//     })
//   }else{
//     return res.status(406).json({
//       message: 'Unauthorized'
//     });
//   }
// }

const refreshTokenAccess = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({
        message: "token not found",
      });
    }
    const decodeToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodeToken?._id).select(
      "-password -refresh_Token"
    );
    // const { accessToken, newRefreshToken } =
    //   await generateAccessAndRefreshToken(user._id);
    const { accessToken } = await generateAccessToken(user._id);
    const { newRefreshToken } = await generateRefreshToken(user._id);
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .json({
        message: "token successfully generated",
      })
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options);
  } catch (error) {
    res.status(500).json({
      message: "token not generated",
    });
  }
};



// const generateAccessAndRefreshToken = async (userId) => {
//   try {
//     const user = await User.findById(userId)
//     const accessToken = user.generateAccessToken()
//     const refreshToken = user.generateRefreshToken()

//     user.refresh_token = refreshToken
//     user.save({ validateBeforeSave: false })

//     return { accessToken, refreshToken }
//   } catch (error) {
//     console.log('Error generating token', error)

//   }
// }

const changePassword = async (req, res) => {
  try {
    const {password, updatePassword } = req.body;
    if (!password || !updatePassword) {
      return res.status(401).json({ message: "Provided both password" });
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(402).json({ message: "user not found" });
    }

    const checkPassword = await user.isPasswordCorrect(password);
    if(!checkPassword){
      return res.status(403).json({
        message:"password doesnot match"
      })
    }

    user.password = updatePassword
    await user.save({validateBeforeSave:false})


    return res.status(200).json({
      message: "password change sucessfully",
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: `error occured while changing password:${error}` });
  }
};

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return console.log(`user not found`);
    }
    const accessToken = user.generateAccessToken();
    return accessToken;
  } catch (error) {
    console.log(`error while generating access token: ${error}`);
  }
};

const generateRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return console.log(`user not found`);
    }
    const refreshToken = user.generateRefreshToken();
    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });
    return refreshToken;
  } catch (error) {}
};

const userLogout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refresh_token: undefined,
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "user logout successfully",
      });
  } catch (error) {
    return console.log(`${error}`);
  }
};

const changeProfilePic = async (req, res) => {
  try {
    const pic = req.file;
    if (!pic) {
      return res.status(400).json({
        message: "no file uploaded",
      });
    }
    const user = req.user._id;
    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    if (user.profile_pic) {
      const oldProfilePic = Path2D.join("public", user.profile_pic);
      if (fs.existsSync(oldProfilePic)) {
        fs.unlinkSync(oldProfilePic);
      }
    }
    const newPhoto = "public/img/${req.file.filename}";
    await user.save();

    const newUser = await User.findById(user).select(
      "-password -refresh_token"
    );

    res.status(200).json({
      message: "profile picture updated sucessfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(`error updating profile picture:${error}`);
    res.status(500).json({
      message: "operation failed vayo photo update garda",
    });
  }
};

const changeUserDetails = async (req,res)=>{
  try {
    const {name,email,_id}= req.body
  if(!name || !email){
    res.status(401).json({
      message:"name or email not provided"
    })
  }

  const user  = await User.findByIdAndUpdate(
    _id,
    {
      $set:{
        name,
        email
      }
    },
    {
      new:true
    }

  ).select("-password -refresh_token")
  return res.status(200).json({
    message:"change successful",
    data:User
  })

  } catch (error) {
    console.log("error while updating");
    res.status(402).json({
      message:"error"
    })
    
  }
  
}

export {
  userRegister,
  userLogin,
  userLogout,
  getUser,
  refreshTokenAccess,
  generateAccessToken,
  generateRefreshToken,
  changePassword,
  changeProfilePic,
  changeUserDetails
};
