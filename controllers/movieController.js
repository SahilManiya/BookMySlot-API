import Movie from "../models/Movie.js";
import catchAsyncError from '../middlewere/catchAsyncError.js';
import ErrorHandler from "../utils/errorhandler.js";
import Booking from "../models/Booking.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { log } from "console";

export const addMovie = catchAsyncError(async(req,res,next)=>{
    const file = req.files.photos;
    const checkMovie = await Movie.findOne({ movie: req.body.movie });

    if(checkMovie) {
        if(file.tempFilePath){
            await fs.unlinkSync(file.tempFilePath);
        }
        return next(new ErrorHandler("Movie already Added...",400));
    }
    cloudinary.uploader.upload(file.tempFilePath, {
        folder : "avatars",
        width : 200,
        crop : "scale"
    },async (err, result) => {
        if (err) {
            return next(new ErrorHandler("Error uploading file"),400);
        }
        const { movie } = req.body;
        try {
            let AddMovie = await Movie.create({
                movie,
                tempfile: result.original_filename,
                avatar: {
                    public_id: result.public_id,
                    url: result.secure_url
                }
            });
            return res.status(201).json({ 
               success : true,
               AddMovie 
            });
        } 
        catch (error) {
            return next(new ErrorHandler("Movie Creat Error",400));
        }
    })
})

export const AllMovie = catchAsyncError(async(req,res,next)=>{
    const findMovie = await Movie.find({}).select('-__v');
    if(!findMovie){
        return next(new ErrorHandler("Movie not Found...",400));
    }

    return res.json({
        success : true,
        Movie : findMovie
    })
})


export const updateMovie = catchAsyncError(async(req,res,next)=>{

    const { movie } = req.body;
    const findMovie = await Movie.findById(req.params.id);
    const file = req.files.photos;
    if(!findMovie){
        return next(new ErrorHandler("Movie not Exist..."));
    }

    let updateFields = { movie };

    if (file) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        let fullPath = join(__dirname, '..', 'tmp', findMovie.tempfile);
        const imgId = findMovie.avatar.public_id;
        if(!imgId){
            return next(new ErrorHandler("public Id not Found",400));
        }

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder : "avatars",
            width : 200,
            crop : "scale"
        });

        if (findMovie.avatar && imgId) {
            await cloudinary.uploader.destroy(imgId);
            if (fullPath && await fs.existsSync(fullPath)) {
                await fs.unlinkSync(fullPath);
            }
        }
        updateFields = { movie , tempfile : result.original_filename }
        console.log(result);
        updateFields.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    res.status(200).json({
        success: true,
        movie: updatedMovie
    });
});

