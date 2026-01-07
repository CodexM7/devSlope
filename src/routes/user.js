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

userRouter.get("/feed", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limt > 50 ? 50 : limit;
        const skip = (page-1) * limit;

        const connectionRequests = await connectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const users = await user.find({
            _id: {$nin: Array.from(hideUsersFromFeed)}
        }).select(["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"])
        .skip(skip).limit(limit);

        res.status(200).json(users);
    } catch (err) {
        res.status(400).send("Error: "+err.message);
    }
});

module.exports = userRouter;