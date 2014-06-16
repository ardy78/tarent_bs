var instances = []
var parse = function(spec, col) {
  if (typeof spec == "number") {
    if (typeof col == "number") {
      var row = spec;
      return 16 * row + col;
    }
    return spec;
  }
  if (typeof spec == "string") {
    return parseInt(spec, 16);
  }
};
var Instance = function(num) {
  return {
    num: function() {
      return num;
    },
    toString: function() {
      return num.toString(16);
    },
    row: function() {
      return Math.floor(num / 16);
    },
    col: function() {
      return num % 16;
    },
    nw: function() {
      if (this.col() > 0 && this.row() > 0) {
        return this.n().w();
      }
    },
    n: function() {
      if (this.row() > 0) {
        return Field(num - 16);
      }
    },
    ne: function() {
      if (this.row() > 0 && this.col() < 15) {
        return this.n().e();
      }
    },
    e: function() {
      if (this.col() < 15) {
        return Field(num + 1);
      }
    },
    se: function() {
      if (this.row() < 15 && this.col() < 15) {
        return this.s().e();
      }
    },
    s: function() {
      if (this.row() < 15) {
        return Field(num + 16);
      }
    },
    sw: function() {
      if (this.row() < 15 && this.col() > 0) {
        return this.s().w();
      }
    },
    w: function() {
      if (this.col() > 0) {
        return Field(num - 1);
      }
    }
  };
};


var Field = function(spec,col) {
  var num = parse(spec,col);
  if (typeof instances[num] === "undefined") {
    instances[num] = Instance(num);
  }
  return instances[num];
};

module.exports = Field;
