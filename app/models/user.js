const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const _ = require('lodash');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
        maxlength : 128
    },
    email : {
        type : String,
        required : true,
        validate : {
            validator : function (value) {
                return validator.isEmail(value);
            },
            message : function(){
                return 'Invalid email format';
            }
        }
        
    },
    role : {
        type : String,
        enum : ['admin','customer'],
        default : 'customer'
    },
    tokens : [{
        access : {
            type :String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
});

UserSchema.pre('save',function(next) {
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(user.password,salt).then((hashedPassword) => {
                user.password = hashedPassword;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.generateToken = function(){
    let tokenData = {
        _id : this._id
    };
    let generatedTokenInfo = {
        access : 'auth',
        token : jwt.sign(tokenData,'supersecret')
    }
    this.tokens.push(generatedTokenInfo);
    return this.save().then((user) => {
        return generatedTokenInfo.token;
    });
}

UserSchema.methods.toJSON = function(){
    return _.pick(this,['_id','username','email','role']); //used for all requests
}



UserSchema.statics.findByToken = function(token){
    let User = this;
    let tokenData;
    try{
        tokenData = jwt.verify(token,'supersecret');
    } catch(e) {
        return Promise.reject(e);
    } return User.findOne({
        '_id' : tokenData._id,
        'tokens.token' : token
    })
}


const User = mongoose.model('User',UserSchema);

module.exports = {
    User
}