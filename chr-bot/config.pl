:- module(config,[config/1]).

config(channel(Chan)):-
  current_prolog_flag(argv,Args),
  args_channel(Args,Chan).
config(name(N)):-
  current_prolog_flag(pid,PID),
  atom_concat('chr_bot_',PID,N).
args_channel([],chr_bot).
args_channel([Arg|_], Arg).
