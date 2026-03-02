#!/bin/bash
set -e

BASE="/home/stephen-johns/github/iwanttobeapilot/src/app/api"

# Remove stray brace-named directories
rm -rf "${BASE}/discussions/categories}"
rm -rf "${BASE}/discussions/[categorySlug]}"
rm -rf "${BASE}/stories/[id]}"

# Remove empty placeholder directories
rm -rf "${BASE}/discussions/[categorySlug]"
rm -rf "${BASE}/discussions/posts"

echo "Cleanup complete."
ls "${BASE}/discussions/"
ls "${BASE}/stories/"
