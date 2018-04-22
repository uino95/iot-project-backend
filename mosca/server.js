var mosca = require('mosca')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',		
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var dbo;

MongoClient.connect(url, function(err, db) {
  if(err) throw err;
  dbo = db.db("brokerDb");
  console.log("connected to broker db");
})

var moscaSettings = {
  port: 1883,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:27017/mqtt'
  }
};

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);


server.on('clientConnected', function(client) {
	console.log('client connected', client.id);		
});

// fired when a message is received
server.on('published', function(packet, client) {
  var message;
  message = {
    topic: packet.topic,
    payload: packet.payload.toString()
  };
  console.log('Published', message);  
  dbo.collection("messages").insertOne(message, function(err, res) {
    if (err) throw err;
    console.log("message saved");
  });
});

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')
  // dbo.collection("messages").find({}).toArray(function(err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });
}