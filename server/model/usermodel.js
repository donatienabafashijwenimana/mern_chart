import mongoose from "mongoose";

const userschema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true
    },
    fullname:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilepic:{
        type:String,
        default:''
    },

    // Password reset
    resetPasswordTokenHash:{
        type:String,
        default:''
    },
resetPasswordExpires:{
        type:Date,
        default:null
    }
},
 {timestamps:true}
);

const user = mongoose.model("Users",userschema)
export default user

