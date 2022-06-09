const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');

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
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine','ejs');

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

let user = {
  id:"gdfgfdhfgthgfh",
  email:"iqbalraju123@gmail.com",
  password:"iqbalraju123"
}



app.get('/forgot-password',(req,res,next)=>{
  res.render("forgot-password");
})

app.post("/forgot-password",(req,res,next)=>{
  const {email} = req.body;
  // res.send(email);

  //make sure user exist in database
  if(email !== user.email){
    res.send("user not registered");
    return;
  }

  //user exist and now create a one time token
  const secret = process.env.JWT_SECRET + user.password
  const payload = {
    email: user.email,
    id: user.id
  }
  const token = jwt.sign(payload, secret, {expiresIn: '15m'})
  const link = `http://localhost:5000/reset-password/${user.id}/${token}`;
  console.log(link);
  res.send('password reset link has been sent to ur email');
});

app.get("reset-password/:id/:token",(req,res,next)=>{
  const {id,token} = req.params;
  res.send(req.params);

  if(id !== user.id){
    res.send("Invalid id");
    console.log("invalid id");
    return;
  }

  //we have a valid id, and we have a valid user with this id
  const secret = process.env.JWT_SECRET + user.password;
  try{
    const payload = jwt.verify(token, secret)
    res.render('reset-password', {email: user.email})

  }catch(error){
    console.log(error.message);
    res.send(error.message);
  }
})

app.post("reset-password/:id/:token",(req,res,next)=>{
  const {id,token} = req.params;
  //res.send(user)

  //check if this id exist in database
  if(id !== user.id){
    res.send("invalid id");
    return;
  }
  const secret = process.env.JWT_SECRET + user.password;

  try{
    const payload = jwt.verify(token, secret);
    //validate password and password 2 should match
    //we can simply find the user with the payload email and id and finally update with new password
    //always hash password before saving
    user.password = password
    res.send(user);


  }catch(error){
    console.log(error.message);
    res.send(error.message);
  }

})



app.listen(port,function(error){
    if(error){
        console.log("server failed");
    }else{
        console.log("Server success");
        //connectDB();
    }
})