#!/bin/bash
# Download all missing CSS chunks from original site
BASE="https://www.klakna.sbs"
DEST="static/css"
LOG="/tmp/css_download.log"
> "$LOG"

echo "Reading CSS chunk IDs..."
ids=$(cat /tmp/css_chunk_ids.txt)

ok=0
fail=0
skip=0

for id in $ids; do
    f="$DEST/${id}.1774378911945.css"
    if [ -f "$f" ]; then
        skip=$((skip+1))
        continue
    fi
    url="$BASE/static/css/${id}.1774378911945.css"
    curl -sk --connect-timeout 5 "$url" -o "$f"
    if [ -s "$f" ] && [ $(wc -c < "$f") -gt 200 ]; then
        # Check if it's a 404 page
        if grep -q "404 Not Found\|<html>" "$f" 2>/dev/null; then
            rm -f "$f"
            echo "  ✗ $id: 404 page" >> "$LOG"
            fail=$((fail+1))
        else
            sz=$(wc -c < "$f")
            echo "  ✓ $id: $sz bytes" >> "$LOG"
            ok=$((ok+1))
        fi
    else
        rm -f "$f"
        echo "  ✗ $id: download failed" >> "$LOG"
        fail=$((fail+1))
    fi
done

echo ""
echo "=== Results ==="
echo "Downloaded: $ok"
echo "Failed:     $fail"
echo "Skipped:    $skip"
echo ""
echo "=== Failures ==="
grep "✗" "$LOG" || echo "(none)"
