var _ = require('underscore');

function PositionsBook( opts, posBrds, rs ){
  var options = opts || {};
  
  var defaults = {
    oceanSizeX: 16,
    oceanSizeY: 16,
    ships: [
      { size: 5,
        count: 2
      },
       {size: 4,
        count: 2
      },
       {size: 3,
        count: 2
      },
       {size: 2,
        count: 2
      }
    ]
  }
  options = _.extend(defaults, options);
  
  this.options = options;

  if( rs ){
    this.remainingShips = rs;
  }else{
    this.remainingShips = [];
    this.options.ships.forEach( function(s){
      for(var i=0;i<s.count;i++){
        this.remainingShips.push(s.size);
      }
    }, this);
/*    this.remainingShips = {};
    this.options.ships.forEach( function(s){
      this.remainingShips[s.size] = s.count;
    },this);*/
  }

  if( posBrds ){
    this.positionBoards = posBrds;
  }else{
    this.positionBoards = [];

    options.ships.forEach( function(ship) {
        if( ship.count ){
          this.positionBoards.push(  
            this.createPositionsBoard( options.oceanSizeX, 
                                       options.oceanSizeY,
                                       ship.size,
                                       0));
          this.positionBoards.push( 
            this.createPositionsBoard( options.oceanSizeX, 
                                       options.oceanSizeY,
                                       ship.size,
                                       1));
        }
    }, this);
  }
}


PositionsBook.prototype.positionsCount = function(ships) {
  var count;
  var pbs = this.positionBoards;
  if( ships && ships.length && ships.length > 0 ){
    pbs = pbs.filter( function(pb){
      return (ships.indexOf(pb.shipSize) >= 0);
    });
  };
  pbs.forEach( function (pb){
    if( typeof count === "undefined"){ count = 0 };
    count += pb.positions.length;
  }, this);
  return count;
}

PositionsBook.prototype.remainingPositionsCount = function(ships) {
  var count;
  var pbs = this.positionBoards;
  if( ships && ships.length && ships.length > 0 ){
    pbs = pbs.filter( function(pb){
      return (ships.indexOf(pb.shipSize) >= 0);
    });
  };
  pbs.forEach( function (pb){
    if( typeof count === "undefined"){ count = 0 };
    var pbp = pb.positions;
    count += pbp.reduce( function(a,b){ return a+b },0 );
  }, this);
  return count;
}

PositionsBook.prototype.registerSunkShip = function( shipSize, orient, row, col ) {
  if( this.remainingShips.indexOf( shipSize ) < 0 ){
    return
  }else{
    this.remainingShips.splice( this.remainingShips.indexOf(shipSize),1 );
  };
  if( this.remainingShips.indexOf( shipSize ) < 0 ){
    this.invalidatePositions([shipSize]);
  };
/*  if( this.remainingShips[shipSize] == 0 ){ 
    return;
  }else{
    this.remainingShips[shipSize]--;
  };
  if( this.remainingShips[shipSize] == 0 ){ 
    this.invalidatePositions([shipSize]);
  }*/
  if( orient === "vertical" ){
    this.registerMissRect(col-1, row-1,col+1, row+shipSize);
  }
  else if( orient === "horizontal" ){
    this.registerMissRect(col-1, row-1,col+shipSize, row+1);
  }
}

PositionsBook.prototype.invalidatePositions = function(ships){
  this.positionBoards.filter( function(pb) {
    return (ships.indexOf(pb.shipSize) >=0 );
  },this).forEach( function(pb) {
    for(var i=0,n=pb.positions.length;i<n;i++){
      pb.positions[i] = 0;
    };
  },this);
}

PositionsBook.prototype.remainingConfigurationsCount = function(positionsBook,ships){
  var posBk = positionsBook || this;
  var sv    = ships || posBk.remainingShips;
  var count = 0;
  var v_pos;
debugger;
  
  if( sv.length == 0 ) { console.log("svl=0"); return 0 };
  
  v_pos = posBk.validPositions(sv.slice(0,1));
  
  if( sv.length == 1 ) { console.log("v_pos.l", v_pos.length); return v_pos.length };

  console.log("sv", sv); 

  v_pos.forEach( function( pos ){
    var cloned_pb = posBk.clone();
    cloned_pb.registerSunkShip( pos.size, pos.orient, pos.row, pos.col );
    count += cloned_pb.remainingConfigurationsCount(cloned_pb) 
    console.log("count", count);
  });

  return count;
};

