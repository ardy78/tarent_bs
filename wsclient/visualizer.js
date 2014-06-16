module.exports = function(arena, options) {
  var N = function(n) {
    var ar = [];
    while (ar.length < n) {
      ar.push(ar.length);
    }
    return ar;
  };

  var toArray = function(a) {
    return Array.prototype.slice.call(a);
  };

  Function.prototype.curry = function() {
    if (arguments.length < 1) {
      return this; //nothing to curry with - return function
    }
    var __method = this;
    var args = toArray(arguments);
    return function() {
      return __method.apply(this, args.concat(toArray(arguments)));
    }
  }


  var renderHeader = function() {
    return [" "].concat(N(arena.columns()).map(arena.columnLabel)).join(" ");
  };

  var renderCell = function(cb,rowNum, colNum) {
    return cb(arena.field(rowNum, colNum));
  };

  var renderRow = function(cb,rowNum) {
    return [arena.rowLabel(rowNum)].concat(N(arena.columns()).map(renderCell.curry(cb,rowNum))).join(" ");
  };

  var render = function() {
    var cbs = toArray(arguments);
    var space = "    ";
    var rowInCols = function(rowNum){
      return cbs.map(function(cb){return renderRow(cb,rowNum);}).join(space);
    };

    return [cbs.map(renderHeader).join(space)].concat(N(arena.rows()).map(rowInCols)).join('\n');
  }

  return {
    render: render
  };
};
