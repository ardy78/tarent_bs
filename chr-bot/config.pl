:- module(config,[config/1]).

config(channel(Chan)):-
  current_prolog_flag(argv,Args),
  args_channel(Args,Chan).

args_channel([],chr_bot).
args_channel([Arg|_], Arg).
