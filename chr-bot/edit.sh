#!/bin/bash
HERE=`dirname $_`
BASE=`cd $HERE/.. && pwd`

swipl -p library=$BASE/gnuprolog-redisclient \
  -l $HERE/chr_bot.pl \
  -g 'edit(rules)'
