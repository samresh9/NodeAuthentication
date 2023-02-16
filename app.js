require('dotenv').config();
const express = require('express');
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const User = require(__dirname +  "/userModel.js");

const app=express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.set('strictQuery' , true);
async function connectDB(){
    try{
    await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
    console.log("Database connected");
    }catch(err){
        console.log("Database not connected" ,err);

    }
}

app.get("/" ,  (req,res)=>{
    res.render("home");
})

app.get("/login" , (req,res)=>{
    res.render("login");
})

app.get("/register", (req,res)=>{
    res.render("register");
})

app.post("/register" , (req,res)=>{
    const email = req.body.username;
    const password = req.body.password;
   User.create({email : email , password : password}, (error)=>{
    if(!error){
        console.log("Database Created");
        res.render("secrets");
    }else{
        console.log("Error Occured" , error);
    }
   })
});

app.post("/login" , (req,res)=>{
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({email : email} , (error , foundItems)=>{
        
        if(foundItems){
            console.log(foundItems.password);
            if(foundItems.password === password){
                res.render("secrets");
            }
        }else{
            console.log(error);
        }
    });
});

connectDB().then(()=>{
    app.listen(7000 , function(){
    console.log("Server started running on http://localhost:3000");
})
})