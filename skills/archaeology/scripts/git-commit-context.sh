#!/bin/bash
set -e

# Parse JSON input from stdin
read -r input
sha=$(echo "$input" | jq -r '.sha')

# Show full commit context: message, author, date, diff
echo "=== COMMIT DETAILS ==="
git show --format=fuller "$sha" | head -50
echo ""
echo "=== COMMIT DIFF ==="
git show "$sha" --stat
