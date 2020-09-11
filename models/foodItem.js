
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

/*date:{
        type: Date,
        default: Date.now
    } */

const foodItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
        //required: true
    },
    /*image: {
        type: String,
        required: true
    },*/
    price: {
        type: Currency,
        default: 1
        //required: true,
        //min: 0
    },
    seeder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approved: {
        type: Boolean,
        default: false 
    },
    rejected: {
        type: Boolean,
        default: false
    },
    underreview: {
        type: Boolean,
        default: false
    },
    complete: {
        type: Boolean,
        default: false
    },
    time:{
        type: Date,
        required: true,
        default: Date.now()
    }
});

var foodItems = mongoose.model('foodItem', foodItemSchema);

module.exports = foodItems;