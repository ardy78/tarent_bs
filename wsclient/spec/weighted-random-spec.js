describe("The wheighted random choice", function() {

  var notSoRandom, WeightedRandom = require("../weighted-random.js");
  beforeEach(function() {
    notSoRandom = function() {
      var data = Array.prototype.slice.call(arguments);
      var i = 0;
      return function() {
        var r= data[i++ % data.length];
        return r;
      };
    };
    var WeightedRandom = require("../weighted-random");
  });

  it("randomly picks an integer from an interval [0,N[ according to a given (discrete) distribution", function() {
    var random = notSoRandom(0, 1 / 4, 2 / 4, 3 / 4);
    var wr = WeightedRandom([0.0, 0.5, 0.25, 0.25], random);
    var counters = {
      0: 0,
      1: 0,
      2: 0,
      3: 0
    };
    for (var i = 0; i < 100; i++) {
      counters[wr()]++;
    }
    expect(counters).toEqual({
      0: 0,
      1: 50,
      2: 25,
      3: 25
    });
  });

  it("normalizes the distribution (such that propabilities sum up to 1)",function(){
    var random = notSoRandom(0, 1 / 4, 2 / 4, 3 / 4);
    var wr = WeightedRandom([0, 12, 6, 6], random);
    var counters = {
      0: 0,
      1: 0,
      2: 0,
      3: 0
    };
    for (var i = 0; i < 100; i++) {
      counters[wr()]++;
    }
    expect(counters).toEqual({
      0: 0,
      1: 50,
      2: 25,
      3: 25
    });
  });


});
