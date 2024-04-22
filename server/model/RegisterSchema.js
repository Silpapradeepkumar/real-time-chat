import mongoose, {Schema,model}  from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    phone_number:{
        type: Number,
        required:true,
        
    },
    username:{
        type: String,
        required:true,
        
    },
    password:{
        type: String,
        required:true,
    },
    gender:{
        type: String,
        
    },
    DOB:{
        type: Date,
        
    },
    image:{
        type: String,
        

    }
},{timestamps : true})

const User = model("registers",userSchema);
export default User