#!/usr/bin/env sh
#
# Copyright (c) Microsoft Corporation. All rights reserved.
#

case "$1" in
	--inspect*) INSPECT="$1"; shift;;
esac

ROOT="$(dirname "$(dirname "$(readlink -f "$0")")")"

# Check platform requirements
if [[ "$@" != *"--skip-requirements-check"* ]]; then
	$ROOT/bin/helpers/check-requirements-linux.sh
fi

"$ROOT/node" ${INSPECT:-} "$ROOT/out/server-main.js" "$@"
