const express = require('express');

const app = express();

app.use("/home",(req,res)=>{
    res.send("Done & Dusted");
})

app.listen(3000);