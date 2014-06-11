var RandomPlacement = require("./randomShipPlacement.js");
var async = require("async");

var field = [];
for(var i = 0; i < 100; i++) {
  field[i] = 0;
}

  var printPlayingField = function() {
    var letter, type;
    console.log("      0     1     2     3     4     5     6     7     8     9");
    console.log("");
    for (var i = 0; i < 10; i++) {
      var row = [];
      row.push("ABCDEFGHIJ" [i]);
      row.push(" ");
      for (var j = 0; j < 10; j++) {
        letter = field[(i*10+j)].toString() + " ";
        row.push(letter);
      }
      console.log(row.join(""));
    }
  };



async.times(100000, function(n, done) {

  var placement = RandomPlacement();
  placement(function(ships) {
    ships.forEach(function(ship) {
      ship.asFields().forEach(function(f) {
        field[f]++;
      });
    });
    console.log("Ship placement done, #", n);
    done();
  });
}, function(err, results) {
 // results are empty
  
  console.log("DONE!");
  printPlayingField();
});

