var _ = require('underscore');




function PositionsBook( opts ){
  var options = opts || {};
  var ship;

  var defaults = {
    oceanSizeX: 16,
    oceanSizeY: 16,
    ships: [
      { classname: 'carrier',
        size: 5,
        count: 2
      },
       { classname: 'cruiser',
        size: 4,
        count: 2
      },
       { classname: 'destroyer',
        size: 3,
        count: 2
      },
       { classname: 'submarine',
        size: 2,
        count: 2
      }
    ]
  }
  options = _.extend(defaults, options);
  
  this.positionBoards = [];
  this.options = options;
  this.ocean = [];
  this.ocean.length =this.options.oceanSizeX * this.options.oceanSizeY;

  options.ships.forEach( function(ship) {
      if( ship.count ){
        this.positionBoards.push(  
          this.createPositionsBoard(options.oceanSizeX,options.oceanSizeY,ship.size,0));
        this.positionBoards.push( 
          this.createPositionsBoard(options.oceanSizeX,options.oceanSizeY,ship.size,1));
      }
  }, this);
}

PositionsBook.prototype.createPositionsBoard = createPositionsBoard;

PositionsBook.prototype.getSample = function( x, y, ss){
  var i,
      low,
      hi,
      sample,
      coord1,
      coord2,
      height;
  sample = 0;

  if( !this.isWithinOceanBounds(x,y) ){ return 0; }
  
  this.positionBoards.forEach(function(posBrd){
    coord1 = posBrd.isVertical ? x : y;
    coord2 = posBrd.isVertical ? y : x;
    height = posBrd.isVertical ? posBrd.sizeX : posBrd.sizeY;
    low = Math.max(0,coord2+1-posBrd.shipSize); 
    hi  = Math.min(height-posBrd.shipSize,coord2);
    for( i=low; i<= hi; i++ ){
      if (typeof posBrd.positions[i*height+coord1] === "undefined" ) {
         sample += ss ? posBrd.shipSize : 1;
      }else{
         sample += 0; 
      }
    }
  });

  return sample;  
}

PositionsBook.prototype.registerMiss = function( x, y ){
  this.ocean[y*this.options.oceanSizeX+x] = 0;
  registerMiss( this.positionBoards, x, y );
}


PositionsBook.prototype.suggest = function ( ){
  var samples = [];
  var i,j,m,n;
  var highest = 0;

  for( i=0, n=this.options.oceanSizeX; i<n; i++){
    for( j=0, m=this.options.oceanSizeY; j<m; j++){
      samples.push( { x: i, 
                      y: j, 
                      posCount1: this.getSample(i, j, true), 
                      posCount2: this.getSample(i, j, false),
                      posCount3: this.getSample(i-1,j-1,true) + 
                                 this.getSample(i-1,j+1,true) + 
                                 this.getSample(i+1,j-1,true) + 
                                 this.getSample(i+1,j+1,true)

      });
    }
  }
  samples.forEach( function(e){
    highest = e.posCount1 > highest ? e.posCount1 : highest;
  },this);

//  return samples.filter( function(e){ return e.posCount1 == highest }, this);
  return samples.sort( function(e1,e2) { 
    if( e1.posCount1 < e2.posCount1 ) {return 1};
    if( e1.posCount1 > e2.posCount1 ) {return -1};
    if( e1.posCount1 === e2.posCount1 && e1.posCount3 < e2.posCount3) {return 1};
    if( e1.posCount1 === e2.posCount1 && e1.posCount3 > e2.posCount3) {return -1};
    return 0;
  });  
}

PositionsBook.prototype.draw = function() {
//  drawPosBoards(this.positionBoards);
  drawField(this.ocean, this.options.oceanSizeX, this.options.oceanSizeY, false);
}

module.exports = PositionsBook;

function createPositionsBoard( oceanSizeX, oceanSizeY, shipSize, isVertical ){
  var pb = {};
  pb.oceanSizeX  = oceanSizeX;
  pb.oceanSizeY  = oceanSizeY;
  pb.shipSize    = shipSize;
  pb.isVertical = isVertical;
  
  pb.sizeX =  isVertical ? pb.oceanSizeX : (pb.oceanSizeX - pb.shipSize + 1);
  pb.sizeY = !isVertical ? pb.oceanSizeY : (pb.oceanSizeY - pb.shipSize + 1);
  pb.height = !isVertical ? 
              (pb.oceanSizeX - pb.shipSize + 1) :
              (pb.oceanSizeY - pb.shipSize + 1); 
  pb.positions   = [];
  pb.positions.length = (pb.sizeX * pb.sizeY);
  return pb;
}

PositionsBook.prototype.isWithinOceanBounds = function(x,y){
  return (x >= 0) && (y >= 0) && (x < this.options.oceanSizeX) && (y < this.options.oceanSizeY);
}



function registerMiss(posBoards,x,y){
  var i,
      low,
      hi,
      sample,
      coord1,
      coord2,
      height;

  posBoards.forEach(function(posBrd){
    coord1 = posBrd.isVertical ? x : y;
    coord2 = posBrd.isVertical ? y : x;
    height = posBrd.isVertical ? posBrd.sizeX : posBrd.sizeY;
    low = Math.max(0,coord2+1-posBrd.shipSize); 
    hi  = Math.min(height-posBrd.shipSize,coord2);
    for( i=low; i<= hi; i++ ){
      posBrd.positions[i*height+coord1] = 1;
    }
  });

}   

function registerHit(posBoards,x,y){
  // ()()==========D
}   

function drawPosBoards(posBoards){
  posBoards.forEach(function(pb){
    if( pb.isVertical ){
      drawField(pb.positions, pb.sizeX, pb.sizeY, false);
    }else{
      drawField(pb.positions, pb.sizeX, pb.sizeY, true);
    }
  });
}


function drawHorLine(xl){
  var i,
      line;
  line = '  ';
  for( i=0; i<xl; i++ ){
    line += '   ' + i;
  }
  console.log(line);
}

function drawField(field, xl, yl,mirror){
  var i,
      j,
      f,
      symbol,
      line;
  drawHorLine(xl);
  for( i=0; i<yl; i++ ){
    line = i + " |";
    for( j=0; j<xl; j++ ){
      f = (mirror) ? field[j*xl+i] : field[i*xl+j];
      if( typeof(f) === "number" ){
        if( f < 10 ){
          symbol = '  ' + f;
        }else{
          symbol = ' ' + f;
        }
      }else{
        symbol = f ? '  ' + f : '   ';
      }
      line += symbol + '|';
    }
    console.log(line);
  }
  var fieldsummary = field.reduce(function(a,b){return (a+b);},0);
  if( typeof fieldsummary === "string" ){
    fieldsummary = fieldsummary.length;
  }
  console.log( fieldsummary );
}

function registerMissRect(posBrds,x1,y1,x2,y2) {
  var i,j;
  for(i=x1; i<=x2; i++){
    for(j=y1; j<=y2; j++){
      registerMiss(posBrds,i,j);
    }
  }
}




function createSampleField(posBrds) {
  var i,
      j,
      sf = [];
  for( i=0; i<10; i++ ){
    for( j=0; j<10; j++ ){
      sf[i*10+j] = getSample(posBrds,j,i);
    }
  }
  return sf;
}
