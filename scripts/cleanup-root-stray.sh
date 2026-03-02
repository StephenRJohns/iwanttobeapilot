#!/bin/bash
# Remove stray brace-suffixed directories at project root
cd /home/stephen-johns/github/iwanttobeapilot
rm -rf *\}
echo "Done. Root dir:"
ls
