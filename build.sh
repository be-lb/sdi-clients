#!/bin/sh

for COMP in $@
do
    echo "============================================================="
    echo "webpack --config ${COMP}/webpack.config.js  --mode production ${WEBPACK_OPTIONS}"
    echo "============================================================="
    webpack --config ${COMP}/webpack.config.js  --mode production ${WEBPACK_OPTIONS}
done
