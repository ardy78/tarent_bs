:- module(message,[parse_message/2]).

parse_message(Codes,Msg):-
  phrase(message(Msg),Codes),
  !.
parse_message(Codes,_):-
  throw(invalid_message(Codes)).

message(S:M) --> sender(S),":", predicate(P), arguments(Args),{M =.. [P|Args]}.
message(anonymous:M) --> predicate(P), arguments(Args),{M =.. [P|Args]}.

sender(S)-->name(S).

arguments([Arg|Args]) --> argument(Arg), arguments(Args).
arguments([]) --> [].

argument(F) --> space,field(F).
argument(S) --> space,ship(S).

field(F) --> alphanumeric_field(F).
field(F) --> numeric_field(F).

numeric_field(F) --> integer(F),{between(0,99,F)}.

alphanumeric_field(F) -->column(C),row(R),{F is C + R}.
ship(V) --> variable(V).
predicate(P) --> name(P).

column(Val) --> [Code],{char_code(C,Code),column_value(C,Val)}.
row(R) --> digit(D),{number_codes(R,[D])}.
variable(V) --> space,variable_start_code(First),!, name_inner_codes(Rest), {atom_codes(V,[First|Rest])}.

name(V) --> space,name_start_code(First),!, name_inner_codes(Rest), {atom_codes(V,[First|Rest])}.

name_start_code(Code) --> name_inner_code(Code),{code_type(Code,csymf),code_type(Code,lower)}.

variable_start_code(Code) --> name_inner_code(Code),{code_type(Code,csymf),code_type(Code,upper)},!.
variable_start_code(95) --> "_".

name_inner_codes([Code|Codes]) --> name_inner_code(Code),!,name_inner_codes(Codes).
name_inner_codes([]) -->[].

name_inner_code(Code) --> [Code],{code_type(Code,csym)}.


integer(I) -->	space, digit(D0), digits(D),{ number_codes(I, [D0|D])}.

digits([D|T]) --> digit(D), !, digits(T).
digits([]) --> [].

digit(D) -->[D],{ code_type(D, digit)}.

space --> [S], {code_type(S,space)},!,space.
space --> [].


column_value(a,0).
column_value(b,10).
column_value(c,20).
column_value(d,30).
column_value(e,40).
column_value(f,50).
column_value(g,60).
column_value(h,70).
column_value(i,80).
column_value(j,90).









