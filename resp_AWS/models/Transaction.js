const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Transactions = new Schema({

  blockHash: {
    type: String,
  },

  blockNumber:{
    type: Number,
  },

  contractAddress:{
    type: String,
  },

  cumulativeGasUsed:{
    type: Number,
  },

  from:{
    type: String,
  },
  gasUsed:{
    type: Number,
  },
  logs:{
    type: String,
  },
  logsBloom:{
    type: String,
  },

  status:{
    type: Boolean,
  },

  to:{
    type: String,
  },

  transactionHash:{
    type: String,
  },

  transactionIndex:{
    type: Number,
  }

});

const Transaction = mongoose.model("transaction",Transactions);


module.exports = Transaction;
