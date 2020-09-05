var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    //username and password added automatically by passport-local
    firstname: {
        type: String,
          default: ''
      },
    lastname: {
        type: String,
          default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    },
    seeder: {
        type: Boolean,
        default: false
    },
    reviewer: {
        type: Boolean,
        default: false
    },
    pay:{
        type: Number,
        default: 0
    }
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);