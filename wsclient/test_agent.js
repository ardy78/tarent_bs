var CommandLine = require("node-commandline").CommandLine;
var commandLine = new CommandLine('test_agent.js');
commandLine.addArgument('agent1',{type: 'string'})
           .addArgument('agent2',{type: 'string'})
           .addArgument('rep',{type: 'string'})
           .addArgument('serverUrl',{type: 'string'});


//var command = commandLine.parseNode(process.argv[0],process.argv[1],process.argv[2],process.argv[3]);
try{
  var command = commandLine.parseNode.apply(commandLine,process.argv);
}catch( e ){
  console.log('Syntax: %s', commandLine);
  process.exit(1);
}

console.log( JSON.stringify(command) );

var serverUrl   = command.serverUrl || "ws://localhost:40000/battle";
var agent1      = command.agent1    || "default";
var agent2      = command.agent2    || "default";
var repetitions = command.rep       || 100;

var redis = require('redis');
var redisClient = redis.createClient();

redisClient.on("error", function(err){
  console.log( "Couldn't create redis client" );
});

redisClient.on( "message", function(channel, message){ 
  console.log( "Channel '" + channel + "' published: " + message );
});

redisClient.subscribe("battleship_winner");
redisClient.subscribe("battleship_loser");

require('./ws-client')(serverUrl, agent1);
require('./ws-client')(serverUrl, agent2);
