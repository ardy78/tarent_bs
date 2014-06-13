:- module(chr_bot,[
          chr_bot/0
          ]).

:- use_module(library(swipredis)).
:- use_module(message).
:- use_module(rules).
:- use_module(config).

chr_bot :-
  init,
  redis_connect(R),
  config(channel(Chan)),
  redis_subscribe_only(R,Chan),
  repeat,
  writeln(startover),
  redis_loop(R).

redis_loop(R) :-
  redis_next_msg(R,Msg),
  process(Msg),
  redis_loop(R).

process([bulk("message"),bulk(ChnCodes),bulk(MsgCodes)]):-
  !,
  atom_codes(Chn,ChnCodes),
  catch(
      ( parse_message(MsgCodes,Sender:Msg),
        ( config(name(Sender))
        -> true
        ; Msg == ohai
        -> fail
        ;  writeln(recv(Chn,Msg)),
           assume(Msg)
        )
      ),
      E,
      writeln(E)
  ).
process(M):-writeln(ignored(M)).

ohai:-fail.
