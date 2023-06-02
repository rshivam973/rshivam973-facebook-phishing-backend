//jshint esversion:6
require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
var bodyParser = require('body-parser');
const cors=require("cors");
const DB= process.env.DATABASE;
const PORT= process.env.PORT || 5000;

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(`${DB}/facebookPhishingDB`,{useNewUrlParser:true})
.then(()=>{
    console.log("database connected")

});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User =  new mongoose.model("User",userSchema);

//login starts
app.post("/login",(req,res)=>{
    const {email,password}=req.body
    User.findOne({email:email})
    .then((user)=>{
        if(user){
            res.send({message:"User already exists"})
        }
        else{
            const user=new User({
                email,
                password
            })
            user.save()
            .then(()=>{
                // res.send( { message:"Sucessfully registered."} )
                res.send({message: "Successfully registered.",
                alertType: "success"})
            })
            .catch((err)=>{
                res.send({ message: err.message, alertType: "error" })
            })
        }
    })
    .catch((err)=>{
        res.send(err)
    })
    
})
//login ends


app.listen(PORT,()=>{
    console.log(`backend started at port ${PORT}`)
});