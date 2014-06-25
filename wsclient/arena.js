var Arena = function(options) {
  var rows = options.rows;
  var columns = options.columns;
  var random = options.random;
  if (typeof random !== "function") {
    random = Math.random;
  }
  var instances = [];
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
    if(typeof spec === "object" && typeof spec.num === "function"){
      return spec.num();
    }
  };
  var Instance = function(num) {
    return {
      num: function() {
        return num;
      },
      toString: function() {
        if (typeof options.renderField === "function") {
          return options.renderField(this);
        }
        return "(" + this.row() + "," + this.col() + ")";
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
        if (this.row() > 0 && this.col() < columns - 1) {
          return this.n().e();
        }
      },
      e: function() {
        if (this.col() < columns - 1) {
          return Field(num + 1);
        }
      },
      se: function() {
        if (this.row() < rows - 1 && this.col() < columns - 1) {
          return this.s().e();
        }
      },
      s: function() {
        if (this.row() < rows - 1) {
          return Field(num + columns);
        }
      },
      sw: function() {
        if (this.row() < rows - 1 && this.col() > 0) {
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
    field: Field,
    columnLabel: function(c) {
      if (typeof options.columnLabel === "function") {
        return options.columnLabel(c);
      }
      return c;
    },
    rowLabel: function(r) {
      if (typeof options.rowLabel === "function") {
        return options.rowLabel(r);
      }
      return r;
    },
    randomField: function() {
      return Field(Math.floor(random() * rows * columns));
    },
    scan: function(cb){
      for(var i=0;i<rows*columns;i++){
        cb(Field(i));
      }
    },
    filter: function(cb){
      var r = [];
      for(var i=0;i<rows*columns;i++){
        if(cb(Field(i))){
          r.push(Field(i));
        }
      }
      return r;
      
    }
  };
};
merge = function(object, properties) {
  var key, val;
  for (key in properties) {
    val = properties[key];
    object[key] = val;
  }
  return object;
};

module.exports = Arena;
module.exports._10x10 = function(options) {
  return Arena(merge({
    rows: 10,
    columns: 10,
    parseOrdinal: function(s) {
      return 10 * (s.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)) + parseInt(s[1]);
    },
    renderField: function(field) {
      return "abcdefghij" [field.row()] + field.col();
    },
    rowLabel: function(n) {
      return "ABCDEFGHIJ" [n];
    }
  }, options));
};

module.exports._16x16 = function(options) {
  return Arena(merge({
    rows: 16,
    columns: 16,
    parseOrdinal: function(s) {
      return parseInt(s, 16);
    },
    renderField: function(field) {
      var str = field.num().toString(16);
      return "00".substr(str.length)+str;
    },
    rowLabel: function(n) {
      return n.toString(16);
    },
    columnLabel: function(n) {
      return n.toString(16);
    }
  }), options);
};
