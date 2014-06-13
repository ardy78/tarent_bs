:- module(memory,[start/0,reset/0]).

:- use_module(library(swipredis)).
:- use_module(message).
:- use_module(config).


start:-
  config(channel(Chn)),
  redis_subscribe(Chn,MsgData),
  process(MsgData).

process([bulk("message"),bulk(ChnCodes),bulk(MsgCodes)]):-
  !,
  atom_codes(Chn,ChnCodes),
  catch(
      ( parse_message(MsgCodes,Sender:Msg),
        ( config(name(Sender))
        -> fail %ignore our own messages
        ; Msg == ohai
        -> retractall(fact(_)),
           fail
        ;  writeln(recv(Chn,Msg)),
           memorize(Msg),
           fail
        )
      ),
      E,
      writeln(E)
  ).


memorize(Msg):-
  ( fact(Msg)
  -> true
  ; assert(fact(Msg)),


  ).
