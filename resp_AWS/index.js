const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://test:test@ds149724.mlab.com:49724/balance');
mongoose.Promise = global.Promise;


// set up express app
const app = express();

// Front End
app.use(express.static('public'));

// Body Parser for Json
app.use(bodyParser.json());

// Rountes
app.use(routes);

// listen for requests error
app.use(function(err,req,res,next){
  res.status(422).send({error:err.message})
});

// Listen for request
app.listen(process.env.port || 4000, function(){
  console.log("now listen");
});
