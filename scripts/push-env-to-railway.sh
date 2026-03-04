#!/usr/bin/env bash
set -e

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "No .env file found"
  exit 1
fi

VARS=()
while IFS= read -r line || [ -n "$line" ]; do
  # Skip comments and empty lines
  [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
  VARS+=("$line")
done < "$ENV_FILE"

if [ ${#VARS[@]} -eq 0 ]; then
  echo "No variables found in $ENV_FILE"
  exit 1
fi

echo "Pushing ${#VARS[@]} variables to Railway..."
railway variables set "${VARS[@]}"
echo "Done."
