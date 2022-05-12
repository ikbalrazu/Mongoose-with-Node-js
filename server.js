const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const basicRoutes = require('./routes/basicRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
const name = process.env.name;

const connectDB = async ()=>{
    try{

        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);

    }catch(error){
        console.log(`error: ${error.message}`);
        process.exit();
    }
}

app.use("/api/insert",userRoutes);
app.use('/todo',basicRoutes);

app.get("/",(req,res)=>{
    res.send(name);
})

app.listen(port,function(error){
    if(error){
        console.log("server fail");
    }else{
        console.log("server success");
        connectDB();
    }
})