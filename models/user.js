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
    }
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);