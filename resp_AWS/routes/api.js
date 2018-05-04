const express = require('express');
const router = express.Router();
const Tx = require("../models/Transaction");
const _ = require('lodash');
const Scan = require("../models/Scan");
const Scantest = require("../models/Scantest");

// Ethereum configuration
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/teochFL5M5Cc6eidkmI5"));
var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('https://rinkeby.infura.io/teochFL5M5Cc6eidkmI5');

var abi = require('./abi');

// old address: 0x5a8f94b3eb222fbfbab083d1ba639649459e68b3;
// setup my contract
var contractAddress = '0xc18e297b1e77e99f82d805ac89a10a859bd815a1';

var mycontract = new web3.eth.Contract(abi, contractAddress);

// set up a test account
var u1_pk = "0x123ce564d427a3319b6536bbcef1390d69395b06es6c481954e971d960fe8907";

// utility
function pktoAddress(pk){
  var u1_account = web3.eth.accounts.privateKeyToAccount(pk);
  var u1_address = u1_account[Object.keys(u1_account)[0]];
  return u1_address;
}

const time_converter = (time) =>{
  date1 = new Date(time*1000);
  return date1.toUTCString()
}


function getBalance(addr){
  web3.eth.getBalance(addr, function(e, result){
    console.log(web3.utils.fromWei(result, 'ether') + "ether");
  });
};

function parseJson(Resp){
  const results = [];
  var parameters = ['barcode','condition','scantime'];
  Object.keys(Resp).forEach((paramValues, paramIndex) => {
    const paramName = parameters[paramIndex];
    Resp[paramValues].forEach((paramValue, itemIndex) =>{
      const item = _.merge({}, _.get(results, [itemIndex], {}));
      if (paramIndex == 0){
        item[paramName] = web3.utils.hexToUtf8(paramValue);

      }

      else if(paramIndex == 1){
        item[paramName] = web3.utils.hexToUtf8(paramValue);

      }

      else if(paramIndex == 2){
        item[paramName] = time_converter(paramValue);

      }

      results[itemIndex] = item;
    })
  })
  return results;
}


var test_account = pktoAddress(u1_pk);
// the result is 0x648A67564379AE8486dc6E29A5Aaf5fc4576Bc45


//getBalance(test_account);

//post information
router.post('/scantest', function(req,res,next){
  console.log("Got scantest request at ");
  Scantest.create(req.body).then(function(data){

    var getData = mycontract.methods.ScanItem(web3.utils.asciiToHex(data.barCode),web3.utils.asciiToHex(data.extraInfo)).encodeABI();
    console.log("gotdata");
    var signed_transaction = web3.eth.accounts.signTransaction(

      {
        to: contractAddress,
        data:getData,
        gas: 3000000
      }, u1_pk).then(function(raw){

      web3.eth.sendSignedTransaction(raw[Object.keys(raw)[4]]).on('receipt', function(result){
        console.log(result);
        res.send(result);
    })

  })

  }).catch(next);
});


// Scan with privateKey
router.post('/scan', function(req,res,next){
  console.log("Got scan request at ");
  Scan.create(req.body).then(function(data){

    var getData = mycontract.methods.ScanItem(web3.utils.asciiToHex(data.barCode),web3.utils.asciiToHex(data.extraInfo)).encodeABI();
    console.log("gotdata");
    var signed_transaction = web3.eth.accounts.signTransaction(

      {
        to: contractAddress,
        data:getData,
        gas: 3000000
      }, data.privateKey).then(function(raw){

      web3.eth.sendSignedTransaction(raw[Object.keys(raw)[4]]).on('receipt', function(result){
        console.log(result);
        res.send(result);
    })

  })

  }).catch(next);
});

// get Data-- need work

router.post('/getInfo', function(req,res,next){
  console.log("Got get request at ");

  mycontract.methods.getInfo(req.body.address).call().then(function(Resp){
        console.log(parseJson(Resp));
        res.send(parseJson(Resp));
      }).catch(next);


});


router.post('/getAccount', function(req,res,next){
  console.log("Got get request at ");
  res.send(web3.eth.accounts.privateKeyToAccount("0x" + req.body.mnemonic));
});


router.post('/getBalance', function(req,res,next){
  console.log("Got get request at ");
  web3.eth.getBalance(web3.eth.accounts.privateKeyToAccount("0x" + req.body.mnemonic).address, function(e, result){
    res.send(web3.utils.fromWei(result, 'ether') + "ether");
  }).catch(next);
});


router.post('/getBarcode', function(req,res,next){
  console.log("Got get request at ");
  mycontract.methods.getbarCode(web3.utils.utf8ToHex(req.body.code)).call().then(function(Resp){
        res.send(Resp);
      }).catch(next);
});

module.exports = router;
