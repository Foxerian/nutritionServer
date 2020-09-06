const express = require('express');
const bodyParser = require('body-parser');
const foodItems = require('../models/foodItem');
var authenticate = require('../authenticate');
const common = require('../common');
const user = require('../models/user');
const reviewRouter = express.Router();

reviewRouter.use(bodyParser.json());

reviewRouter.route('/')
.get(authenticate.verifyUser,(req,res,next) => {
    foodItems.updateMany({$and: [{"time" : { $lt : new Date(new Date().getTime() - 1000*30*60)}},{"underreview" : true}] },{$set :{"underreview":false ,"reviewer":common.getObjectId(0)}})
    .then((fooditems) => {
        console.log(fooditems);
    }, (err) => next(err))
    .catch((err) => next(err));
    foodItems.findOne({$and : [{ "complete" : true},{ "underreview" : false}] })
    .then((fooditems) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditems);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
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
    console.log("timer look up");
    var timer=timermap.get("chicken");
    console.log(timer);
    clearTimeout(timer);
    console.log("timer cleared out");
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

reviewRouter.route('/:foodId')
.get(authenticate.verifyUser,(req,res,next) => {
    foodItems.findByIdAndUpdate(req.params.foodId,{"underreview":true, "reviewer":req.user._id},{new :true})
    .then((fooditem) => {
        console.log(fooditem);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /fooditems/'+ req.params.foodId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    if(req.body.approved)
    {
            user.updateMany({_id : { $in: 
                                            [  
                                                common.getObjectId(req.body.reviewer), 
                                                common.getObjectId(req.body.seeder) 
                                            ] 
                                    }, 
                                },
                                {
                                    $inc: {"pay":1}
                                }
                                ).then((user)=>{
                                console.log(user);
                                },(err) => next(err))
                                .catch((err) => next(err));
    }
    else
    {
            user.findByIdAndUpdate(req.user.id,{$inc: {"pay":1} },{new:true})
            .then((user)=>{
                            console.log(user);
                        },(err) => next(err))
            .catch((err) => next(err));
    }
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
.delete(authenticate.verifyUser,(req, res, next) => {
    foodItems.findByIdAndRemove(req.params.foodId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = reviewRouter;