const express = require('express');
const {InsertUser, DeleteUser, Getalluser} = require('../controllers/userControllers');
const router = express.Router();

router.route("/").post(InsertUser);
router.delete("/:id",DeleteUser);
router.route("/alluser").get(Getalluser);




module.exports = router;