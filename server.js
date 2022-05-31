const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

//send email 
const nodemailer = require('nodemailer');

const sendMail = () =>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'iqbalraju451@gmail.com',
          pass: 'yourpassword'
        }
    });
      
      var mailOptions = {
        from: 'iqbalraju451@gmail.com',
        to: 'iqbalraju123@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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

const port = process.env.PORT || 5000;

app.use("/registration",userRoutes);

app.get('/',(req,res)=>{
    res.send("hello world !");
})



app.listen(port,function(error){
    if(error){
        console.log("server failed");
    }else{
        console.log("Server success");
        connectDB();
    }
})