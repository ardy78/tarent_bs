var PositionBook = require("../position-book");

describe("The positions-book:", function() {

  var posBk;

  beforeEach(function() {
    var options = {
      oceanSizeX: 3,
      oceanSizeY: 3,
      ships: [{size: 2, count: 1},{size:3, count:1 }]
    };
    posBk = new PositionBook(options);
  });

  it("calculates the number of all possible ship-positions",function() {
    // number of possible ship-positions for ...
    // ... all ship-classes
    var pc = posBk.positionsCount();
    // ... size-2-class-ships
    var pc_2 = posBk.positionsCount([2]);
    // ... size-3-class-ships
    var pc_3 = posBk.positionsCount([3]);
    // ... size-2- and size-3-class-ships
    var pc_all = posBk.positionsCount([2,3]);

    expect(pc).toBe(18);
    expect(pc_2).toBe(12);
    expect(pc_3).toBe(6);
    expect(pc_all).toEqual(pc);
  });

  it("calculates the number of all remaining possible ship-positions",function() {
    // we hit water at (1,0)
    /*  0 1 2
       0  x 
       1
       2
    */    
debugger;
    posBk.registerMiss(1,0);    
    

    // number of remaining possible ship-positions for ...
    // ... all ship-classes
    var pc = posBk.remainingPositionsCount();
    // ... size-2-class-ships
    var pc_2 = posBk.remainingPositionsCount([2]);
    // ... size-3-class-ships
    var pc_3 = posBk.remainingPositionsCount([3]);
    // ... size-2- and size-3-class-ships
    var pc_all = posBk.remainingPositionsCount([2,3]);
 

    expect(pc).toBe(13);
    expect(pc_2).toBe(9);
    expect(pc_3).toBe(4);
    expect(pc_all).toEqual(pc);
  });

  it("can be cloned", function() {
    posBk_cloned = posBk.clone();
    expect(posBk_cloned).not.toBe(posBk);
    expect(posBk_cloned).toEqual(posBk);
    expect(posBk_cloned.remainingShips).not.toBe(posBk.remainingShips);
    expect(posBk_cloned.remainingShips).toEqual(posBk.remainingShips);
  });

  it("invalidates all positions of a given ship-class", function() {
    posBk.invalidatePositions([2]);
    var pc = posBk.remainingPositionsCount();
    var pc_2 = posBk.remainingPositionsCount([2]);
    var pc_3 = posBk.remainingPositionsCount([3]);
    expect(pc).toBe(6);
    expect(pc_2).toBe(0);
    expect(pc_3).toBe(6);
  });

  it("accounts for sunken Ships", function() {
    // tell the posBook we have sunk the ship 00,10,20, ie.
    /*   0 1 2
       0 < = > 
       1
       2
    */    
    posBk.registerSunkShip(3,"horizontal",0,0)

    var pc = posBk.remainingPositionsCount();
    var pc_2 = posBk.remainingPositionsCount([2]);
    var pc_3 = posBk.remainingPositionsCount([3]);
    expect(pc).toBe(2);
    expect(pc_2).toBe(2);
    expect(pc_3).toBe(0);
    
  });
  
});
