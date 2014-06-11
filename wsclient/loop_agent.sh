#!/bin/bash

times=$1
agent1=$2
i=1
# consecutive failures
cf=0

while [  "$i" -le "$times" ]; do

echo "starting round $i";
  node index.js $agent1 
  RETVAL=$? 
  echo $RETVAL
  if [ $RETVAL -eq 0 ] 
    then 
      let i=i+1; 
      let cf=0;
      echo "round SUCCESS $i"
  fi
  if [ $RETVAL -eq 1 ] 
    then 
      let cf=cf+1;
      echo "round Failure $i"
  fi
  if [ $cf -eq 3 ] 
    then 
      break
  fi


echo "Finished round $i";
done;

echo "done"
