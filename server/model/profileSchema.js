
import mongoose, {Schema,model}  from "mongoose";

// Define schema for login activity
const loginActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    loginTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    name:{
        type: String,
        required:true
    },
    username:{
        type: String,
        required:true,
        
    },
    password:{
        type: String,
        required:true,
    },
    // Add more fields as needed
});

// Create model from schema
const LoginActivity = model('LoginActivity', loginActivitySchema);

export default LoginActivity;

