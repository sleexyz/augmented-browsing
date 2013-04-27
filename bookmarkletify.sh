#!/bin/bash
EXPECTED_ARGS=1
if [ $# -ne $EXPECTED_ARGS ]
then
	echo 'Usage: bookmarkletify FILE.js'
	exit
fi

A="javascript: (function(){"
B=$(uglifyjs $1)
C="})();"
echo $A$B$C

