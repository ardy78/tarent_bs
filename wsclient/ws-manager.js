var WebSocket = require('ws');
var Manager = require('./manager.js');

var serverUrl = "ws://localhost:40000/battle";

if (process.argv.length > 2) {
  serverUrl = process.argv[2];
}

var manager;

var ws = new WebSocket(serverUrl);

ws.on('open', function() {
  var emit = function(str) {
    console.log("outgoing",str);
    ws.send(str);
  };

  manager = Manager(emit);

});
ws.on('message', function(data, flags) {
  console.log("incoming", data);
  manager.message(data.toString());
});

ws.on('close', function(data, flags) {
  // 
});
