describe("The 10x10 Arena:", function() {

  var notSoRandom = function(){
    var seq = Array.prototype.slice.call(arguments);
    return function(){
      var r;
      seq.push(r=seq.shift());
      return r;
    };
  };

  var arena = require("../arena")._10x10({random:notSoRandom(0,0.5,0.999999)});

  it("knows its dimensions", function() {
    expect(arena.rows()).toBe(10);
    expect(arena.columns()).toBe(10);
  });
  
  it("can choose fields at 'random'",function(){
    var Field = arena.field;
    expect(arena.randomField()).toBe(Field(0));
    expect(arena.randomField()).toBe(Field(50));
    expect(arena.randomField()).toBe(Field(99));
  });

  it("can iterate ('scan') over all fields",function(){
    var cb = createSpy("cb");
    var N = arena.rows()*arena.columns();
    arena.scan(cb);
    expect(cb.calls.length).toBe(N);
    for(var i=0;i<N;i++){
      expect(cb.calls[i].args[0]).toEqual(arena.field(i));
    }
  });

  it("can return a list of fields matching a certain criteria",function(){
    var crit = function(f){
      return f.num()<4;
    };
    var field = arena.field;
    var actual =arena.filter(crit);
    var expected = [field(0),field(1),field(2),field(3)];
    var name = function(f){ return f.toString();};
    expect(actual).toEqual(expected);
  });

  describe("A Field", function() {
    var Field = arena.field;
    it("is a value-object: iff two instances refer to the same field, they are identical", function() {
      expect(Field(42)).toBe(Field(42));
      expect(Field(43)).not.toBe(Field(42));
    });

    it("can be refered to by its ordinal or by a string representation", function() {
      expect(Field(15)).toBe(Field("b5"));
      expect(Field(15)).toBe(Field("B5"));
    });

    it("can be refered to by its row and column number", function() {
      expect(Field(1, 5)).toBe(Field(15));
    });

    it("has a numerical representation (its ordinal)", function() {
      expect(Field(15).num()).toBe(15);
    });

    it("has a string represntation", function() {
      expect(Field(15).toString()).toBe("b5");
    });

    it("knows its row and column in the arena grid", function() {
      expect(Field(15).row()).toBe(1);
      expect(Field(15).col()).toBe(5);
    });

    it("knows its neighbours", function() {
      expect(Field(15).nw()).toBe(Field(4));
      expect(Field(15).n()).toBe(Field(5));
      expect(Field(15).ne()).toBe(Field(6));
      expect(Field(15).e()).toBe(Field(16));
      expect(Field(15).se()).toBe(Field(26));
      expect(Field(15).s()).toBe(Field(25));
      expect(Field(15).sw()).toBe(Field(24));
      expect(Field(15).w()).toBe(Field(14));

      expect(Field(10).w()).toBeUndefined();
      expect(Field(10).nw()).toBeUndefined();
      expect(Field(10).sw()).toBeUndefined();

      expect(Field(01).n()).toBeUndefined();
      expect(Field(01).nw()).toBeUndefined();
      expect(Field(01).ne()).toBeUndefined();

      expect(Field(91).s()).toBeUndefined();
      expect(Field(91).se()).toBeUndefined();
      expect(Field(91).sw()).toBeUndefined();

      expect(Field(19).e()).toBeUndefined();
      expect(Field(19).ne()).toBeUndefined();
      expect(Field(19).se()).toBeUndefined();
    });
  });
});
