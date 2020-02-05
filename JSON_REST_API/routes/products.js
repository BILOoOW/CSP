const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('..\\models\\product');
const checkAuth = require('..\\middleware\\check_auth');

router.get('/', checkAuth, (req,res,next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(doc => {
        const response = {
            count: doc.length,
            products: doc
        }
        // console.log(response);
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.post('/', checkAuth, (req,res,next) => {
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message:'Handling POST requests to /products',
                createdProduct: product
            });
        })
        .catch(err => {
            console.log(err);
            res.status(422).json({error:err});
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From the database", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message:'No valid entry found for the provided ID'})
        } 
        res.status(200).json(doc);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    })
    // res.status(200).json({
    //     message:'here'
    // });
    // if(id === 'special'){
    //     res.status(200).json({
    //         message: 'hi, special key!',
    //         id:id
    //     });
    // }else{
    //     res.status(200).json({
    //         message: 'You passed an ID'
    //     });
    // }
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            error:err
        });
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
    console.log(id);
});
module.exports = router;