
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;
const config = require('../config/database');

const userSchema =new schema({

    fname:{type:String,required:true},
    lname:{type:String,required:true},
    role: {type: String, required: true},
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
});

const User =module.exports = mongoose.model("User",userSchema);

module.exports.saveUser = function (newUser, callback) {

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;

            if(err) throw err;

            newUser.save(callback)
        });
    });

};

module.exports.findByUsername = function(username, callback){

    const query = {username:username};

    User.findOne(query, callback);

};

module.exports.passwordCheck = function(plainpassword, hash, callback){
    bcrypt.compare(plainpassword, hash, function(err, match){
        if(err) throw err;

        callback(null,match);

    });

};

module.exports.findUserById = function(id,callback){
    User.findById(id,callback);
};