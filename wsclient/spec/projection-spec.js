describe("Projection", function() {
  var Projection = require("../projection");
  var overlap = Projection.overlap;
  var overlaps = Projection.overlaps;

  var Ship = function(str) {
    return {
      asPlacement: function() {
        return str;
      }
    };
  };


  describe("The overlap-Function", function() {
    it("calculates the size of the projection of two field sequences", function() {

      expect(overlap("a1,b1,c1,d1,e1", "a3,a4,a5,a6,a7")).toBe(1);
      expect(overlap("b1,c1,d1,e1,f1", "a3,a4,a5,a6,a7")).toBe(0);
      expect(overlap("c1,d1,e1,f1,g1", "a3,b3,c3,d3")).toBe(2);
      expect(overlap("c1,c2,c3,c4", "a2,a3,a4,a5")).toBe(3);
      expect(overlap("g1,g2,g3,g4", "f6,g6,h6,i6")).toBe(1);
    });
  });

  describe("The overlaps-Function", function() {
    it("calculates the overlap for each ship size in a fleet", function() {
      var fleet = [
        Ship("a0,b0,c0"),
        Ship("g1,g2,g3,g4"),
        Ship("b3,c3,d3"),
        Ship("f6,g6,h6,i6")
      ];
      expect(overlaps(fleet)).toEqual({
        3: 2,
        4: 1
      });
    });
  });
});
