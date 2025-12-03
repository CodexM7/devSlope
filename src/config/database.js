const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://codexm7:PvJJaHjuyQYtoO2t@node.v74uld8.mongodb.net/devSlope");
}

module.exports = connectDB;