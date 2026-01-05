const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');
const user = require('../models/user');
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"]);
        res.status(200).json({
            data: connectionRequests
        });
    } catch (err) {
        req.statusCode(400).send("Error: "+ err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
        $or: [
            { toUserId: loggedInUser._id, status: "accepted" },
            { fromUserId: loggedInUser._id, status: "accepted" }
        ]
        })
        .populate("fromUserId", "firstName lastName photoUrl gender age about skills")
        .populate("toUserId", "firstName lastName photoUrl gender age about skills");

        const connections = connectionRequests.map(req => {
        const otherUser =
            String(req.fromUserId._id) === String(loggedInUser._id)
            ? req.toUserId
            : req.fromUserId;

        return {
            _id: req._id,
            status: req.status,
            user: {
            firstName: otherUser.firstName,
            lastName: otherUser.lastName,
            photoUrl: otherUser.photoUrl,
            gender: otherUser.gender,
            age: otherUser.age,
            about: otherUser.about,
            skills: otherUser.skills
            }
        };
        });

        res.status(200).json({
            data: connections
        });
    } catch (err) {
        res.status(400).send("Error: "+ err.message);
    }
});

module.exports = userRouter;