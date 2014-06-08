module.exports=function(data){
  var txt = data.toString();
  var matches = txt.match(/^(\d\d): (.+)$/);
  var fieldMatches = txt.match(/([A-J]\d)/);
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
