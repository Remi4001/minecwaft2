#!/bin/sh
cd "$(dirname "$0")" || return

while true; do
	node .
	echo Restarting in 10 seconds...
	sleep 10
done
