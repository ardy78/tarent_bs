var serverUrl = "ws://localhost:40000/battle"
var agent = "default";
console.log(process.argv);
if (process.argv.length > 2) {
  serverUrl = process.argv[2];
  console.log("using server url: ",serverUrl);
}
if (process.argv.length > 3) {
  agent = process.argv[3]; 
  console.log("using agent: ", agent);
}
console.log("url", serverUrl);
var WebSocket = require('ws');
var Message = require('./message');
var Client = require('./client');


var ws = new WebSocket(serverUrl);
var client;
ws.on('open', function() {
  var emit = function(str) {
    ws.send(str);
  };

  var actions = require('./agents/' + agent)();

  var states = {};
  states.initial = require('./initial-state')(emit, actions, states);
  states.placing = require('./placing-state')(emit, actions, states);
  states.playing = require('./playing-state')(emit, actions, states);

  client = Client(states.initial);

});
ws.on('message', function(data, flags) {
  console.log("incoming", data);
  client.process(Message(data));
});
/*
if (msg.code == 29) {
  var col = Math.floor(Math.random() * 10);
  var row = Math.floor(Math.random() * 10);
  ws.send("ABCDEFGHIJ" [col] + (row + 1));
}
*/
