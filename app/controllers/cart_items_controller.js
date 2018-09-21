const express = require('express');
const _ = require('lodash');

const router = express.Router();

const { User } = require('../models/user');

const { CartItem } = require('../models/cart_item');
const { authenticateUser} = require('../middlewares/authenticate');
const { validateId } = require('../middlewares/utilites');

router.get('/',authenticateUser,(req,res) => {
    let user = req.locals.user;
    res.send(user.cartItems);
})

router.post('/',authenticateUser,(req,res) => {
    let user = req.locals.user;
    let body = _.pick(req.body,['product','quantity']);
    let cartItem = new CartItem(body);

    //updating the quantity for same product
    var item = user.cartItems.find((item)=> {
      return  item.product.equals(body.product)
    })
    if(item){
        item.quantity += body.quantity
    } else {
        user.cartItems.push(cartItem)
    }
    user.save().then((user) => {
        res.send({
            cartItem,
            notice : "Sucessfully added to the cart"
        });
    }) .catch((err) => {
        res.send(err);
    });
});

router.put('/:id',validateId,authenticateUser,(req,res) => {
    let id = req.params.id;
    let user = req.locals.user;
    let body = _.pick(req.body,['quantity']);
    let inCart = user.cartItems.id(id);
    if(inCart){
        Object.assign(inCart,body);
    }
    user.save().then((user) => {
        res.send({
            cartItem : inCart,
            notice : "Successfully updated the cart"
        });
    }) .catch((err) =>{
        res.send(err);
    })
});

//cart to empty
router.delete('/empty',authenticateUser,(req,res) => {
    let user = req.locals.user;
    User.findOneAndUpdate({ _id: user._id},{$set : {cartItems : []}},{new : true}) .then((rem) => {
        // findByIdAndUpdate({user._id})
        // console.log(user._id);
        // console.log(rem);
        res.send('cart is empty');
    }).catch((err) => {
        res.send(err);
    });
});


router.delete('/:id',validateId,authenticateUser,(req,res) => {
    let user = req.locals.user;
    let id = req.params.id;
    user.cartItems.id(id).remove();
    user.save().then((user) => {
        res.send({
            cartItems : user.cartItems,
            notice : 'Succesfully removed the product from cart'
        })
    })  .catch((err) =>{
        res.send(err);
    })
});


module.exports = {
    cartItemsController : router
}