#!/bin/bash
abspath="$(cd "${0%/*}" 2>/dev/null; echo "$PWD"/"${0##*/}")"
dir=`dirname "$abspath"`
echo $dir
java -jar $dir/yuicompressor-2.4.2.jar --nomunge $dir/../jquery.j_ku.js -o $dir/../jquery.j_ku.min.js