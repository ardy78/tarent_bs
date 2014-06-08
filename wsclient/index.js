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

require('./ws-client')(serverUrl, agent);
