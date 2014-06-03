:- use_module(library(clpfd)).
special_solution(SpecialProb,SpecialSolution):-
  special_generic(SpecialProb,GenericProb,Transposition),
  generic_solution(GenericProb,GenericSolution),
  transpose(GenericSolution,Transposition,SpecialSolution).


generic_solution(Prob,Sol):-
  available(Prob,W,H),
  ship_length(Prob,L),
  ship_in_square(L,W,H,Sol).

ship_in_square(L,W,H,[X,Y,D]):-
  succ(WW,W),succ(HH,H),
  D in 0..1,
  X in 0..WW,
  Y in 0..HH,
  D #=0 #/\ X #=< W - L #\/ D #=1 #/\ Y #=< H - L.

quad(Sq,PSq,QSq):-