PositionsBook.prototype.validPositions = function( ships ){
  var v_pos = [];
  var pbs = this.positionBoards;

  if( ships && ships.length && ships.length > 0){
    pbs.filter( function(pb) {
      return (ships.indexOf(pb.shipSize) >=0 );
    },this);
  };
  pbs.forEach( function(pb) {
    pb.positions.forEach(function(pos,ix) {
      if( pos ){
        v_pos.push( {size: pb.shipSize, 
                     orient: ( (pb.isVertical) ? "vertical" : "horizontal"),
                     row: ( (pb.isVertical) ? ix % pb.sizeY : Math.floor(ix/pb.sizeX) ),
                     col: ( (pb.isVertical) ? Math.floor(ix / pb.sizeY) : ix % pb.sizeY)
                    } );
      }
    },this);
  },this);
  return v_pos;
}

PositionsBook.prototype.clone = function() {
  var options = shallowCopy(this.options);
  options.ships = this.options.ships.slice();

  var posBrds = [];
  var rs = this.remainingShips.slice(); 

  this.positionBoards.forEach( function (pb) {
    posBrds.push( pb.clone() );
  });
  var pb = new PositionsBook( options, posBrds, rs ); 

  return pb;
};


PositionsBook.prototype.getSample = function( x, y, ss){
  var i,
      f,
      low,
      hi,
      sample,
      coord,
      width;
  sample = 0;
  if( !this.isWithinOceanBounds(x,y) ){ return 0; }
  
  this.positionBoards.forEach(function(posBrd){
    coord  = posBrd.isVertical ? y : x;
    width  = posBrd.isVertical ? posBrd.sizeY : posBrd.sizeX;
    low = Math.max(0, coord + 1 - posBrd.shipSize); 
    hi  = Math.min(coord, width-1);
    offset = posBrd.isVertical ? x*width : y*width ;
    f   = (ss) ? posBrd.shipSize : 1;
    for( i=low; i<= hi; i++ ){
      sample += posBrd.positions[offset+i] * f;  
    }
  });

  return sample;  
}

PositionsBook.prototype.registerMiss = function( x, y ){
  if( !this.isWithinOceanBounds(x,y) ){ return; }
  var i,
      low,
      hi,
      coord,
      width,
      offset;
  

  this.positionBoards.forEach(function(posBrd){
    coord  = posBrd.isVertical ? y : x;
    width  = posBrd.isVertical ? posBrd.sizeY : posBrd.sizeX;
    low = Math.max(0, coord + 1 - posBrd.shipSize); 
    hi  = Math.min(coord, width-1);
    offset = posBrd.isVertical ? x*width : y*width ;
    for( i=low; i<= hi; i++ ){
      posBrd.positions[offset+i] = 0;
    }
  },this);

};


module.exports = PositionsBook;

PositionsBook.prototype.createPositionsBoard = 
  function( oceanSizeX, oceanSizeY, shipSize, isVertical ){

  var pb = {};
  pb.oceanSizeX  = oceanSizeX;
  pb.oceanSizeY  = oceanSizeY;
  pb.shipSize    = shipSize;
  pb.isVertical  = isVertical;
  
  pb.sizeX =  isVertical ? pb.oceanSizeX : (pb.oceanSizeX - pb.shipSize + 1);
  pb.sizeY = !isVertical ? pb.oceanSizeY : (pb.oceanSizeY - pb.shipSize + 1);
  pb.positions   = [];
  pb.positions.length = (pb.sizeX * pb.sizeY);
 
  for( var i=0,n=pb.positions.length;i<n;i++ ){
    pb.positions[i] = 1;
  }
  
  pb.clone = function() {
    var cloned_pb;
    cloned_pb = shallowCopy(pb);
    cloned_pb.positions = pb.positions.slice();
    return cloned_pb;
  }

  return pb;
}

PositionsBook.prototype.isWithinOceanBounds = function(x,y){
  return (x >= 0) && (y >= 0) && (x < this.options.oceanSizeX) && (y < this.options.oceanSizeY);
}


PositionsBook.prototype.registerMissRect = function (x1,y1,x2,y2) {
  var i,j;
  for(i=x1; i<=x2; i++){
    for(j=y1; j<=y2; j++){
      this.registerMiss(i,j);
    }
  }
}


var shallowCopy=function(obj){
  var copy = {};
  Object.keys(obj).forEach(function(key){
    copy[key]=obj[key];
  });
  return copy;
};


