var braintree = require("braintree");
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gateway = braintree.connect({
  accessToken: "access_token$production$2ccztk4gcbs8qv7w$261c4df4e64956dd8d0641a483e68f53"
});

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
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

  gateway.transaction.sale(saleRequest, function (err, result) {
    if (err) {
      console.log(""+err);
      res.send("<h1>Error:  " + err + "</h1>");
    } else if (result.success) {
      console.log(""+JSON.stringify(result));
      res.send("<h1>Success! Transaction ID: " + result.transaction.id + "</h1>");
    } else {
      console.log(""+JSON.stringify(result));
      res.send("<h1>Error:  " + result.message + "</h1>");
    }
  });
});

app.listen(8000, function () {
  console.log('App listening on port 8000!');
});
