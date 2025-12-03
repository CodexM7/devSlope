const express = require('express');
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();

app.use(express.json());

app.post("/signup", async (req,res) => {
    try {
        const user = User(req.body);
        await user.save();
        res.send("User added successfully");
    } catch(err) {
        res.status(400);
        res.send(err);
    }
})

connectDB().then(()=>{
    console.log("Database Connection Establish");
    app.listen(7777,()=>{
        console.log('Server is listening to port 7777');
    });
}).catch((err)=>{
    console.log("Can't establish DB connection: ",err);
})