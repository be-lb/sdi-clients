#!/bin/sh

# To build all, something like that will do:
# for i in $(find . -name webpack.config.js -not -path  './node_modules/*'  -exec sh -c 'dirname {}' \;) ; do npm run build $i; done

for COMP in $@
do
    echo "============================================================="
    echo "webpack --config ${COMP}/webpack.config.js  --mode production ${WEBPACK_OPTIONS}"
    echo "============================================================="
    webpack --config ${COMP}/webpack.config.js  --mode production ${WEBPACK_OPTIONS}
done
