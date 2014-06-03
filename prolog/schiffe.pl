:- module(schiffe,[place_ship/4]).

arena(10,10).


place_ship([Size|Sizes],Ships,Sizes,[Ship|Ships]):-
	build_ship(Size,Ship),
	\+ (illegal(Ships,Ship)).


build_ship(Size,ship(Size,(Row,Col),Direction)):-
	arena(MaxRow,MaxCol),
	(	Direction=right,
		Max = MaxCol - Size,
		between(1,MaxRow,Row),
		between(1,Max,Col)
	;	Direction=down,
		Max = MaxRow - Size,
		between(1,Max,Row),
		between(1,MaxCol,Col)
	).

% |A|B|C|D|E|F|G|H|I|J|
%1| | | | | | | | | | |
%2| | | | | | | | | | |
%3| | | | | | | | | | |
%4| | | | | | | | | | |
%5| | | | | | | | | | |
%6| | | | | | | | | | |
%7| | | | | | | | | | |
%8| | | | | | | | | | |
%9| | | | | | | | | | |
%0| | | | | | | | | | |

ship_occupies(ship(Size,(Row0,Col0),right),(Row0,Col)):-
	Col1 is Col0 + Size,
	between(Col0,Col1,Col).

ship_occupies(ship(Size,(Row0,Col0),down),(Row,Col0)):-
	Row1 is Row0 + Size,
	between(Row0,Row1,Row).

occupied(Ships,Position):-
	member(Ship,Ships),
	ship_occupies(Ship,Position).


