module.exports = function(WeightedRandom) {
  var identity = function(input) {
    return [input];
  };

  var Choice = function(chain) {
    var choice = {};

    choice.get = function(input) {
      console.log("get","input:",input,"chain(input):",chain(input));
      return chain(input)[0];
    };

    choice.choose = function(produce) {
      return Choice(function(input) {
        console.log("chaining input",input,"choice.get(input)",choice.get(input));
        return produce(choice.get(input));
      });
    };

    return choice;
  };

  return Choice(identity);
};
