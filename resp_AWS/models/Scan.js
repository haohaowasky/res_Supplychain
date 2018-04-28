const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const scanItem = new Schema({

  barCode: {
    type: String,
    required: [true, 'barcode is required']
  },

  extraInfo:{
    type: String
  },

  privateKey:{
    type: String,
    required:[true, 'privatekey is required']
  }

});

const ScanItem = mongoose.model("scanItem",scanItem);


module.exports = ScanItem;
