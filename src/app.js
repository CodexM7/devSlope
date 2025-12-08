const express = require('express');
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const user = require('./models/user');

app.use(express.json());

app.post("/signup", async (req,res) => {
    try {
        // console.log('/signup'); 
        // validateSignUpData(req);
        const passwdHash = await bcrypt.hash(req.body.password,10);
        req.body.password = passwdHash;
        // console.log(passwdHash);
        const user = User(req.body);
        await user.save();
        res.send("User added successfully");
    } catch(err) {
        res.status(400);
        res.send(err);
    }
});

app.post("/login", async (req,res) => {
    try {
        const userData = await user.findOne({emailId:req.body.emailId});
        const isPasswdValid = await bcrypt.compare(req.body.password,userData.password);
        if(!isPasswdValid) {
            return res.status(404).send("Invalid Credentials");
        }
        return res.status(200).send("Login Successful");
    } catch (err) {
        return res.status(400).send(err);
    }
});

app.get("/user",async (req,res)=>{
    try{
        if(!req.body.emailId)
            return res.status(400).json({error:"emailId is required"});
        userData = await User.find({emailId:req.body.emailId})
        if(!userData.length)
            return res.status(404).json(userData);
        return res.status(200).json(userData);
    } catch (err) {
        return res.status(400).send("Something Went Wrong: ",err);
    }
});

app.delete("/user", async (req,res)=>{
    try{
        if(!req.body.emailId)
            return res.status(400).send("emailId is required.");
        const deleteUser = await User.deleteOne({emailId:req.body.emailId});
        if(!deleteUser)
            return res.status(200).send(deleteUser);
        return res.status(200).send(deleteUser);
    } catch(err) {
        return res.status(400).send("Something went wrong");
    }
});

app.patch("/user", async (req,res) => {
    try {
        if(!req.body)
            return res.status(400).json({message:'Details required'});
        const updatedData = await User.findOneAndUpdate(
            {emailId:req.body.emailId},
            req.body,
            { new: false, runValidators: true }
        );
        if(!updatedData)
            return res.status(200).send(updatedData);
        return res.status(200).send(updatedData);
    } catch (err) {
        return res.status(400).send("Something went wrong!");
    }
});

app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({});
        return res.status(200).send(users);
    } catch(err) {
        return res.status(400).send("Something went wrong");
    }
});


connectDB().then(()=>{
    console.log("Database Connection Establish");
    app.listen(7777,()=>{
        console.log('Server is listening to port 7777');
    });
}).catch((err)=>{
    console.log("Can't establish DB connection: ",err);
})