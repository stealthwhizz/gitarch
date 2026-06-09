#!/bin/bash
set -e

# Parse JSON input from stdin
read -r input
keyword=$(echo "$input" | jq -r '.keyword')
limit=$(echo "$input" | jq -r '.limit // 20')

# Search git log for commits related to a keyword
# Show commit hash, author, date, and message
git log --oneline --grep="$keyword" -n "$limit" --format="%h|%an|%ae|%ai|%s" 2>/dev/null | {
    awk -F'|' '{
        print "SHA: " $1 " | Author: " $2 " <" $3 "> | Date: " $4 " | Message: " $5
        print "---"
    }'
} || echo "No commits found matching: $keyword"
