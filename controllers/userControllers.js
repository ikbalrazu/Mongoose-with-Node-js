const User = require("../models/userModel");
const asynchandler = require('express-async-handler');


const InsertUser = asynchandler(async (req,res) => {
    const {name,email,password} = req.body;
    
    if(!name || !email || !password){
        res.status(200).json({message:"Plz fillup the all fields"});
    }

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(200).json({message:"User already exits"});
    }

    const user = await User.create({
        name,
        email,
        password,
    })

    if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
        
        })
    }else{
        res.status(400).json({message:"Failed to create the new user"});
        
    }

});

const DeleteUser = asynchandler(async(req,res)=>{
    // const {id} = req.body;
    // if(!id){
    //     res.status(400).json({
    //         message:"Plz enter user id"
    //     })
    // }
    await User.deleteOne({
        _id:req.params.id
    },(error)=>{
        if(error){
            res.status(500).json({
                message:"User delete failed"
            })
        }else{
            res.status(200).json({
                message:"successfully deleted user"
            })
        }

    })

    // if(delete_data){
    //     res.status(200).json({
    //         _id:User._id,
    //         name:User.name,
    //         email:User.email,
    //         password:User.password
    //     })
    // }else{
    //     res.status(400).json({
    //         message:"User delete failed"
    //     })
    // }
})

const Getalluser = asynchandler(async(req,res)=>{
    const users = await User.find();
    const userMap = {};
    users.forEach((user)=>{
        userMap[user._id] = user;
    });
    res.send(userMap);
})

module.exports = {InsertUser,DeleteUser,Getalluser}