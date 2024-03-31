import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    isActive : {
        type : Boolean,
        required : true,
        default : true
    },
    role:{
        type : String,
        enum:["user", "admin"],
        default:"user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
UserSchema.pre("save",async function(next){
    this.password = await bcrypt.hash(this.password,10);
})
// JWT TOKEN
UserSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    });
}
// Compare Password
UserSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password);
}
const User = mongoose.model('User',UserSchema);
export default User;