const express = require('express');
const _ = require('lodash');

const router = express.Router();
const { Product } = require('../models/product');

// router.get('/',(req,res) => {
//     res.send('Welcome to products')
// });
router.get('/',(req,res) => {
    Product.find().then((products) => {
        res.send(products);
    }) .catch((err) => {
        res.send(err);
    })
});

router.get('/:id',(req,res) => {
    Product.findById(req.params.id) .then((products) => {
        res.send(products);
    }) .catch((err) => {
        res.send(err);
    })
});


router.post('/', (req, res) => {

    let body = _.pick(req.body, ['name','price', 'description', 'category', 'codEligible', 'stock', 'maxUnitPurchase', 'lowStockAlert']);
    let product = new Product(body);
    product.save().then((product) =>{
        res.send({
            product, 
            notice: 'successfully created product'
        });
    }).catch((err) => {
        res.send(err);
    });
});

router.put('/:id',(req,res) => {
    let id = req.params.id; 
    let body = _.pick(req.body, ['name', 'price', 'description', 'category', 'codEligible', 'stock', 'maxUnitPurchase', 'lowStockAlert']);
    Product.findById(id).then((product) => {
        Object.assign(product, body); 
        return product.save()
    }).then((product) => {
        res.send(product);
    }).catch((err) => {
        res.send(err);
    });
})
module.exports = {
    productsController: router
}