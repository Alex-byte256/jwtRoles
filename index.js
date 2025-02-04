const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use("/auth",authRouter)

const start = async () => {
    try{
        await mongoose.connect('mongodb+srv://oleksandrkozak2019:uKq1rCE3DPmZHDPe@cluster0.r9wq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })
    }catch (err){
        console.log(err)
    }
}

start()