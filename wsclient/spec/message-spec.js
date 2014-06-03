var Message=require("../message");
describe("The message",function(){
  it("parses code 34",function(){
    var msg = Message("34: Enemy shoots at C5 and misses.");
    expect(msg).toEqual({
      code:34,
      field:"C5",
      txt:"Enemy shoots at C5 and misses."
    });
  });
});
