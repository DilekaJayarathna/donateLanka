const express = require('express');
const router = express.Router();
const User = require('../models/user');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/register',(req,res)=>{

    const newUser = new User({
        fname:req.body.fname,
        lname:req.body.lname,
        role:req.body.role,
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    });

    User.saveUser(newUser, function (err,user) {
        if(err){
            res.json({success: false, msg: 'data not inserted'});
        }
        if(user){
            res.json({success:true, msg:'data inserted'});
        }
    });

});


router.post("/login",(req,res)=>{

    const username = req.body.username;
    const password = req.body.password;

    User.findByUsername(username, function(err, user){

        if(err) throw err;

        if(!user){
            res.json({success:false, msg:'No user found'});
            return false;
        }

        User.passwordCheck(password, user.password, function(err, match){

            if(err) throw err;

            if(match){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 86400});
                res.json(
                    {
                        success:true,
                        token:'JWT '+token,
                        user:{
                            id:user._id,
                            fname:user.fname,
                            lname:user.lname,
                            role:user.role,
                            username:user.username,
                            email:user.email
                        }
                    }
                )
            }else{
                res.json({success:false, msg:'Password does not match!'});
            }
        });
    })
});

router.get('/profile', passport.authenticate('jwt', {session:false}),function(req,res){
    //console.log('gfsjdh');
    res.json({user:req.user});
});

module.exports = router;