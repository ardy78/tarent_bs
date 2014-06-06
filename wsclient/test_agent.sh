#!/bin/bash
rm wins1.log
touch wins1.log
rm wins2.log
touch wins2.log

for i in `seq 1 10`;
do


echo "starting round $i";
(
  node index.js > out1.log
  RETVAL=$?
  [ $RETVAL -eq 0 ] && (
      echo Success1; 
      echo win >> wins1.log
  )
  [ $RETVAL -ne 0 ] && echo Failure1
) & (
  node index.js > out2.log
  RETVAL=$?
  [ $RETVAL -eq 0 ] && (
      echo Success2; 
      echo win >> wins2.log
  )
  [ $RETVAL -ne 0 ] && echo Failure2
) & 
wait; 

echo "Finished round $i";

done;

winCount1=0;
while read; do ((winCount1++)); done <wins1.log
winCount2=0;
while read; do ((winCount2++)); done <wins2.log

echo "Player1 won $winCount1 times"
echo "Player2 won $winCount2 times"

echo "done"
