const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user')

authRouter.post("/signup", async (req,res) => {
    try {
        // validateSignUpData(req);
        const passwdHash = await bcrypt.hash(req.body.password,10);
        req.body.password = passwdHash;
        // console.log(passwdHash);
        const user = User(req.body);
        await user.save();
        res.send("User added successfully");
    } catch(err) {
        res.status(400).send(err);
    }
});

authRouter.post("/login", async (req,res) => {
    try {
        const userData = await User.findOne({emailId:req.body.emailId});
        if(!userData) throw new Error("User Not Found");
        const isPasswdValid = await userData.validatePassword(req.body.password);
        if(!isPasswdValid) return res.status(404).send("Invalid Credentials");
        const token = await userData.getJWT();
        res.cookie("token",token, {expires: new Date(Date.now() + 8 * 3600000)});
        return res.status(200).send("Login Successful");
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

module.exports = authRouter;