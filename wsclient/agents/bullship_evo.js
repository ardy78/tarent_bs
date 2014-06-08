module.exports = function() {
  var pos = [];
  var i;
  for( i=0; i<100; i++){ pos[i] = ("ABCDEFGHIJ"[i/10 >>> 0]+(i%10)); }
  
  console.log(pos);
  var mockShip = function(str) {
    return {
      asPlacement: function() {
        return str;
      }
    };
  };
  var attacksCounter = 0;
  return {
    name: function() {
      return "bullship evolution";
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
      var ix = Math.floor(Math.random() * pos.length); 
      var attackPosition = pos[ix];
      pos.splice(ix,1);
      callback( attackPosition );
    }
  };
};
