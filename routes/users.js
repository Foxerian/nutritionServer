var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.use(bodyParser.json());

router.post('/signup', (req, res, next) => {
  console.log("inside function signup");
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

module.exports = router;
