const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const asynchandler = require('express-async-handler');
const req = require('express/lib/request');

//POST TODO / insert todo
router.post("/",(req,res)=>{
    const newTodo = new User(req.body);
    newTodo.save((error)=>{
        if(error){
            res.status(500).json({
                error:"error from server side"
            })
        }else{
            res.status(200).json({
                message:"successfully inserted"
            })
        }
    })
})

//post multiple todo
router.post('/all',(req,res)=>{
    User.insertMany(req.body,(error)=>{
        if(error){
            res.status(500).json({
                error:"error from server side"
            })
        }else{
            res.status(200).json({
                message:"successfully inserted multiple users"
            })
        }
    })
})

//get specific todo with id

//get all todo 
router.get('/',async(req,res)=>{
    // await User.find({},(error,data)=>{
    //     if(error){
    //         res.status(500).json({
    //             error:"error from server side"
    //         })
    //     }else{
    //         res.status(200).json({
    //             users:data
    //         })
    //     }
    // }).clone().catch(function(error){
    //     console.log(error);
    // })
    try{
        const data = await User.find({})
        res.status(200).json({
            users:data
        })
    }catch(error){
        res.status(500).json({
            error:"error from server side"
        })
    }
    
    
    
})
//get todo with selected field
router.get('/selectfield',(req,res)=>{
    User.find({}).select({
        _id: 0,
        password: 0,
        _v: 0,
        timestamps: 0
    }).exec((error, data)=>{
        if(error){
            res.status(500).json({
                error:"There was a server side error",
            });
        }else{
            res.status(200).json({
                users:data
            })
        }
    })
})
//get todo with limits
router.get('/limits',(req,res)=>{
    User.find({}).select({
        _id: 0,
        password: 0,
        _v: 0,
        timestamps: 0
    })
    .limit(2)
    .exec((error, data)=>{
        if(error){
            res.status(500).json({
                error:"There was a server side error",
            });
        }else{
            res.status(200).json({
                users:data
            })
        }
    })
})
//get todo by id
router.get('/:id',async(req,res)=>{
    // const result = await User.find({_id:req.params.id}).clone();
    // res.send(result);
    try{
        const result = await User.find({_id:req.params.id})
        res.send(result);
    }catch(error){
        res.send("failed");
    }
})  

//update todo
router.put("/:id", (req,res)=>{
    User.updateOne({_id:req.params.id},{
        $set:{
            name:"mr shafiur rahman"
        },
    },(error)=>{
        if(error){
            res.status(500).json({
                error:"error from server side"
            })
        }else{
            res.status(200).json({
                message:"successfully updated users"
            })
        }
    })
})

//update todo with response
router.put("/update/:id",async (req,res)=>{
    const updatedata = await User.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            name:"mr shafiur"
        },
        
    },{
        new:true,
        useFindAndModify: false,
    },(error)=>{
        if(error){
            res.status(500).json({
                error:"error from server side"
            })
        }else{
            res.status(200).json({
                message:"successfully updated users"
            })
        }
    }).clone()
    console.log(updatedata);
})

//delete todo
router.delete('/delete/:id',async(req,res)=>{
    User.deleteOne({_id:req.params.id},(error)=>{
        if(error){
            res.status(500).json({
                error:"error from server side"
            })
        }else{
            res.status(200).json({
            message:"successfully deleted users"
            })
        }
    })
})

module.exports = router;