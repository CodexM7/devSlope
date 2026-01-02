const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post("/sendConnectionRequest", userAuth, async (req,res) => {
    console.log("Sending a connection request!");
    res.send("Connection request Sent!");
});

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const allowedStatus = ["ignored","interested"];
            if(!allowedStatus.includes(status))
                return res.status(400).json({message: "Invalid Status Type: "+ status});

            const toUser = await User.findById(toUserId);
            if(!toUser)
                return res.status(400).json({message: "User not found!"});

            const existingConnectionRequest = await ConnectionRequest.findOne({
                status: status,
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            });

            if(existingConnectionRequest)
                return res.status(200).json(({message: "Connection request already exists!"}));

            const connectionRequest = ConnectionRequest({
                fromUserId,
                toUserId,
                status
            })

            const result = await connectionRequest.save();
            return res.status(200).json({
                message: "Request sent successfully!"
            });
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
)

module.exports = requestRouter;