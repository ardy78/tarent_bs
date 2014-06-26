var Managa = require("../manager.js");

describe("Managa Man", function() {
  var managa, emit;
  var emitted;
  beforeEach(function() {
    emitted = [];
    emit = function(string) {
      emitted.push(string);
    };
  });

  it("registers as manager upon startup", function() {
    managa = Managa(emit);
    expect(emitted).toEqual(["manage foo"]);
  });

  it("requests a list of players when accepted", function() {
    managa = Managa(emit);
    emitted = [];
    managa.message("07: blabla accepted as manager blablbla");
    expect(emitted).toEqual(["list"]);
  });

  it("keeps track of all connected players", function() {

    managa = Managa(emit);
    var messages = [
      "07: You are now registered as a manager for the games on this server.",
      "tbsa@5339",
      "08: New player: #2",
      "03: Player '#2' is now known as 'tbsa@5595'.",
      "tbsa@5339",
      "tbsa@5595",
      "Starting a 1 round game, tbsa@5339 vs. tbsa@5595.",
      "Player tbsa@5595 has won.",
      "The match is over, tbsa@5595 has won 1:0 against tbsa@5339.",
      "93: Invalid player name(s). Try 'list'.",
      "There are no players connected.",
      "08: New player: #1",
      "03: Player '#1' is now known as 'tbsa@5644'.",
      "08: New player: #2",
      "03: Player '#2' is now known as 'tbsa@5650'.",
      "tbsa@5644",
      "tbsa@5650",
      "93: Invalid player name(s). Try 'list'.",
      "tbsa@5644",
      "tbsa@5650",
      "This game is over. tbsa@5650 has lost by disconnecting.",
      "08: New player: #2",
      "03: Player '#2' is now known as 'tbsa@5754'.",
      "tbsa@5644",
      "tbsa@5650",
    ];
    messages.forEach(function(msg) {
      managa.message(msg);
    });
    expect(managa.players()).toEqual([
      "tbsa@5644",
      "tbsa@5650",

    ]);
  });
  it("starts a game when at least two players are connected",function(){
    managa = Managa(emit);
    emitted = [];
    managa.message("foo");
    managa.message("bar");
    expect(emitted).toEqual([
    "start 1 foo bar"
    ]);

  });

  it("does not start a new match if one is already on",function(){
    managa = Managa(emit);
    managa.message("Starting a 1 round game, tbsa@5339 vs. tbsa@5595.");
    emitted = [];
    managa.message("foo");
    managa.message("bar");
    expect(emitted).toEqual([]);
  });
});
