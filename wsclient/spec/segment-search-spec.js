describe("Segment Search",function(){
  var search = require("../segment-search.js");

  it("performs a binary search in a list of half-open intervals", function(){
  
    var segments = [0, 0.5, 0.75, 1];

    expect(search(segments,0)).toBe(1);
    expect(search(segments,0.25)).toBe(1);
    expect(search(segments,0.5)).toBe(2);
    expect(search(segments,0.75)).toBe(3);
    expect(search(segments,0.9)).toBe(3);
    expect(search(segments,2)).toBe(3);
  });

});
