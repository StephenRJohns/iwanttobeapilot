#!/bin/bash
set -e

echo "========================================"
echo "STEP 1: Check for LICENSE file"
echo "========================================"
ls -la /home/stephen-johns/github/iwanttobeapilot/LICENSE* 2>/dev/null || echo "NO LICENSE FILE"

echo ""
echo "========================================"
echo "STEP 2: Check package.json license/author fields"
echo "========================================"
node -e "const p=require('/home/stephen-johns/github/iwanttobeapilot/package.json'); console.log('Project license:', p.license || 'NOT SET'); console.log('Author:', p.author || 'NOT SET');"

echo ""
echo "========================================"
echo "STEP 3: Run license-checker (production deps summary)"
echo "========================================"
npx license-checker --summary --production 2>&1 | head -80

echo ""
echo "========================================"
echo "STEP 4: List dependencies with potentially restrictive licenses"
echo "========================================"
cd /home/stephen-johns/github/iwanttobeapilot && npx license-checker --production --onlyAllow "MIT;ISC;BSD-2-Clause;BSD-3-Clause;Apache-2.0;CC0-1.0;CC-BY-3.0;CC-BY-4.0;Python-2.0;BlueOak-1.0.0;0BSD;Unlicense" 2>&1 | tail -30

echo ""
echo "========================================"
echo "STEP 5: Check for NOTICE, COPYING, ATTRIBUTION files"
echo "========================================"
find /home/stephen-johns/github/iwanttobeapilot -maxdepth 2 -name "NOTICE*" -o -name "COPYING*" -o -name "ATTRIBUTION*" 2>/dev/null

echo ""
echo "========================================"
echo "STEP 6: Check for copyright/license headers in src/"
echo "========================================"
grep -rl "copyright\|Copyright\|LICENSE\|license" /home/stephen-johns/github/iwanttobeapilot/src/ 2>/dev/null | head -20

echo ""
echo "========================================"
echo "STEP 7: Check for Amazon/affiliate/ASIN identifiers in src/"
echo "========================================"
grep -rn "amazon\|affiliate\|asin\|associates" /home/stephen-johns/github/iwanttobeapilot/src/ --include="*.ts" --include="*.tsx" -i | grep -v "node_modules" | head -20

echo ""
echo "========================================"
echo "STEP 8: Check public/ image assets"
echo "========================================"
find /home/stephen-johns/github/iwanttobeapilot/public -type f | head -40

echo ""
echo "========================================"
echo "STEP 9: Check FAA data usage in dpe_data_unifier README"
echo "========================================"
head -20 /home/stephen-johns/github/dpe_data_unifier/README.md

echo ""
echo "========================================"
echo "AUDIT COMPLETE"
echo "========================================"
