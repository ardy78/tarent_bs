module.exports = function() {
  var mockShip = function(str) {
    return {
      asPlacement: function() {
        return str;
      }
    };
  };
  var attacksCounter = 0;
  return {
    name: function(emitName) {
      //emitName("tarent bullship");
      return "tarent bullship";
    },
    ships: function(emit) {
      emit([
        mockShip("a1,a2,a3,a4,a5"),
        mockShip("g1,g2,g3,g4,g5"),
        mockShip("c1,c2,c3,c4"),
        mockShip("c6,c7,c8,c9"),
        mockShip("i1,i2,i3"),
        mockShip("e1,e2,e3"),
        mockShip("f7,f8"),
        mockShip("i8,i9")
      ]);
    },
    attack: function(messages, callback) {
      console.log("attack #" + attacksCounter++);
      var col = Math.floor(Math.random() * 10);
      var row = Math.floor(Math.random() * 10);
      callback("ABCDEFGHIJ" [col] + row);
    }
  };
};
