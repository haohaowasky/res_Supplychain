const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const scanItemtest = new Schema({

  barCode: {
    type: String,
    required: [true, 'barcode is required']
  },

  extraInfo:{
    type: String
  }

});

const Scanitemtest = mongoose.model("scanItemtest",scanItemtest);


module.exports = Scanitemtest;
