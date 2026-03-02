#!/bin/bash
# Remove all directories with curly-brace suffixes (from aborted codegen)
find /home/stephen-johns/github/iwanttobeapilot/src -type d -name '*}' -exec rm -rf {} + 2>/dev/null
echo "Done. Remaining stray dirs:"
find /home/stephen-johns/github/iwanttobeapilot/src -type d -name '*}' | wc -l
