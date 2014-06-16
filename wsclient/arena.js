var Arena = function(options) {
  var rows = options.rows;
  var columns = options.columns;
  var instances = []
  var parse = function(spec, col) {
    if (typeof spec == "number") {
      if (typeof col == "number") {
        var row = spec;
        return columns * row + col;
      }
      return spec;
    }
    if (typeof spec === "string" && typeof options.parseOrdinal === "function") {
      return options.parseOrdinal(spec);
    }
  };
  var Instance = function(num) {
    return {
      num: function() {
        return num;
      },
      toString: function() {
        if(typeof options.renderField === "function"){
          return options.renderField(this);
        }
        return "("+this.row()+","+this.col()+")";
      },
      row: function() {
        return Math.floor(num / columns);
      },
      col: function() {
        return num % columns;
      },
      nw: function() {
        if (this.col() > 0 && this.row() > 0) {
          return this.n().w();
        }
      },
      n: function() {
        if (this.row() > 0) {
          return Field(num - columns);
        }
      },
      ne: function() {
        if (this.row() > 0 && this.col() < columns-1) {
          return this.n().e();
        }
      },
      e: function() {
        if (this.col() < columns - 1) {
          return Field(num + 1);
        }
      },
      se: function() {
        if (this.row() < rows-1 && this.col() <columns -1) {
          return this.s().e();
        }
      },
      s: function() {
        if (this.row() < rows-1) {
          return Field(num + columns);
        }
      },
      sw: function() {
        if (this.row() < rows-1 && this.col() > 0) {
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


  var Field = function(spec, col) {
    var num = parse(spec, col);
    if (typeof instances[num] === "undefined") {
      instances[num] = Instance(num);
    }
    return instances[num];
  };

  return {
    rows: function() {
      return rows;
    },
    columns: function() {
      return columns;
    },
    field: Field
  };
};
module.exports = Arena;
