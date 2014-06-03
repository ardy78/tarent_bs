

:- use_module(library(clpfd)).


ship(L,[A,B,C,D],[A,B,C,D]):-
  must_be(integer,L),
  [A,B,C,D] ins 0..9,
  ?(BL) #= ?(B) + L - 1,
  ?(AL) #= ?(A) + L - 1,
  ( (?(A) #= ?(C) #/\ ?(BL) #= ?(D)) #\/ (?(AL) #= ?(C) #/\ ?(B) #= ?(D))
  ).

ship_perimeter([A,B,C,D],[Left,Top,Right,Bottom]):-
  Left #= max( A-1,0),
  Top #= max(B-1,0),
  Right #= min(C+1,9),
  Bottom #= min(D+1,9).

vars_code_expr(Vars,Code):-
  reverse(Vars,RVars),
  rvars_code_expr(RVars,Code).

rvars_code_expr([],0).
rvars_code_expr([Var|RVars],Var + 10 * Expr):-
  rvars_code_expr(RVars,Expr).

rvars_code(RVars,Code):-
  rvars_code_expr(RVars,CodeExpr),
  Code is CodeExpr.

carrier(S,Vars):-ship(5,S,Vars).
cruiser(S,Vars):-ship(4,S,Vars).
destroyer(S,Vars):-ship(3,S,Vars).
submarine(S,Vars):-ship(2,S,Vars).

fleet(Ships,Vars):-
  Ships = [Ca1,Ca2,Cr1,Cr2,De1,De2,Su1,Su2],
  carrier(Ca1,V1),carrier(Ca2,V2),
  cruiser(Cr1,V3),cruiser(Cr2,V4),
  destroyer(De1,V5),destroyer(De2,V6),
  submarine(Su1,V7),submarine(Su2,V8),
  pairs(Ships,Pairs),
  maplist(min_dist,Pairs),
  flatten([V1,V2,V3,V4,V5,V6,V7,V8],Vars).



pairs([], []).
pairs([A|Bs], ABs):-
	pairs_aux(Bs,A,ABs-T),
  pairs(Bs,T).

pairs_aux([],_,T-T).
pairs_aux([B|Bs],A,[[A,B]|Cs]-T):-
	pairs_aux(Bs,A,Cs-T).

min_dist([Ship1,Ship2]):-
  ship_perimeter(Ship2,Ship2Perimeter),
  no_overlap(Ship1,Ship2Perimeter).

no_overlap([A1,A2,B1,B2],[C1,C2,D1,D2]):-
  A1 #> D1 #\/ A2 #> D2 #\/ C1 #> B1 #\/ C2 #> B2.

length_inv(Len,List):-length(List,Len).

arena(A):-
  length(A,10),
  maplist(length_inv(10),A).


arena_field( N,M,Arena, Field):-
  nth0(N,Arena,Row),
  nth0(M,Row,Field).

ship_occupies([N,A,N,B],N,M):-
  between(A,B,M).
ship_occupies([A,M,B,M],N,M):-
  between(A,B,N).

occupied(Arena,[N,M]):-
  arena_field(N,M,Arena,'X').

ship_arena(Ship,Arena):-
  findall([N,M],ship_occupies(Ship,N,M),Fields),
  maplist(occupied(Arena),Fields).

print_arena(Arena):-
  format("   A B C D E F G H I J ~n"),
  print_arena(Arena,1).

print_arena([],11).
print_arena([Row|Rows],D):-
  pad(D,RowNum),
  format("~a|~a|~a|~a|~a|~a|~a|~a|~a|~a|~a|~n",[RowNum|Row]),
  succ(D,E),
  print_arena(Rows,E).

pad(10,'10'):-!.
pad(N,Out):-
  format(atom(Out)," ~d",[N]).


show_ships(Ships):-
  arena(Ar),
  findall([N,M],(
              member(Ship,Ships),
              ship_occupies(Ship,N,M)
          ), Fields),
  maplist(occupied(Ar),Fields),
  term_variables(Ar,Water),
  maplist(=(' '),Water),
  print_arena(Ar).


write_all:-fleet(Ships,Vars),forall(label(Vars),writeln(Ships)).

fill0(A,A):-length(A,32),!.
fill0(As0,As):-fill0([0|As0],As).
fill9(A,A):-length(A,32),!.
fill9(As0,As):-fill9([9|As0],As).

vars_after(Vars,Prev):-
  reverse(Vars,RVars),
  reverse(Prev,RPrev0),
  fill0(RPrev0,RPrev),
  rvars_code_expr(RVars,RVarsExpr),
  rvars_code(RPrev,RPrevCode),
  RVarsExpr #> RPrevCode.

vars_max(Vars,Max):-
  reverse(Vars,RVars),
  reverse(Max,RMax0),
  fill9(RMax0,RMax),
  rvars_code_expr(RVars,RVarsExpr),
  rvars_code(RMax,RMaxCode),
  RVarsExpr #=< RMaxCode.

vars_prefix(Vars,Prefix):-prefix_vars(Prefix,Vars).
prefix_vars([],_).
prefix_vars([A|As],[B|Bs]):-
  A #= B,
  prefix_vars(As,Bs).

write_after(Prev):-
  fleet(Ships,Vars),flatten(Prev,PrevVars),vars_after(Vars,PrevVars),forall(label(Vars),writeln(Ships)).

write_part(Prev,Max):-
  fleet(Ships,Vars),
  flatten(Prev,PrevVars),
  flatten(Max,MaxVars),
  vars_after(Vars,PrevVars),
  vars_max(Vars,MaxVars),
  forall(label(Vars),writeln(Ships)).

suffix_count(Prefix,Count):-
  fleet(Ships,Vars),
  flatten(Prefix,PrefixVars),
  vars_prefix(Vars,PrefixVars),
  aggregate(count,(label(Vars),writeln(Ships)),Count).








