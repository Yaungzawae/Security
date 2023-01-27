//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const exp = require("constants");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));

uri = "mongodb://127.0.0.1:27017/secret";
mongoose.set("strictQuery","false");
mongoose.connect(uri);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret : secret, encryptedFields : ["password"]})

const User = mongoose.model("user", userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/register", (req,res)=>{
    res.render("register");
})

app.post("/register", (req,res)=>{
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });
    user.save(err=>{
        if(err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
})

app.get("/login", (req,res)=>{
    res.render("login");
})

app.post("/login", (req,res)=>{
    
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({email:email},(err,foundUser)=>{
        if(err){
            console.log(err);
        } else {
            console.log(foundUser)
            if(!foundUser){
                res.send("Not Registered");
            } else if(foundUser.password === password){
                res.render("secrets");
            } else {
                res.send("Wrong Password")
            }
        }
    })
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000.")
})