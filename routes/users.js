var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const foodItems = require('../models/foodItem');
const common = require('../common');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.use(bodyParser.json());

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
      user.firstname = req.body.firstname;
      if (req.body.lastname)
      user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }); 
    }
  });
});
router.post('/login', passport.authenticate('local'), (req, res) => {
  //console.log(req);
  //req.user._id is loaded on req.
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


router.get('/logout', (req, res) => {
  console.log(req);
  res.statusCode = 200;
  res.redirect('/');
});

router.route('/rejected')
.get(authenticate.verifyUser,(req,res,next) => {
    foodItems.find({$and : [{ "rejected" : true},{ "seeder" : req.user._id},{"time" : {$gt : new Date(new Date().getTime()-1000*60*24*3)}}] })
    .then((fooditem) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})

router.route('/approved')
.get(authenticate.verifyUser,(req,res,next) => {
    foodItems.find({$and : [{ "approved" : true},{ "seeder" : req.user._id}] })
    .then((fooditem) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
router.route('/reviewed')
.get(authenticate.verifyUser,(req,res,next) => {
    foodItems.find({$and : [{$or: [{ "approved" : true},{"rejected":true}]},{ "reviewer" : req.user._id}] })
    .then((fooditem) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
router.route('/ready')
.get(authenticate.verifyUser,(req,res,next) => {
    foodItems.find({$and : [{ "complete" : true},{ "seeder" : req.user._id},{"underreview" : false},{"rejected" : false},{"approved" : false}] })
    .then((fooditem) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
router.route('/underreview')
.get(authenticate.verifyUser,(req,res,next) => {
    foodItems.find({$and : [{ "underreview" : true},{ "seeder" : req.user._id}] })
    .then((fooditem) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fooditem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
router.route('/pay')
.get(authenticate.verifyUser,(req,res,next) => {
  user.findById(req.user._id,{"pay":1})
  .then((user) => {
      user._id=common.getObjectId(0); //this is for protecting user information getting out in response
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
})
router.route('/rpay')
.get(authenticate.verifyUser,(req,res,next) => {
  user.findById(req.user._id,{"pay":1})
  .then((user) => {
      user._id=common.getObjectId(0); //this is for protecting user information getting out in response
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
})
module.exports = router;
