#!/bin/bash
HERE=`dirname $_`
BASE=`cd $HERE/.. && pwd`
CHANNEL=$1

swipl -p library=$BASE/gnuprolog-redisclient \
  -l $HERE/chr_bot.pl \
  -t chr_bot \
  $CHANNEL
