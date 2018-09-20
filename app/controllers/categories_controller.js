const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authenticate');
const { authorizeUser} = require('../middlewares/authenticate');
 
const { Category } = require('../models/category');

// router.get('/',(req,res) => {
//     res.send('Welcome');
// })

router.get('/',(req,res) => {
    Category.find().then((categories) => {
        res.send(categories);
    }) .catch((err) => {
        console.log(err);
    })
});

router.get('/:id',(req,res) => {
    let id = req.params.id;
    Category.findById(id).then((categories) => {
        res.send(categories);
    }) .catch((err) => {
        console.log(err);
    }); 
});
 
router.post('/',authenticateUser,authorizeUser,(req,res) => {
    let body = _.pick(req.body,['name']);
    let categories = new Category(body);

    categories.save().then((category) => {
        res.send(category);
    }) .catch((err) => {
        res.send(err);
    });
});

router.put('/:id',authenticateUser,authorizeUser,(req,res) => {
    let id = req.params.id;
    Category.findByIdAndUpdate(id,{$set : req.body},{new : true}) .then((categories) => {
        res.send(categories);
    }) .catch((err) => {
        res.send(err);
    })
});

router.delete('/:id',authenticateUser,authorizeUser,(req,res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id) .then((categories) => {
        res.send(categories);
    }) .catch((err) => {
        res.send(err);
    })
})


module.exports = {
    categoriesController: router 
}