import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import User from "./model/RegisterSchema.js";
import LoginActivity from "./model/profileSchema.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

////////////////////////////////////////////////////////////////////////////////////////

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
dotenv.config();

/////////////////////////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null,uniqueSuffix + file.originalname);
    }
  })
  
  const upload = multer({ storage: storage })



////////////////////////////////////////////////////////////////////////////////////


app.post("/rtc/register/post",upload.single('image'),async(req,res)=>{
    const {name, phone_number, username, password,gender,DOB} = req.body;
    const image = req.file.filename;
    
    bcrypt.hash(req.body.password ,10, async(err,hash)=>{
        const user = new User({name, username, password:hash,gender,DOB,phone_number,image:image});
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.json(error.message);
    }
    })
    

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/rtc/register/get', async(req,res) =>{
    try {
        const savedUser = await User.find();
        res.status(202).json(savedUser);
        console.log(savedUser);
        
    } catch (error) {
        req.json(error.message);
    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/rtc/register/:id",async(req,res)=>{
    const {id} = req.params;
       try {
        const getId = await User.findById(id);
        res.json(getId);
       } catch (error) {
        console.log(error.message);
       }
})


// ///////////////////////////////////////////////////////////////////////////////////////////////////////

// app.put("/rtc/register/put/:id",async(req,res)=>{

//     const {id} = req.params;
//     console.log(id);
//     const {name, username, password,gender,DOB,} = req.body;
//     try {
//         const updatedUser = await User.findByIdAndUpdate(id,{$set:{name, username, password,phone_number,gender,DOB}},{new:true});
//         res.status(201).json(updatedUser);
//     } catch (error) {
//         res.json(error.message);
//     }
// })

// /////////////////////////////////////////////////////////////////////////////////////////////////////

// app.delete("/rtc/register/delete/:id", async(req,res) =>{
//     const {id} = req.params;
//     console.log("id: "+id)


//     try {
//         const updatedUser = await User.findByIdAndDelete(id);
//         res.status(201).json(updatedUser);
//     } catch (error) {
//         res.json(error.message);
//     }
//     console.log("deleted: "+id)
// });



// ///////////////////////////////////////////////////////////////////////////////////


app.post("/rtc/login", async(req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        console.log(user);
        if (!user) {
            return res.json("User is not existing");
        }
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = jwt.sign({ userId: user._id }, 'shhhhhhhh');
            // const loginActivity = new LoginActivity({
            //     userId: user._id,
            //     loginTime: new Date(),
            //     name: user.name,
            //     username: user.username,
            //     password: user.password,
            //     // Add more fields as needed
            // });
            // await loginActivity.save();
            res.json({ success: true, message: 'Login successful', token, userId: user._id });
            
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error.message);
    }
});
///////////////////////////////////////////////////////////////////////////////
app.get('/rtc/login/get', async(req,res) =>{
    try {
        const savedUser = await User.find();
        res.status(202).json(savedUser);
        console.log(savedUser);
        
    } catch (error) {
        req.json(error.message);
    }
})

///////////////////////////////////////////////////////////////////////////////////

// app.get("/rtc/login/get/:id", async (req, res) => {
//     const { id } = req.params;
  
//     // Handle undefined id
//     if (!id) {
//       return res.status(400).json({ success: false, message: "Client ID is required" });
//     }
  
//     try {
//       const clientData = await LoginActivity.findById(id);
//       if (!clientData) {
//         return res.status(404).json({ success: false, message: "Client not found" });
//       }
//       res.json({ success: true, user: clientData });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ success: false, message: "Server error" });
//     }
//   });
  
app.get("/rtc/login/get/user/:id", async (req, res) => {
    const { id } = req.params;
  
    // Handle undefined id
    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
  
    try {
      const userData = await User.findById(id);
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, user: userData });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
});

/////////////////////////////////////////////////////////////////////////////////

const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to database");
        
    } catch (error) {
        const{status,message}=error;
        console.log(status,message);
        
    }
}

/////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
    connect();
})