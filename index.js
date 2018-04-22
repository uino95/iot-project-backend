/////////////////////////////////////////////
////////////////// REQUIRES /////////////////
/////////////////////////////////////////////


const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const process = require("process");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var dbo;

MongoClient.connect(url, function(err, db) {
  if(err) throw err;
  dbo = db.db("brokerDb");
  console.log("connected to broker db");
})

/////////////////////////////////////////////
////////////////// APP.USE //////////////////
/////////////////////////////////////////////

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/messages",  function(req, res){
	let query = dbo.collection("messages").find({}).toArray(function(err, result) {
    	if (err) throw err;
    	res.send(result);
  	});
});
/////////////////////////////////////////////
/////////////////// INIT ////////////////////
/////////////////////////////////////////////

// instantiate the app

let serverPort = process.env.PORT || 5000;
	app.set("port", serverPort);

 	//Start the server on port 3000 
	app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});
