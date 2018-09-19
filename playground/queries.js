const { mongoose } = require('../config/db');
const { Product } = require('../app/models/product');

// Product.find() .then((data) => {
//     console.log(data.length);
// }) .catch((err) => {
//     console.log(err);
// })

//category based on 1 id

// Product.find().where({category:'5ba0a33b051b62163c9fcfc9'}) .then((data) => {
//     console.log(data);
// }) .catch((err) => {
//     console.log(err);
// })

// category based on multiple id's
// Product.find().where('category').in(['5ba0a33b051b62163c9fcfc9','5b9f56efc6fb021ee801a619']) .then((data) => {
//     console.log(data);
// }) .catch((err) => {
//     console.log(err);
// })

//price greater than 500
// Product.find().where('price').gt(500) .then((data) => {
//     console.log(data);
// }) .catch((err) => {
//     console.log(err);
// })

//price greater than equal 500
// Product.find().where('price').gte(500) .then((data) => {
//     console.log(data);
// }) .catch((err) => {
//     console.log(err);
// })

// //price less than 500
// Product.find().where('price').lt(500) .then((data) => {
//     console.log(data);
// }) .catch((err) => {
//     console.log(err);
// })


//price less than equal 500
// Product.find().where('price').lte(500) .then((data) => {
//     console.log(data);
// }) .catch((err) => {
//     console.log(err);
// })


//price greater than 500 && lessthan 1000
// Product.find().where('price').gte(500).lte(1000) .then((data) => {
//     console.log(data);
// }) .catch((err) => {
//     console.log(err);
// })


//price greater than 500 && lessthan 1000 && category
Product.find().where('price').gte(500).lte(1000).where('category').in('5b9f56efc6fb021ee801a619') .then((data) => {
    console.log(data);
}) .catch((err) => {
    console.log(err);
})