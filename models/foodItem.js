
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
    /*author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }*/
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
        required: true
    },
    /*image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },*/
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    /*featured: {
        type: Boolean,
        default:false      
    },*/
    //comments:[commentSchema]
},{
    timestamps: true
});

var foodItems = mongoose.model('foodItem', foodItemSchema);

module.exports = foodItems;