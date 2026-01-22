const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) return res.status(401).send("Unauthorized: No/Falsy token provided");
        const decodedObj = await jwt.verify(token,"J)w8h$AG");
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user) {
            throw new Error("User Not Found");
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

module.exports = { userAuth };