const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');

profileRouter.get("/profile", userAuth, async (req,res)=>{
    try {
        const user = req.user;
        return res.status(200).send(user);
    } catch(err) {
        return res.status(400).send("Something Went Wrong!");
    }
});


module.exports = profileRouter;