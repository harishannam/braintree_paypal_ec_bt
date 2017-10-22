var braintree = require("braintree");
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gateway = braintree.connect({
  accessToken: process.env.ACCESS_TOKEN
});

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    console.log("client token created");
    res.send(response.clientToken);
  });
});

app.post("/checkout", function (req, res) {

  var saleRequest = {
    amount: req.body.amount,
    merchantAccountId: req.body.currency,
    paymentMethodNonce: req.body.payment_method_nonce,
    options: {
      submitForSettlement: true
    }
  };
  
  console.log(saleRequest);
  console.log("\n");

  gateway.transaction.sale(saleRequest, function (err, result) {
    if (err) {
      console.log(""+err);
      res.send("<h1>Error:  " + err + "</h1>");
    } else if (result.success) {
      console.log("SUCCESS : "+JSON.stringify(result));
      res.send("<h1>Success! Transaction ID: " + result.transaction.id + "</h1>");
    } else {
      console.log("ERROR : "+JSON.stringify(result));
      res.send("<h1>Error:  " + result.message + "</h1>");
    }
  });
});

console.log("HARISH"+process.env.PORT);

app.listen(process.env.PORT, function () {
  console.log('App listening on port 8000!');
});
