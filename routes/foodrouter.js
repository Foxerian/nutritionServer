const express = require('express');
const bodyParser = require('body-parser');
const foodItems = require('../models/foodItem');

const foodRouter = express.Router();

foodRouter.use(bodyParser.json());

foodRouter.route('/')
.get((req,res,next) => {
    foodItems.find({})
    .then((fooditems) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditems);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    foodItems.create(req.body)
    .then((fooditem) => {
        console.log('Food item Created ', fooditem);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /fooditems');
})
.delete((req, res, next) => {
    foodItems.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

foodRouter.route('/:foodId')
.get((req,res,next) => {
    foodItems.findById(req.params.foodId)
    .then((fooditem) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /fooditems/'+ req.params.foodId);
})
.put((req, res, next) => {
    foodItems.findByIdAndUpdate(req.params.foodId, {
        $set: req.body
    }, { new: true })
    .then((fooditem) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    foodItems.findByIdAndRemove(req.params.foodId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = foodRouter;