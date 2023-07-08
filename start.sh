#!/bin/sh
cd "$(dirname "$0")"

while true
	do
		node .
		echo Restarting in 10 seconds...
		sleep 10
done
