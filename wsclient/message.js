module.exports=function(data){
  var txt = data.toString();
  var matches = txt.match(/^(\d\d): (.+)$/);
  var fieldMatches = txt.match(/[A-J]\d/);
  return {
    code: parseInt(matches[1]),
    field: fieldMatches?fieldMatches[0]:null,
    txt:matches[2]
  };
};
