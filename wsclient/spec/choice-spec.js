describe("The Choice", function() {
  var Choice = require("../choice");
  var choose;
  beforeEach(function() {
    WeightedRandom = function(data) {
      var i = 0;
      return function() {
        var r = data[i++ % data.length];
        return r;
      };
    };
    choice = Choice(WeightedRandom);
  });

  it("can produce a value", function() {
    choice = choice.choose(function(input) {
      console.log("cb with",input);
      return [input + 1, input + 2, input + 3];
    });
    expect(choice.get(4)).toBe(5);
  });
});
