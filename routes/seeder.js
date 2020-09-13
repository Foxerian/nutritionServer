const express = require('express');
const bodyParser = require('body-parser');
const foodItems = require('../models/foodItem');
var authenticate = require('../authenticate');
var common = require('../common');
const seedRouter = express.Router();

seedRouter.use(bodyParser.json());

seedRouter.route('/')
.get(authenticate.verifyUser,(req,res,next) => {
    common.cleanUp("seeder");
    foodItems.find({$and : [{"rejected" : true},{"seeder" : req.user._id}]})
    .then((fooditem) => {
        if(common.isEmpty(fooditem)){
            console.log("no rejected food items for this user");
            foodItems.find({$and : [{ "complete" : false},{ "seeder" : req.user._id}] })
            .then((fooditems) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fooditems);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(fooditem);
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    //console.log(req);
    req.body.seeder = common.getObjectId(req.user._id);
    //console.log(req.user);
    foodItems.find({ "name" : req.body.name })
    .then((fooditems) => {
        console.log(fooditems);
        if(common.isEmpty(fooditems))
        {
            foodItems.create(req.body)
            .then((fooditem) => {
                console.log('Food item Created ', fooditem);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fooditems);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({"failed" : "food already added"});
       }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /fooditems');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    foodItems.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

seedRouter.route('/:foodId')
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
.put(authenticate.verifyUser,(req, res, next) => {
    req.body.complete = true;
    req.body.rejected = false;
    foodItems.findByIdAndUpdate(req.params.foodId, {
        $set: req.body
    }, { new: true })
    .then((fooditem) => {
        console.log(fooditem);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    foodItems.findByIdAndRemove(req.params.foodId)
    .then((fooditem) => {
        console.log(fooditem);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = seedRouter;