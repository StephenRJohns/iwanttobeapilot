#!/bin/bash
# Fetches main product image URLs from Sporty's product pages

URLS=(
  "https://www.sportys.com/learn-to-fly-course.html"
  "https://www.sportys.com/instrument-rating-course.html"
  "https://www.sportys.com/s-lax-stereo-headset.html"
  "https://www.sportys.com/sporty-s-pilot-training-bag.html"
  "https://www.sportys.com/sporty-s-ipad-kneeboard.html"
  "https://www.sportys.com/foggles.html"
  "https://www.sportys.com/manual-e6b-flight-computer.html"
)

NAMES=(
  "Learn to Fly Course"
  "Instrument Rating Course"
  "S-LAX Stereo Headset"
  "Sporty's Pilot Training Bag"
  "Sporty's iPad Kneeboard"
  "Foggles"
  "Manual E6B"
)

for i in "${!URLS[@]}"; do
  URL="${URLS[$i]}"
  NAME="${NAMES[$i]}"
  echo "=== ${NAME} ==="
  # Fetch the page and extract CDN image URLs from img src or og:image meta tags
  RESULT=$(curl -s -L \
    -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8" \
    --max-time 15 \
    "$URL")

  # Try og:image first (most reliable main product image)
  OG_IMAGE=$(echo "$RESULT" | grep -oP 'og:image["\s]+content="\K[^"]+' | head -1)
  if [ -z "$OG_IMAGE" ]; then
    OG_IMAGE=$(echo "$RESULT" | grep -oP 'property="og:image" content="\K[^"]+' | head -1)
  fi
  if [ -z "$OG_IMAGE" ]; then
    OG_IMAGE=$(echo "$RESULT" | grep -oP 'content="(https://[^"]*cdn\.shopify\.com[^"]*)"' | grep -oP 'https://[^"]+' | head -1)
  fi

  # Try cdn.shopify.com img src
  if [ -z "$OG_IMAGE" ]; then
    OG_IMAGE=$(echo "$RESULT" | grep -oP 'src="(https://cdn\.shopify\.com[^"]+)"' | grep -oP 'https://[^"]+' | head -1)
  fi

  # Try sportys CDN
  if [ -z "$OG_IMAGE" ]; then
    OG_IMAGE=$(echo "$RESULT" | grep -oP 'src="(https://[^"]*sportys[^"]*\.(jpg|jpeg|png|webp))"' | grep -oP 'https://[^"]+' | head -1)
  fi

  if [ -n "$OG_IMAGE" ]; then
    echo "$OG_IMAGE"
  else
    echo "not found"
  fi
  echo ""
done
