#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/node_modules/jsxgraph/distrib"
DST_DIR="$ROOT_DIR/static/vendor"

if [[ ! -d "$SRC_DIR" ]]; then
	echo "JSXGraph source assets not found at $SRC_DIR" >&2
	exit 1
fi

mkdir -p "$DST_DIR"
cp "$SRC_DIR/jsxgraph.css" "$ROOT_DIR/static/jsxgraph.css"
cp "$SRC_DIR/jsxgraphcore.js" "$DST_DIR/jsxgraphcore.js"
cp "$SRC_DIR/jsxgraphcore.js.LICENSE.txt" "$DST_DIR/jsxgraphcore.js.LICENSE.txt"

echo "Synced JSXGraph assets to static/"
