import ErrorHandler from '../utils/errorhandler.js';
import catchAsyncError from '../middlewere/catchAsyncError.js';
import sendToken from '../utils/jwtToken.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

export const register = catchAsyncError(async(req,res,next)=>{
    const checkMail = await User.findOne({email:req.body.email});
    if(checkMail){
        return next(new ErrorHandler("Email already Exist...",400));
    }
    const createAdmin = await User.create(req.body);
    if(!createAdmin){
        return next(new ErrorHandler("Admin not Create",400));
    }

    sendToken(createAdmin,201,res);
})

export const getUser = catchAsyncError(async(req,res,next)=>{
    const findUser = await User.find().select('-password -__v');

    if(!findUser){
        return next(new ErrorHandler("User not Found...",400));
    }

    return res.json({
        success : true,
        Users : findUser
    })
})

export const login = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const checkMail = await User.findOne({email});
    if(checkMail){

        const isPasswordMatched = await checkMail.comparePassword(password);
        if(isPasswordMatched){
            sendToken(checkMail, 200, res);
        }
        else{
            return next(new ErrorHandler("Invalid email or password", 401));
        }
    }
    else{
        return next(new ErrorHandler("Invalid  email or password", 401));
    }
})

export const userProfile = catchAsyncError(async(req,res,next)=>{
    let data = await User.findById(req.user.id).select('-password -__v');

    if(!data){
        return next(new ErrorHandler("Data not Found",400));
    }

    return res.json({
        success:true,
        Profile : data
    });
})

export const logout = catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires : new Date(Date.now()),
        httpOnly : true,
    });
    res.status(200).json({
        success : true,
        message : "Logged Out"
    });
})

export const userUpdate = catchAsyncError(async(req,res,next)=>{

    const findUser = await User.findById(req.params.id);
    
    if(!findUser){
        return next(new ErrorHandler("that User not Found...",400));
    }

    const updateUser = await User.findByIdAndUpdate(findUser,req.body);

    if(!updateUser){
        return next(new ErrorHandler("User not update...",400));
    }

    const updated = await User.findById(findUser).select('-password -__v');

    if(updateUser){

        res.clearCookie('token');

        return res.json({
            success : true,
            updateUser : updated,
            message : "Please Login Again.."
        })
    }
})

