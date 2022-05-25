const express = require('express');
const bcrypt = require('bcrypt');
const Registration = require('../model/registration');
const nodemailer = require('nodemailer');

const router = express.Router();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:"iqbalraju123@gmail.com",
        pass:"rajuraju123"
    }
})

router.post('/',async(req,res)=>{
    const body = req.body;

    console.log(body.name, body.email, body.password);

    if(!body.name || !body.email || !body.password){
        res.status(200).json({
            message:"plz fillup the all fields"
        });
    }

    const userExists = await Registration.findOne({email:body.email});

    if(userExists){
        res.status(401).json({message:"User already exists"});
    }

    const user = new Registration(body);

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // set hashed password
    //const hashedPassword = await bcrypt.hash(password, salt);

    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc)=>res.status(201).send(doc));
    //console.log("hash password: ",hashedPassword);

    // const user = await Registration.create({
    //     name,
    //     email,
    //     password,
    // })

    // if(user){
    //     res.status(200).json({
    //         _id:user._id,
    //         name:user.name,
    //         email:user.email,
    //         password:user.password,
    //     })
    // }else{
    //     res.status(400).json({message:"failed to create the new user"})
    // }

    //send verification mail to user
    var mailOptions = {
        from:' "Verify your email" <iqbalraju123@gmail.com>',
        to: user.email,
        subject: 'Codewithsid - verify your email',
        html:`<h2>${user.name}! Thanks for registering on our site</h2>
               <h4>Please verify your mail to continue...</h4>
               <a href="http://localhost:5000"></a>`
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });

           
})

router.post('/login',async(req,res)=>{
    const body = req.body;
    const user = await Registration.findOne({email:body.email});
    //console.log(user);
    if(user){
        const validPassword = await bcrypt.compare(body.password, user.password);
        console.log(validPassword);
        if(validPassword){
            res.status(200).json({message:"valid password"})
            console.log(user);
        }else{
            res.status(400).json({error:"Invalid password"});
        }
    }else{
        res.status(401).json({error:"User does not exist"});
    }

})


module.exports = router;