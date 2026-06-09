#!/bin/bash
set -e

# Parse JSON input from stdin
read -r input
query=$(echo "$input" | jq -r '.query')
limit=$(echo "$input" | jq -r '.limit // 10')

# Search memory for findings related to a query
if [ -f "memory/MEMORY.md" ]; then
    # Extract sections matching the query
    grep -A 5 -i "$query" memory/MEMORY.md | head -n "$((limit * 5))" || echo "No findings matching: $query"
else
    echo "Memory file not found at memory/MEMORY.md"
fi
