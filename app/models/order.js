const mongoose = require('mongoose');
const shorthash = require('shorthash');

const { User } = require('./user');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNumber : {
        type : String,
        required : true,
        unique :true,
    },
    orderDate : {
        type : Date,
        default : Date.now,
        required : true
    },
    status : {
        type : String,
        enum : ['confirmed','cancelled'],
        default : 'confirmed'
    }, 
    user : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    total : {
        type : Number,
        default : 0
    },
    orderItems : [{
        product : {
            type : Schema.Types.ObjectId,
            ref : 'Product'
        },
        quantity : {
            type : Number,
            // required : true,
            min : 1
        },
        price : {
            type : Number,
            // required : true,
            min : 1
        }
    }]
})

orderSchema.pre('validate',function(next){
    let order = this;
    order.orderNumber = `DCT-${shorthash.unique( this.orderDate.toString() + this.user.toString())}`;
    next();
});

orderSchema.pre('save',function(next){
    let order = this;
    User.findOne({_id : order.user}).populate('cartItems.product')
    .then((user) => {
        user.cartItems.forEach((inCart) => {
            let item = {
                product : inCart.product._id,
                quantity : inCart.quantity,
                price : inCart.product.price
            };
            order.orderItems.push(item);
            order.total += item.quantity * item.price;
            next();
        });
    }) .catch((err) => {
        return Promise.reject(err);
    });
});

orderSchema.post('save',function(next){
    User.findOneAndUpdate(this.user,{$set : {cartItems : []}},{new : true}) .then((rem) => {
        console.log('cart is empty');
    }).catch((err) => {
        return Promise.reject(err);
    });
})

const Order = mongoose.model('Order',orderSchema);

module.exports = { 
    Order
}