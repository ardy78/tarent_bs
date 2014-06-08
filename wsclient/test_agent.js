var CommandLine = require("node-commandline").CommandLine;
var commandLine = new CommandLine('test_agent.js');
commandLine.addArgument('agent1',{type: 'string'})
           .addArgument('agent2',{type: 'string'})
           .addArgument('rep',{type: 'string'})
           .addArgument('serverUrl',{type: 'string'});


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

var wins = {};
var losses = {};
var agents = [];

var redis = require('redis');
var redisClient = redis.createClient();

redisClient.on("error", function(err){
  console.log( "Couldn't create redis client: " + err);
});

redisClient.on( "message", function(channel, message){ 
  var roundsPlayed=0;
  console.log( "Channel '" + channel + "' published: " + message );

  if( channel === 'battleship_winner') { 
    wins[message] = wins[message] ? (wins[message] + 1) : 1;
    for( agent in wins ){ 
      roundsPlayed += wins[agent];
      console.log(agent,': ', wins[agent]);
    }
    console.log('Rounds played',roundsPlayed ); 
  }

  if( channel === 'battleship_loser') { 
    losses[message] = losses[message] ? (losses[message] + 1) : 1;
  }
});


redisClient.subscribe("battleship_winner");
redisClient.subscribe("battleship_loser");

/*
var startRound = function(){
  var wsc1 = require('./ws-client')(serverUrl, agent1);
  var wsc2 = require('./ws-client')(serverUrl, agent2);
  console.log('wsc1+2: ',wsc1,wsc2);
}

startRound();
*/
