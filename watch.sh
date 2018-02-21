#!/bin/sh

echo "Watching $1"

webpack --config $1/webpack.config.js --watch