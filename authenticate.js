var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var cookieExtractor = function(req) {
    console.log("cookieExtractor");
    console.log(req.headers);
    var token = null;
    if (req && req.cookies) 
    {
        console.log("getting token");
        token = req.cookies["token"];
        console.log(token);
    }
    return token;
};
  
var opts = {};
opts.jwtFromRequest = cookieExtractor; // check token in cookie
opts.secretOrKey = config.secretKey;

exports.jwtPassport= passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("authentication");
    console.log(jwt_payload._id);
  User.findOne({_id : jwt_payload._id}, function(err, user) {
    if (err) {
        console.log("user not found");
      return done(err, false);
    }
    if (user) {
        console.log("user found");
      done(null, user);
    } else {
      done(null, false);
    }
  });
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});