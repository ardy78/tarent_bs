describe("The 16x16 Arena:", function() {
  var arena = require("../arena")._16x16();
  it("knows its dimensions", function() {
    expect(arena.rows()).toBe(16);
    expect(arena.columns()).toBe(16);
  });
  describe("A Field", function() {
    var Field = arena.field;
    it("is a value-object: iff two instances refer to the same field, they are identical", function() {
      expect(Field(42)).toBe(Field(42));
      expect(Field(43)).not.toBe(Field(42));
    });

    it("can be refered to by its ordinal or by a string representation", function() {
      expect(Field(0x2f)).toBe(Field("2f"));
      expect(Field(0x2f)).toBe(Field("2F"));
    });

    it("can be refered to by its row and column number", function() {
      expect(Field(2, 15)).toBe(Field(0x2f));
    });

    it("has a numerical representation (its ordinal)", function() {
      expect(Field(0x2f).num()).toBe(0x2f);
    });

    it("has a string represntation", function() {
      expect(Field(0x2f).toString()).toBe("2f");
      expect(Field(0x0a).toString()).toBe("0a");
    });

    it("knows its row and column in the arena grid", function() {
      expect(Field(0x2f).row()).toBe(2);
      expect(Field(0x2f).col()).toBe(0xf);
    });

    it("knows its neighbours", function() {
      expect(Field(0x2e).nw()).toBe(Field(0x1d));
      expect(Field(0x2e).n()).toBe(Field(0x1e));
      expect(Field(0x2e).ne()).toBe(Field(0x1f));
      expect(Field(0x2e).e()).toBe(Field(0x2f));
      expect(Field(0x2e).se()).toBe(Field(0x3f));
      expect(Field(0x2e).s()).toBe(Field(0x3e));
      expect(Field(0x2e).sw()).toBe(Field(0x3d));
      expect(Field(0x2e).w()).toBe(Field(0x2d));

      expect(Field(0x10).w()).toBeUndefined();
      expect(Field(0x10).nw()).toBeUndefined();
      expect(Field(0x10).sw()).toBeUndefined();

      expect(Field(0x01).n()).toBeUndefined();
      expect(Field(0x01).nw()).toBeUndefined();
      expect(Field(0x01).ne()).toBeUndefined();

      expect(Field(0xf1).s()).toBeUndefined();
      expect(Field(0xf1).se()).toBeUndefined();
      expect(Field(0xf1).sw()).toBeUndefined();

      expect(Field(0x1f).e()).toBeUndefined();
      expect(Field(0x1f).ne()).toBeUndefined();
      expect(Field(0x1f).se()).toBeUndefined();
    });
  });
});
