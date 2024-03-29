module.exports=function(data){
  var txt = data.toString();
  var matches = txt.match(/^(\d\d): (.+)$/);
  var fieldMatches = matches && matches.length > 2 ? matches[2].match(/\b([0-9a-jA-J]{2})\b/) : null;
  var c;
  try{
    c=parseInt(matches[1]);
  }catch(e){
    //?
  }
  return {
    code: c ? c : null,
    field: fieldMatches ? fieldMatches[0] : null,
    txt: (matches && (matches.length > 2)) ? matches[2] : null
  };
};
