const express = require('express');
const bodyParser = require('body-parser');

const foodRouter = express.Router();

foodRouter.use(bodyParser.json());

foodRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the fooditems to you!');
})
.post((req, res, next) => {
    res.end('Will add the food: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /fooditems');
})
.delete((req, res, next) => {
    res.end('Deleting all foods');
});

module.exports = foodRouter;