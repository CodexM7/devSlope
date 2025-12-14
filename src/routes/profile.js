const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

profileRouter.get("/profile/view", userAuth, async (req,res)=>{
    try {
        const userObj  = req.user.toObject();
        delete userObj.password;
        return res.status(200).send(userObj);
    } catch(err) {
        return res.status(400).send("Something Went Wrong!");
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
    try {
        if(!validateEditProfileData(req))
            throw new Error ("Not Allowed To Update");
        const user = req.user;
        Object.keys(req.body).forEach(field => {
            user[field] = req.body[field];
        });
        await user.save();
        return res.status(200).send("Profile Updated Sucessfully");
    } catch(err) {
        return res.status(400).send(err.message);
    }
});


module.exports = profileRouter;