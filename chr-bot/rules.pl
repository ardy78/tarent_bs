:- module(rules,[adj_diag/2,free/1,occ/1,adj/3,field/1]).

:- use_module(library(chr)).

:- use_module(library(swipredis)).

:- use_module(config).

%:- chr_constraint leq/2.

%reflexivity  @ leq(X,X) <=> true.
%antisymmetry @ leq(X,Y), leq(Y,X) <=> X = Y.
%idempotence  @ leq(X,Y) \ leq(X,Y) <=> true.
%transitivity @ leq(X,Y), leq(Y,Z) ==> leq(X,Z).

emit(G):-
  config(channel(Chan)),
  redis_connect(C),
  call_cleanup(
      redis_do(C,publish(Chan,G),_),
      redis_disconnect(C)
  ).


:- chr_constraint adj_diag/2.
:- chr_constraint adj/3.
:- chr_constraint free/1.
:- chr_constraint occ/1.
:- chr_constraint field/1.

field(N) ==> N mod 10 > 0 | succ(M,N),adj(M,w,N),adj(N,e,M).
field(N) ==> N > 9 | M is N-10,adj(M,n,N),adj(N,s,M).
field(N) ==> N > 0 | succ(M,N),field(M).
adj(M,w,N),adj(N,n,O) ==> adj(M,nw,O), adj(O,se,M).
adj(M,e,N),adj(N,n,O) ==> adj(M,ne,O), adj(O, sw,M).

adj(N,D,M) ==> member(D,[nw,ne,sw,se])| adj_diag(N,M).

corners @ occ(F),adj_diag(F,G) ==> free(G),emit(free(G)).

wall_inv(R,C):-wall(C,R).

wall(A,B):-free([A,B]).

walls:-
  numlist(-1,10,L),
  maplist(wall(-1),L),
  maplist(wall_inv(-1),L),
  maplist(wall(10),L),
  maplist(wall_inv(10),L).

