var ObjectId = require('mongodb').ObjectId;
const foodItems = require('./models/foodItem');
var user = require('./models/user');
function getObjectId(obj){
    return new ObjectId(obj);
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
function cleanUp(arg){
    if(arg === "seeder")
    {
    foodItems.remove({$and: [{"time" : { $lt : new Date(new Date().getTime() - 1000*30*60)}},{"complete" : false}] })
    .then((fooditems) => {
        console.log(fooditems);
    },(err) => next(err))
    .catch((err) => {
        console.log("error while finding invalid foods");
        next(err)});
    }
    else{

    }

}
function getPay(arg){
    user.findById(arg)
    .then((User) => {
        console.log(User);
        console.log(User.pay);
    },(err) => next(err))
    .catch((err) => {
        console.log("error while finding pay for user");
        next(err)});
}


module.exports = {isEmpty, getObjectId, cleanUp, getPay };
