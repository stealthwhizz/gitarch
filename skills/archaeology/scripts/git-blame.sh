#!/bin/bash
set -e

# Parse JSON input from stdin
read -r input
path=$(echo "$input" | jq -r '.path')
lines=$(echo "$input" | jq -r '.lines // "1,100"')

# Run git blame on the specified file and lines
git blame -L "$lines" "$path" 2>/dev/null || echo "Error: Could not blame $path with lines $lines"
