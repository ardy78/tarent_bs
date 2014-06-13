:- module(rules,[init/0,assume/1]).

:- use_module(library(chr)).

:- use_module(library(swipredis)).

:- use_module(config).

%:- chr_constraint leq/2.

%reflexivity  @ leq(X,X) <=> true.
%antisymmetry @ leq(X,Y), leq(Y,X) <=> X = Y.
%idempotence  @ leq(X,Y) \ leq(X,Y) <=> true.
%transitivity @ leq(X,Y), leq(Y,Z) ==> leq(X,Z).

emit(R,G):-
  memorize(G),
  G=.. L,
  atomic_list_concat(L,' ',MsgAtom),
  config(name(NameAtom)),
  atomic_list_concat([NameAtom,':',MsgAtom],Atom),
  config(channel(Chan)),
  writeln(emit(Chan,R,Atom)),
  redis_connect(C),
  call_cleanup(
      redis_do(C,publish(Chan,Atom),_),
      redis_disconnect(C)
  ),
  call(G).

init:-
  retractall(known(_)),
  field(99),
  forall(find_chr_constraint(C),memorize(C)).

assume(C):-
  constraint(C), !, call(C),writeln(done).
assume(C):-writeln(ignore(C)).

constraint(free(_)).
constraint(occ(_)).
constraint(sunk(_)).
constraint(same_ship(_,_)).
constraint(orientation(_,_)).
constraint(min_length(_,_)).

:- chr_constraint adj_diag/2.
:- chr_constraint adj_ln/2.
:- chr_constraint adj/3.
:- chr_constraint free/1.
:- chr_constraint occ/1.
:- chr_constraint field/1.
:- chr_constraint horizontal/1.
:- chr_constraint vertical/1.
:- chr_constraint same_ship/2.
:- chr_constraint min_length/2.
:- chr_constraint recommended/1.
:- chr_constraint head/1.
:- chr_constraint tail/1.
:- chr_constraint sunk/1.

field(N) ==> N mod 10 > 0 | succ(M,N),adj(M,w,N),adj(N,e,M).
field(N) ==> N > 9 | M is N-10,adj(M,n,N),adj(N,s,M).
field(N) ==> N > 0 | succ(M,N),field(M).
adj(M,w,N),adj(N,n,O) ==> adj(M,nw,O), adj(O,se,M).
adj(M,e,N),adj(N,n,O) ==> adj(M,ne,O), adj(O, sw,M).
adj(N,D,M) ==> member(D,[nw,ne,sw,se])| adj_diag(N,M).

idp_free@ free(A) \ free(A) <=> true.
idp_occ@ occ(A) \ occ(A) <=> true.
idp_hor@ horizontal(A) \ horizontal(A) <=> true.
idp_ver@ vertical(B) \ horizontal(B) <=> true.
idp_head@ head(A) \ head(A) <=> true.
idp_tail@ tail(A) \ tail(A) <=> true.
idp_shp @ same_ship(A,B) \ same_ship(A,B) <=> true.
idp_sunk @ sunk(A) \ sunk(A) <=> true.
%idp_rec @ recommended(A) \ recommended(A) <=> true.

corners @ occ(F),adj_diag(F,G) ==> emit(corners,free(G)).

%unrecommend_occ @ occ(F)\recommended(F) <=> true.
%unrecommend_free @ free(F)\recommended(F) <=> true.

side_v@same_ship(A,B),vertical(B),adj(A,D,C) ==> memberchk(D,[w,e])|emit(side,free(C)).
side_h@same_ship(A,B),horizontal(B),adj(A,D,C) ==> memberchk(D,[n,s])|emit(side,free(C)).

sighting @ occ(N) ==> emit(sighting,head(N)),emit(sighting,tail(N)),recommend_neighbours(N).
connect_ships @ occ(N),occ(M),adj(N,D,M) ==> memberchk(D,[w,e,n,s])|emit(cnn,same_ship(N,M)), emit_orientation(D,N).
symmetrisch @ same_ship(A,B) ==> A\=B | emit(sym,same_ship(B,A)).
% reflexiv @ same_ship(A,A) <=> emit(rfl,true).
transitiv @ same_ship(A,B),same_ship(B,C) ==> A\=C| emit(trn,same_ship(A,C)).
simplify_hor @ same_ship(A,B), horizontal(A) \ horizontal(B) <=> true.
simplify_ver @ same_ship(A,B), vertical(A) \ vertical(B) <=> true.

prop_head @ same_ship(A,B) \ head(B) <=> A<B| emit(prop_head,head(A)).
prop_tail @ same_ship(A,B) \ tail(A) <=> A<B| emit(prop_tail,tail(B)).

sink @ sunk(A) ==> emit(sink,occ(A)).
sink_head @ sunk(A),same_ship(A,B),head(B),adj(B,_,C) ==> C<B| emit(sink_head,free(C)).
sink_tail @ sunk(A),same_ship(A,B),tail(B),adj(B,_,C) ==> C>B|emit(sink_tail,free(C)).


recommend_neighbours(N):-
  forall(
      ( known(adj(N,D,M)),
        memberchk(D,[n,w,s,e]),
        \+ known(recommended(M)),
        \+ known(occ(M)),
        \+ known(free(M))
      ),
      emit(rec_nghb,recommended(M))
  ).

emit_orientation(n,N):-
  emit(cnn,vertical(N)).
emit_orientation(s,N):-
  emit(cnn,vertical(N)).
emit_orientation(w,N):-
  emit(cnn,horizontal(N)).
emit_orientation(e,N):-
  emit(cnn,horizontal(N)).


wall_inv(R,C):-wall(C,R).

wall(A,B):-free([A,B]).

walls:-
  numlist(-1,10,L),
  maplist(wall(-1),L),
  maplist(wall_inv(-1),L),
  maplist(wall(10),L),
  maplist(wall_inv(10),L).

:- dynamic known/1.

memorize(Msg):-
  ( known(Msg)
  -> true
  ; assert(known(Msg))
  ).
