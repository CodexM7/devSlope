const express = require('express');
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const user = require('./models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res) => {
    try {
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
        const token = await jwt.sign({_id:userData._id}, "J)w8h$AG",
            {expiresIn:"1d"}
        );
        // console.log(token);
        res.cookie("token",token);
        return res.status(200).send("Login Successful");
    } catch (err) {
        return res.status(400).send(err);
    }
});

app.get("/profile", userAuth, async (req,res)=>{
    try {
        const user = req.user;
        return res.status(200).send(user);
    } catch(err) {
        return res.status(400).send("Something Went Wrong!");
    }
});

app.post("/sendConnectionRequest", userAuth, async (req,res) => {
    console.log("Sending a connection request!");
    res.send("Connection request Sent!");
})


connectDB().then(()=>{
    console.log("Database Connection Establish");
    app.listen(7777,()=>{
        console.log('Server is listening to port 7777');
    });
}).catch((err)=>{
    console.log("Can't establish DB connection: ",err);
})