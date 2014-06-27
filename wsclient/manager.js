module.exports = function(emit) {
  var reactions = [];
  var players = [];
  var playing = false;

  var when = function(pattern, action) {
    var reaction = function(message) {
      var match = message.match(pattern);
      if (match) {
        action.apply(match, match.slice(1));
        return true;
      }
      return false;
    };
    reactions.push(reaction);
  };

  var react = function(message) {
    for( var i=0;i<reactions.length;i++){
      if(reactions[i](message)){
        return true;
      }
    }
    return false;
  };

  var requestList = function(){
    players=[];
    emit("list");
  };

  when(/^07:.+$/, function() {
    requestList();
  });

  when(/^08: New player: ([^\s]+)$/, function(name) {

  });

  when(/^03: Player '([^']*)' is now known as '([^']*)'.$/, function(oldName, newName) {
    requestList();
  });

  when(/^Starting a (\d+) round game, ([^\s]+) vs. ([^\s]+).$/, function(rounds, nameA, nameB) {
    playing = true; 
  });

  when(/^Player ([^\s]+) has won."$/, function(name) {
    playing = false;
    requestList();
  });

  when(/^The match is over, it's a draw. ([^\s]+) (\d+):(\d+) ([^\s]+).$/, function(nameA, scoreA, scoreB, nameB) {
    playing = false;
    requestList();
  });
  when(/^The match is over, ([^\s]+) has won (\d+):(\d+) against ([^\s]+).$/, function(nameA, scoreA, scoreB, nameB) {
    playing = false;
    requestList();
  });

  when(/^93: Invalid player name(s). Try 'list'.$/, function() {
    requestList();
  });
  
  when(/^This game is over. ([^\s]+) has lost by disconnecting.$/, function(name) {
    playing=false;
    requestList();
  });
  when(/^There are no players connected.$/,function(){});

  when(/^([^\s]+)$/, function(name) {
    players.push(name);
    if(!playing && players.length>1){
      emit("start 10 "+players[0]+" "+players[1]);
    }
  });

  emit("manage foo");

  return {
    message: function(str) {
      return react(str);
    },
    players: function(){
      return players.slice();
    }
  };
};
