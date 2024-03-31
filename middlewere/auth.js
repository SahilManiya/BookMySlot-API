import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "../middlewere/catchAsyncError.js";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next (new ErrorHandler("Please login access this resource", 401))
    }
    const decodeData = jwt.verify(token,process.env.JWT_SECRET);
    if(decodeData){
        req.user = await User.findById(decodeData.id);
    }
    next();
})

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }

      next();
    };
  };