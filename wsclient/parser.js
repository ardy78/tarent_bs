
module.exports=function(arena){
  var Field = arena.field;
  var rowMap={};
  var colMap={};
  for(var i=0;i<arena.rows();i++){
    rowMap[arena.rowLabel(i).toString().toLowerCase()]=i;
  }
  for(var j=0;j<arena.columns();j++){
    colMap[arena.columnLabel(j).toString().toLowerCase()]=j;
  }

  var line2cells = function(line0){
    var line = line0.trim();
    var cells = [];
    for(var i=0;i<line.length;i+=2){
      cells.push(line.substr(i,1));
    }
    return cells;
  };

  var parse = function(input,cb){
    var lines = input.split('\n').filter(function(line){return line.trim().length;});
    var colLabels = lines.shift().trim().split(/\s+/);
    lines.forEach(function(line,lineNo){
      var cells = line2cells(line);
      var rowLabel = cells.shift().trim().toLowerCase();
      cells.forEach(function(cell,columnNo){
        if(cell.trim().length){
          var colLabel=colLabels[columnNo];
          cb(Field(rowMap[rowLabel],colMap[colLabel]),cell);
        }
      });
    });
    
  };


  return {
    parse:parse
  };
};
