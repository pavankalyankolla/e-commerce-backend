const express = require('express');
const _ = require('lodash');
const { User } = require('../models/user');
const { authenticateUser } = require('../middlewares/authenticate');

const router = express.Router();

router.get('/',(req,res) => {
    User.find() .then((user) => {
        res.send(user)
    }) .catch((err) => {
        res.send(err);
    })
})

router.post('/',(req,res) => {
    let body = _.pick(req.body,['username','email','password']);
    let user = new User(body);

    user.save().then((user) => {
        return user.generateToken();
    }) .then((token) => {
        res.header('x-auth',token).send(user);
    }) .catch((err) => {
        res.status(400).send(err);
    })
});

router.get('/profile',authenticateUser,(req,res) => {
    res.send(req.locals.user)
})

module.exports = {
        usersController : router
}