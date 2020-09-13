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


    foodItems.findOne({$and : [{ "complete" : true},{ "underreview" : false},{"approved":false},{"rejected":false}] })
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
    var seeder_Id;

    foodItems.findById(req.params.foodId)
        .then((fooditem) => {
                        console.log("gonna assign seeder id");
                        console.log(fooditem);
                        seeder_Id=fooditem.seeder;
                        console.log(seeder_Id);
                        user.updateMany({_id : { $in: 
                                                    [  
                                                        common.getObjectId(req.user._id), 
                                                        common.getObjectId(seeder_Id) 
                                                    ] 
                                                }, 
                                        },
                                        {
                                            $inc: {"pay":1}
                                        })
                        .then((user)=>{
                            console.log(user);
                            },(err) => next(err))
                        .catch((err) => next(err));

                    }, (err) => next(err))
        .catch((err) => next(err));
    req.body.approved=true;
    req.body.underreview=false;
    foodItems.findByIdAndUpdate(req.params.foodId, {
        $set: req.body
    }, { new: true })
    .then((fooditem) => {
        //console.log(req);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({"failed" : "delete not allowed"});
});

reviewRouter.route('/:foodId/reject')
.put(authenticate.verifyUser,(req,res,next) => {
    user.findByIdAndUpdate(req.user._id,{$inc: {"pay":1} })
    .then((user)=>{
                    console.log("completed incrementing pay for reviewer");
                    console.log(user);
                    },(err) => next(err))
    .catch((err) => next(err));
    
    foodItems.findByIdAndUpdate(req.params.foodId,{"underreview":false, "reviewer":req.user._id,"description":req.body.description,"rejected":true},{new :true})
    .then((fooditem) => {
        console.log(fooditem);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})

module.exports = reviewRouter;